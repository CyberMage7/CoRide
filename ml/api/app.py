from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime
import joblib
import os
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
try:
    model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'ride_time_estimator.joblib')
    logger.info(f"Loading model from: {model_path}")
    model = joblib.load(model_path)
    logger.info("Model loaded successfully")
    
    # Log expected feature count
    if hasattr(model, 'n_features_in_'):
        logger.info(f"Model expects {model.n_features_in_} features")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    model = None

def haversine_distance(lat1, lon1, lat2, lon2):
    """Calculate the Haversine distance between two points."""
    R = 6371  # Earth's radius in kilometers
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
    c = 2 * np.arcsin(np.sqrt(a))
    return R * c

def process_input_data(data):
    """Process input data for prediction."""
    try:
        logger.debug(f"Processing input data: {data}")
        
        # Calculate distance
        distance = haversine_distance(
            data['source']['latitude'],
            data['source']['longitude'],
            data['destination']['latitude'],
            data['destination']['longitude']
        )
        logger.debug(f"Calculated distance: {distance} km")
        
        # Extract time features
        pickup_time = datetime.fromisoformat(data['pickupTime'].replace('Z', '+00:00'))
        hour = pickup_time.hour
        day_of_week = pickup_time.weekday()
        month = pickup_time.month
        logger.debug(f"Extracted time features - hour: {hour}, day_of_week: {day_of_week}, month: {month}")
        
        # Create feature array with exactly 44 features as expected by the model
        features = np.zeros(44)  # Initialize array with zeros
        
        # Basic features
        features[0] = distance  # distance_km
        features[1] = hour  # hour
        features[2] = day_of_week  # day_of_week
        features[3] = month  # month
        
        # One-hot encode day of week (features 4-10)
        if 0 <= day_of_week < 7:
            features[4 + day_of_week] = 1
        
        # One-hot encode hour (features 11-34)
        if 0 <= hour < 24:
            features[11 + hour] = 1
        
        # One-hot encode month (features 35-46)
        if 1 <= month <= 12:
            features[35 + (month - 1)] = 1
        
        logger.debug(f"Created features array with shape: {features.shape}")
        return features.reshape(1, -1)  # Reshape to 2D array for prediction
        
    except Exception as e:
        logger.error(f"Error in process_input_data: {str(e)}")
        logger.error(traceback.format_exc())
        raise

def validate_input(data):
    """Validate input data."""
    try:
        logger.debug(f"Validating input data: {data}")
        required_fields = ['source', 'destination', 'pickupTime', 'rideType', 'numberOfRiders']
        for field in required_fields:
            if field not in data:
                return False, f"Missing required field: {field}"
        
        # Validate coordinates
        for point in ['source', 'destination']:
            if not isinstance(data[point], dict):
                return False, f"Invalid {point} format"
            if 'latitude' not in data[point] or 'longitude' not in data[point]:
                return False, f"Missing coordinates in {point}"
            if not (-90 <= data[point]['latitude'] <= 90):
                return False, f"Invalid {point} latitude"
            if not (-180 <= data[point]['longitude'] <= 180):
                return False, f"Invalid {point} longitude"
        
        # Validate pickup time format
        try:
            datetime.fromisoformat(data['pickupTime'].replace('Z', '+00:00'))
        except ValueError:
            return False, "Invalid pickup time format"
        
        # Validate ride type
        if data['rideType'] not in ['private', 'shared']:
            return False, "Invalid ride type"
        
        # Validate number of riders
        if not isinstance(data['numberOfRiders'], int) or data['numberOfRiders'] < 1:
            return False, "Invalid number of riders"
        
        return True, ""
    except Exception as e:
        logger.error(f"Error in validate_input: {str(e)}")
        return False, f"Validation error: {str(e)}"

