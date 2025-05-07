# Ride Time Estimation ML System

This directory contains the machine learning system for ride time estimation in the CoRide application.

## Data Generation

The `generate_ride_data.py` script creates a synthetic dataset of ride information with the following features:

- Source and destination educational institutions in Delhi-NCR
- Pickup times with realistic distribution
- Ride types (shared/private)
- Number of riders
- Distance and duration calculations
- Time-of-day and day-of-week traffic patterns

### Requirements

Install the required Python packages:
```bash
pip install -r requirements.txt
```

### Usage

1. Generate the dataset:
```bash
python generate_ride_data.py
```

2. Preprocess the data:
```bash
python preprocess_data.py
```

3. Train and evaluate models:
```bash
python train_model.py
```

## Data Features

The generated dataset includes:
- Source and destination institution names and coordinates
- Pickup time (datetime)
- Ride type (shared/private)
- Number of riders
- Distance in kilometers
- Duration in minutes (factoring in traffic patterns)

## Traffic Pattern Factors

The script considers:
- Rush hours (8-10 AM, 5-7 PM): 50% longer duration
- Moderate traffic (10 AM-12 PM, 2-5 PM): 20% longer duration
- Weekdays: 20% longer duration than weekends
- Shared rides: 30% longer duration than private rides

## Model Training

The system implements and compares multiple regression models:
- Linear Regression (baseline)
- Ridge Regression
- Random Forest Regressor
- Gradient Boosting Regressor
- XGBoost Regressor

### Model Evaluation

Each model is evaluated using:
- Mean Absolute Error (MAE)
- Root Mean Squared Error (RMSE)
- R-squared (R²)
- Cross-validated RMSE

### Visualizations

The training process generates several visualizations for each model:
- Feature importance plots (for tree-based models)
- Residual plots
- Predicted vs actual value plots

These visualizations are saved in the `ml/models` directory and help in understanding:
- Which features are most important for prediction
- How well the model fits the data
- Any systematic errors in predictions

## Directory Structure

```
ml/
├── data/
│   ├── ride_data.csv           # Raw generated data
│   └── processed/              # Preprocessed data
│       ├── X_train.csv
│       ├── X_test.csv
│       ├── y_train.csv
│       └── y_test.csv
├── models/
│   ├── ride_time_estimator.joblib  # Best trained model
│   ├── model_metadata.json      # Model performance metrics
│   ├── feature_importance_*.png # Feature importance plots
│   ├── residuals_*.png          # Residual plots
│   └── predicted_vs_actual_*.png # Prediction accuracy plots
├── generate_ride_data.py       # Data generation script
├── preprocess_data.py          # Data preprocessing script
├── train_model.py             # Model training script
└── requirements.txt           # Python dependencies
``` 