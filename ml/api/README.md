# Ride Time Prediction API

This Flask API provides ride time predictions using the trained machine learning model.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the API:
```bash
python app.py
```

The API will start on `http://localhost:5000`

## API Endpoints

### 1. Health Check
```
GET /health
```
Response:
```json
{
    "status": "healthy",
    "model_loaded": true
}
```

### 2. Ride Time Prediction
```
POST /predict
```
Request body:
```json
{
    "source_lat": 28.6881,
    "source_lng": 77.2123,
    "dest_lat": 28.5450,
    "dest_lng": 77.1926,
    "pickup_time": "2023-05-01T08:30:00",
    "ride_type": "shared",
    "num_riders": 2
}
```

Response:
```json
{
    "success": true,
    "prediction": {
        "duration_minutes": 45.23,
        "distance_km": 15.67,
        "is_rush_hour": true,
        "is_weekend": false
    }
}
```

## Error Handling

The API returns appropriate error messages with status codes:

- 400: Bad Request (invalid input data)
- 500: Internal Server Error (server-side issues)

Example error response:
```json
{
    "success": false,
    "error": "Missing required field: source_lat"
}
```

## Input Validation

The API validates:
- Required fields presence
- Coordinate ranges (-90 to 90)
- Pickup time format (ISO format)
- Ride type values ('shared' or 'private')
- Number of riders (positive integer)

## Production Deployment

For production deployment:
1. Use gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

2. Set up proper environment variables
3. Implement proper logging
4. Add authentication if needed 