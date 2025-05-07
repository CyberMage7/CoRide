import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from datetime import datetime

def load_data(file_path):
    """Load the ride data from CSV file"""
    df = pd.read_csv(file_path)
    # Convert pickup_time to datetime if it's not already
    if not pd.api.types.is_datetime64_any_dtype(df['pickup_time']):
        df['pickup_time'] = pd.to_datetime(df['pickup_time'])
    return df

def extract_time_features(df):
    """Extract time-based features from pickup_time"""
    # Extract basic time features
    df['hour'] = df['pickup_time'].dt.hour
    df['day_of_week'] = df['pickup_time'].dt.dayofweek
    df['month'] = df['pickup_time'].dt.month
    
    # Create binary features
    df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
    df['is_rush_hour'] = ((df['hour'] >= 8) & (df['hour'] < 10) | 
                         (df['hour'] >= 17) & (df['hour'] < 19)).astype(int)
    
    return df

def encode_categorical_features(df):
    """Encode categorical features"""
    # Convert ride_type to binary
    df['is_shared'] = (df['ride_type'] == 'shared').astype(int)
    
    # One-hot encode day of week
    day_dummies = pd.get_dummies(df['day_of_week'], prefix='day')
    df = pd.concat([df, day_dummies], axis=1)
    
    # One-hot encode hour (optional, can be commented out)
    hour_dummies = pd.get_dummies(df['hour'], prefix='hour')
    df = pd.concat([df, hour_dummies], axis=1)
    
    return df

def create_final_feature_set(df):
    """Create the final feature set for model training"""
    # Define feature columns
    geographical_features = [
        'source_lat', 'source_lng',
        'dest_lat', 'dest_lng',
        'distance_km'
    ]
    
    time_features = [
        'hour', 'day_of_week', 'month',
        'is_weekend', 'is_rush_hour'
    ]
    
    # Add one-hot encoded day and hour features
    day_features = [col for col in df.columns if col.startswith('day_')]
    hour_features = [col for col in df.columns if col.startswith('hour_')]
    
    ride_features = [
        'is_shared',
        'num_riders'
    ]
    
    # Combine all features
    feature_columns = (
        geographical_features +
        time_features +
        day_features +
        hour_features +
        ride_features
    )
    
    # Create feature matrix and target variable
    X = df[feature_columns]
    y = df['duration_minutes']
    
    return X, y

def preprocess_data(input_file='data/ride_data.csv', 
                   output_dir='data/processed'):
    """Main preprocessing function"""
    # Load data
    print("Loading data...")
    df = load_data(input_file)
    
    # Extract time features
    print("Extracting time features...")
    df = extract_time_features(df)
    
    # Encode categorical features
    print("Encoding categorical features...")
    df = encode_categorical_features(df)
    
    # Create final feature set
    print("Creating final feature set...")
    X, y = create_final_feature_set(df)
    
    # Split data into training and testing sets
    print("Splitting data into training and testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Save processed data
    print("Saving processed data...")
    # Create output directory if it doesn't exist
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    # Save feature names
    pd.Series(X.columns).to_csv(f'{output_dir}/feature_names.csv', index=False)
    
    # Save training data
    X_train.to_csv(f'{output_dir}/X_train.csv', index=False)
    y_train.to_csv(f'{output_dir}/y_train.csv', index=False)
    
    # Save testing data
    X_test.to_csv(f'{output_dir}/X_test.csv', index=False)
    y_test.to_csv(f'{output_dir}/y_test.csv', index=False)
    
    print(f"Processed data saved to {output_dir}")
    print(f"Training set size: {len(X_train)} samples")
    print(f"Testing set size: {len(X_test)} samples")
    
    return X_train, X_test, y_train, y_test

if __name__ == "__main__":
    preprocess_data() 