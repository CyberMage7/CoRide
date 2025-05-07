import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
from math import radians, sin, cos, sqrt, atan2

# Educational institutions in Delhi-NCR with accurate coordinates
INSTITUTIONS = {
    # Delhi
    "Delhi University": {"lat": 28.6891, "lng": 77.2087},
    "IIT Delhi": {"lat": 28.5456, "lng": 77.1924},
    "JNU": {"lat": 28.5399, "lng": 77.1674},
    "DTU": {"lat": 28.7495, "lng": 77.1184},
    "NSIT": {"lat": 28.6091, "lng": 77.0378},
    
    # Noida
    "Amity University": {"lat": 28.5445, "lng": 77.3325},
    "Galgotias University": {"lat": 28.4507, "lng": 77.4908},
    "Noida International University": {"lat": 28.3965, "lng": 77.5007},
    "Jaypee Institute": {"lat": 28.5244, "lng": 77.3656},
    "Shiv Nadar University": {"lat": 28.5266, "lng": 77.5757},
    
    # Ghaziabad
    "ABES Engineering College": {"lat": 28.6324, "lng": 77.4490},
    "IMS Ghaziabad": {"lat": 28.6700, "lng": 77.4382},
    "KIET Group of Institutions": {"lat": 28.7530, "lng": 77.4973},
    "Hindu College of Engineering": {"lat": 28.6764, "lng": 77.5043},
    "ITS Engineering College": {"lat": 28.6763, "lng": 77.3823}
}

# Popular landmarks in Delhi-NCR
LANDMARKS = {
    "India Gate": {"lat": 28.6129, "lng": 77.2295},
    "Qutub Minar": {"lat": 28.5245, "lng": 77.1855},
    "Lotus Temple": {"lat": 28.5535, "lng": 77.2588},
    "Red Fort": {"lat": 28.6562, "lng": 77.2410},
    "Connaught Place": {"lat": 28.6315, "lng": 77.2167},
    "DLF Mall of India": {"lat": 28.5671, "lng": 77.3263},
    "Akshardham Temple": {"lat": 28.6127, "lng": 77.2773},
    "Select Citywalk": {"lat": 28.5289, "lng": 77.2195},
    "Cyber Hub": {"lat": 28.4946, "lng": 77.0893},
    "Greater Kailash": {"lat": 28.5562, "lng": 77.2249}
}

# Combine all locations
ALL_LOCATIONS = {**INSTITUTIONS, **LANDMARKS}

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points
    on the earth (specified in decimal degrees)
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    r = 6371  # Radius of earth in kilometers
    return r * c

def get_time_factor(hour, weekday):
    """Get time-based duration factor based on hour of day and day of week"""
    # Define rush hour factor based on weekday and hour
    is_weekend = weekday >= 5  # 0=Monday, 6=Sunday
    
    # Weekend traffic patterns
    if is_weekend:
        if 10 <= hour < 13 or 16 <= hour < 20:  # Weekend rush hours
            return 1.3
        elif 13 <= hour < 16:  # Moderate weekend traffic
            return 1.1
        else:  # Light weekend traffic
            return 0.9
    # Weekday traffic patterns    
    else:
        if 8 <= hour < 10:  # Morning rush hour
            return 1.7
        elif 17 <= hour < 20:  # Evening rush hour
            return 1.8
        elif 10 <= hour < 17:  # Daytime traffic
            return 1.2
        elif 20 <= hour < 22:  # Evening traffic
            return 1.1
        else:  # Night time, light traffic
            return 0.9

def calculate_realistic_duration(distance, hour, weekday, ride_type):
    """Calculate a realistic ride duration based on real-world factors"""
    # Base speeds in km/h for different distance ranges (Delhi traffic)
    if distance < 5:
        base_speed = 18  # Slow in short urban routes due to traffic lights
    elif distance < 10:
        base_speed = 22  # Medium distance
    else:
        base_speed = 28  # Longer distance with some highway segments
    
    # Calculate base duration in minutes
    base_duration = (distance / base_speed) * 60
    
    # Apply time factor
    time_factor = get_time_factor(hour, weekday)
    
    # Apply ride type factor (shared rides take longer)
    ride_type_factor = 1.3 if ride_type == "shared" else 1.0
    
    # Apply slight randomness to simulate variation
    random_factor = random.uniform(0.92, 1.08)
    
    # Calculate final duration
    duration = base_duration * time_factor * ride_type_factor * random_factor
    
    # Add fixed time for pickup/drop-off (minutes)
    pickup_time = random.uniform(2, 5)
    
    # Ensure minimum ride time
    return max(round(duration + pickup_time, 1), 7)  # Minimum 7 minutes