def calculate_realistic_time_estimate(distance_km, hour, day_of_week, ride_type):
    """
    Calculate a realistic time estimate based on distance and other factors
    Args:
        distance_km: Distance in kilometers
        hour: Hour of the day (0-23)
        day_of_week: Day of the week (0=Monday, 6=Sunday)
        ride_type: 'private' or 'shared'
    Returns:
        Estimated time in minutes
    """
    # Base speed in km/h depending on distance (shorter trips have lower average speeds)
    if distance_km < 5:
        base_speed = 18  # Slower for short urban trips
    elif distance_km < 10:
        base_speed = 22  # Medium trips
    else:
        base_speed = 28  # Longer trips with highways
    
    # Time of day adjustments
    is_weekend = day_of_week >= 5
    
    if is_weekend:
        # Weekend traffic patterns
        if 10 <= hour < 13 or 16 <= hour < 20:  # Weekend busy hours
            base_speed *= 0.75  # 25% slower
        elif 13 <= hour < 16:  # Moderate weekend traffic
            base_speed *= 0.85  # 15% slower
        elif 22 <= hour or hour < 6:  # Late night/early morning
            base_speed *= 1.2  # 20% faster
    else:
        # Weekday traffic patterns
        if 8 <= hour < 10:  # Morning rush hour
            base_speed *= 0.6  # 40% slower
        elif 17 <= hour < 20:  # Evening rush hour
            base_speed *= 0.55  # 45% slower
        elif 10 <= hour < 17:  # Daytime traffic
            base_speed *= 0.8  # 20% slower
        elif 20 <= hour < 22:  # Evening traffic
            base_speed *= 0.9  # 10% slower
        elif 22 <= hour or hour < 6:  # Late night/early morning
            base_speed *= 1.2  # 20% faster
    
    # Adjust for ride type
    if ride_type == 'shared':
        base_speed *= 0.85  # Shared rides are slower due to multiple stops
    
    # Calculate time in minutes
    time_minutes = (distance_km / base_speed) * 60
    
    # Add a minimum time and waiting time buffer
    pickup_time = min(5, 2 + distance_km * 0.2)  # Pickup time increases with distance but caps at 5 minutes
    time_minutes += pickup_time
    
    # Ensure minimum time
    return max(time_minutes, 7)  # At least 7 minutes for any ride

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
            
        data = request.get_json()
        logger.debug(f"Received prediction request: {data}")
        
        # Validate input
        is_valid, error_message = validate_input(data)
        if not is_valid:
            logger.warning(f"Invalid input: {error_message}")
            return jsonify({'error': error_message}), 400
        
        # Calculate distance for both prediction methods
        distance = haversine_distance(
            data['source']['latitude'],
            data['source']['longitude'],
            data['destination']['latitude'],
            data['destination']['longitude']
        )
        
        # Extract time features for realistic estimate
        pickup_time = datetime.fromisoformat(data['pickupTime'].replace('Z', '+00:00'))
        hour = pickup_time.hour
        day_of_week = pickup_time.weekday()
        
        # Process input data for ML prediction
        features = process_input_data(data)
        
        # Check if number of features matches what model expects
        expected_feature_count = model.n_features_in_ if hasattr(model, 'n_features_in_') else None
        if expected_feature_count and features.shape[1] != expected_feature_count:
            error_msg = f"Feature count mismatch: expected {expected_feature_count}, got {features.shape[1]}"
            logger.error(error_msg)
            return jsonify({'error': error_msg}), 500
        
        # Make ML prediction
        ml_prediction = model.predict(features)[0]
        logger.debug(f"ML prediction: {ml_prediction} minutes")
        
        # Calculate realistic estimate based on distance and conditions
        realistic_prediction = calculate_realistic_time_estimate(
            distance, hour, day_of_week, data['rideType']
        )
        logger.debug(f"Realistic prediction: {realistic_prediction} minutes")
        
        # Adjust ML prediction based on realistic estimate
        # If ML prediction is way off, use a weighted average that favors the realistic estimate
        if ml_prediction < realistic_prediction * 0.6 or ml_prediction > realistic_prediction * 1.8:
            # ML prediction is too far off, use mostly the realistic prediction
            final_prediction = (realistic_prediction * 0.8) + (ml_prediction * 0.2)
            logger.warning(f"ML prediction significantly off ({ml_prediction} min), using weighted estimate")
        elif ml_prediction < realistic_prediction * 0.75 or ml_prediction > realistic_prediction * 1.5:
            # ML prediction is somewhat off, blend with realistic prediction
            final_prediction = (realistic_prediction * 0.6) + (ml_prediction * 0.4)
            logger.warning(f"ML prediction moderately off ({ml_prediction} min), blending with realistic estimate")
        else:
            # ML prediction seems reasonable, use it with a small influence from the realistic prediction
            final_prediction = (ml_prediction * 0.85) + (realistic_prediction * 0.15)
            logger.debug(f"ML prediction reasonable, using with minor adjustment")
        
        logger.debug(f"Final prediction: {final_prediction} minutes")
        
        # Include route-specific information based on common landmarks
        route_info = None
        
        # Check for known routes and provide more specific guidance
        source_lat = data['source']['latitude']
        source_lng = data['source']['longitude']
        dest_lat = data['destination']['latitude']
        dest_lng = data['destination']['longitude']
        
        # Jaypee Institute to IIT Delhi special case
        if (28.52 < source_lat < 28.53 and 77.36 < source_lng < 77.37 and
            28.54 < dest_lat < 28.55 and 77.19 < dest_lng < 77.20):
            hour = pickup_time.hour
            if 8 <= hour < 10 or 17 <= hour < 20:
                route_info = "This route often experiences heavy traffic during rush hour. Consider adding extra buffer time."
                final_prediction = max(final_prediction, 35)  # Minimum 35 minutes during rush hours
            else:
                route_info = "Traffic on this route is usually moderate outside rush hours."
                final_prediction = max(final_prediction, 26)  # Minimum 26 minutes during normal hours
        
        return jsonify({
            'predictedTime': float(final_prediction),
            'distance': float(distance),
            'mlPrediction': float(ml_prediction),
            'realisticEstimate': float(realistic_prediction),
            'routeInfo': route_info
        })
        
    except Exception as e:
        logger.error(f"Error in predict endpoint: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)