def generate_ride_data(num_samples=5000, start_date="2023-01-01", end_date="2023-12-31"):
    """Generate synthetic ride data with realistic travel times"""
    rides = []
    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.strptime(end_date, "%Y-%m-%d")
    date_range = (end_date - start_date).days
    
    # Create reference pairs for specific routes to ensure consistency
    reference_pairs = {}
    
    for _ in range(num_samples):
        # Randomly select source and destination
        source, dest = random.sample(list(ALL_LOCATIONS.keys()), 2)
        source_coords = ALL_LOCATIONS[source]
        dest_coords = ALL_LOCATIONS[dest]
        
        # Calculate distance
        distance = haversine_distance(
            source_coords["lat"], source_coords["lng"],
            dest_coords["lat"], dest_coords["lng"]
        )
        
        # Generate random pickup time
        random_days = random.randint(0, date_range)
        random_hours = random.randint(0, 23)
        random_minutes = random.randint(0, 59)
        pickup_time = start_date + timedelta(days=random_days, hours=random_hours, minutes=random_minutes)
        
        # Determine ride type and number of riders
        ride_type = random.choice(["shared", "private"])
        num_riders = random.randint(1, 4) if ride_type == "shared" else 1
        
        # Check if this source-dest pair exists in our reference
        pair_key = f"{source}->{dest}"
        if pair_key in reference_pairs:
            # Get the reference travel time and apply time-based variation
            ref_duration = reference_pairs[pair_key]
            time_factor = get_time_factor(pickup_time.hour, pickup_time.weekday())
            duration = ref_duration * time_factor * random.uniform(0.95, 1.05)
        else:
            # Calculate realistic duration
            duration = calculate_realistic_duration(
                distance, pickup_time.hour, pickup_time.weekday(), ride_type
            )
            # Store reference for future consistency
            reference_pairs[pair_key] = duration / get_time_factor(pickup_time.hour, pickup_time.weekday())
        
        rides.append({
            "source_name": source,
            "source_lat": source_coords["lat"],
            "source_lng": source_coords["lng"],
            "dest_name": dest,
            "dest_lat": dest_coords["lat"],
            "dest_lng": dest_coords["lng"],
            "pickup_time": pickup_time,
            "hour": pickup_time.hour,
            "day_of_week": pickup_time.weekday(),
            "month": pickup_time.month,
            "ride_type": ride_type,
            "num_riders": num_riders,
            "distance_km": round(distance, 2),
            "duration_minutes": round(duration, 1),
            "is_weekend": 1 if pickup_time.weekday() >= 5 else 0,
            "is_rush_hour": 1 if (8 <= pickup_time.hour < 10 or 17 <= pickup_time.hour < 20) else 0
        })
    
    return pd.DataFrame(rides)

def add_specific_routes(df):
    """Add specific known routes to the dataset for benchmarking"""
    specific_routes = [
        # Example: Jaypee Institute to IIT Delhi
        {
            "source_name": "Jaypee Institute",
            "dest_name": "IIT Delhi",
            "ride_type": "private",
            "num_riders": 1,
            "hour": 10,  # Non-rush hour
            "day_of_week": 2,  # Wednesday
            "month": 3,
            "duration_minutes": 30  # Known duration - 30 minutes
        },
        # Same route during rush hour
        {
            "source_name": "Jaypee Institute",
            "dest_name": "IIT Delhi",
            "ride_type": "private",
            "num_riders": 1,
            "hour": 18,  # Evening rush hour
            "day_of_week": 2,  # Wednesday
            "month": 3,
            "duration_minutes": 40  # Longer during rush hour
        },
        # From Connaught Place to Delhi University
        {
            "source_name": "Connaught Place",
            "dest_name": "Delhi University",
            "ride_type": "private",
            "num_riders": 1,
            "hour": 9,  # Morning rush hour
            "day_of_week": 1,  # Tuesday
            "month": 5,
            "duration_minutes": 35  # Known duration
        }
    ]
    
    for route in specific_routes:
        source_coords = ALL_LOCATIONS[route["source_name"]]
        dest_coords = ALL_LOCATIONS[route["dest_name"]]
        
        distance = haversine_distance(
            source_coords["lat"], source_coords["lng"],
            dest_coords["lat"], dest_coords["lng"]
        )
        
        # Generate pickup time
        pickup_time = datetime(2023, route["month"], 15, route["hour"], 0)
        df = df._append({
            "source_name": route["source_name"],
            "source_lat": source_coords["lat"],
            "source_lng": source_coords["lng"],
            "dest_name": route["dest_name"],
            "dest_lat": dest_coords["lat"],
            "dest_lng": dest_coords["lng"],
            "pickup_time": pickup_time,
            "hour": route["hour"],
            "day_of_week": route["day_of_week"],
            "month": route["month"],
            "ride_type": route["ride_type"],
            "num_riders": route["num_riders"],
            "distance_km": round(distance, 2),
            "duration_minutes": route["duration_minutes"],
            "is_weekend": 1 if route["day_of_week"] >= 5 else 0,
            "is_rush_hour": 1 if (8 <= route["hour"] < 10 or 17 <= route["hour"] < 20) else 0
        }, ignore_index=True)
    
    return df

if __name__ == "__main__":
    # Generate the dataset
    df = generate_ride_data(num_samples=5000)
    
    # Add specific benchmark routes
    df = add_specific_routes(df)
    
    # Verify the data for key routes
    print("\nSample data for specific routes:")
    for _, row in df[df["source_name"] == "Jaypee Institute"].head(3).iterrows():
        print(f"From {row['source_name']} to {row['dest_name']}: {row['duration_minutes']} minutes")
    
    # Save to CSV
    df.to_csv("data/ride_data.csv", index=False)
    print(f"\nGenerated {len(df)} ride samples and saved to data/ride_data.csv")
    
    # Print statistics
    print("\nData Statistics:")
    print(f"Average distance: {df['distance_km'].mean():.2f} km")
    print(f"Average duration: {df['duration_minutes'].mean():.2f} minutes")
    print(f"Min duration: {df['duration_minutes'].min():.2f} minutes")
    print(f"Max duration: {df['duration_minutes'].max():.2f} minutes")
    
    # Time calculations
    rush_hour_avg = df[df["is_rush_hour"] == 1]["duration_minutes"].mean()
    non_rush_hour_avg = df[df["is_rush_hour"] == 0]["duration_minutes"].mean()
    print(f"\nRush hour avg: {rush_hour_avg:.2f} minutes")
    print(f"Non-rush hour avg: {non_rush_hour_avg:.2f} minutes")
    print(f"Rush hour factor: {rush_hour_avg/non_rush_hour_avg:.2f}x")