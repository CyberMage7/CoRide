import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import cross_val_score
import joblib
import os
import json

def load_processed_data(data_dir='data/processed'):
    """Load the preprocessed training and testing data"""
    X_train = pd.read_csv(f'{data_dir}/X_train.csv')
    X_test = pd.read_csv(f'{data_dir}/X_test.csv')
    y_train = pd.read_csv(f'{data_dir}/y_train.csv').squeeze()
    y_test = pd.read_csv(f'{data_dir}/y_test.csv').squeeze()
    feature_names = pd.read_csv(f'{data_dir}/feature_names.csv').squeeze().tolist()
    return X_train, X_test, y_train, y_test, feature_names

def train_models(X_train, y_train):
    """Train multiple regression models"""
    models = {
        'Linear Regression': LinearRegression(),
        'Ridge Regression': Ridge(alpha=1.0),
        'Random Forest': RandomForestRegressor(
            n_estimators=100,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        ),
        'Gradient Boosting': GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        ),
        'XGBoost': XGBRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
    }
    
    trained_models = {}
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        trained_models[name] = model
    
    return trained_models

def evaluate_models(models, X_test, y_test):
    """Evaluate multiple models and return metrics"""
    metrics = {}
    for name, model in models.items():
        y_pred = model.predict(X_test)
        
        model_metrics = {
            'MAE': mean_absolute_error(y_test, y_pred),
            'RMSE': np.sqrt(mean_squared_error(y_test, y_pred)),
            'R2': r2_score(y_test, y_pred)
        }
        
        # Calculate cross-validation scores
        cv_scores = cross_val_score(model, X_test, y_test, cv=5, scoring='neg_mean_squared_error')
        model_metrics['CV_RMSE'] = np.sqrt(-cv_scores.mean())
        
        metrics[name] = model_metrics
    
    return metrics

def plot_feature_importance(model, feature_names, model_name):
    """Plot feature importance for tree-based models"""
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        indices = np.argsort(importances)[::-1]
        
        plt.figure(figsize=(12, 6))
        plt.title(f'Feature Importance - {model_name}')
        plt.bar(range(len(importances)), importances[indices])
        plt.xticks(range(len(importances)), [feature_names[i] for i in indices], rotation=90)
        plt.tight_layout()
        plt.savefig(f'models/feature_importance_{model_name.lower().replace(" ", "_")}.png')
        plt.close()

def plot_residuals(y_test, y_pred, model_name):
    """Plot residuals for model evaluation"""
    residuals = y_test - y_pred
    
    plt.figure(figsize=(12, 6))
    plt.scatter(y_pred, residuals, alpha=0.5)
    plt.axhline(y=0, color='r', linestyle='--')
    plt.title(f'Residual Plot - {model_name}')
    plt.xlabel('Predicted Values')
    plt.ylabel('Residuals')
    plt.tight_layout()
    plt.savefig(f'models/residuals_{model_name.lower().replace(" ", "_")}.png')
    plt.close()

def plot_predicted_vs_actual(y_test, y_pred, model_name):
    """Plot predicted vs actual values"""
    plt.figure(figsize=(8, 8))
    plt.scatter(y_test, y_pred, alpha=0.5)
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
    plt.title(f'Predicted vs Actual - {model_name}')
    plt.xlabel('Actual Values')
    plt.ylabel('Predicted Values')
    plt.tight_layout()
    plt.savefig(f'models/predicted_vs_actual_{model_name.lower().replace(" ", "_")}.png')
    plt.close()

def save_best_model(models, metrics):
    """Save the best performing model based on RMSE"""
    best_model_name = min(metrics.items(), key=lambda x: x[1]['RMSE'])[0]
    best_model = models[best_model_name]
    
    os.makedirs('models', exist_ok=True)
    model_path = f'models/ride_time_estimator.joblib'
    joblib.dump(best_model, model_path)
    
    # Save model metadata
    metadata = {
        'model_name': best_model_name,
        'metrics': metrics[best_model_name],
        'timestamp': pd.Timestamp.now().isoformat()
    }
    
    with open('models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=4)
    
    return model_path, best_model_name

def train_and_evaluate():
    """Main function to train and evaluate multiple models"""
    print("Loading processed data...")
    X_train, X_test, y_train, y_test, feature_names = load_processed_data()
    
    print("Training models...")
    models = train_models(X_train, y_train)
    
    print("Evaluating models...")
    metrics = evaluate_models(models, X_test, y_test)
    
    print("\nModel Performance Metrics:")
    for model_name, model_metrics in metrics.items():
        print(f"\n{model_name}:")
        for metric, value in model_metrics.items():
            print(f"{metric}: {value:.2f}")
    
    # Create visualizations
    print("\nCreating visualizations...")
    for name, model in models.items():
        y_pred = model.predict(X_test)
        plot_residuals(y_test, y_pred, name)
        plot_predicted_vs_actual(y_test, y_pred, name)
        plot_feature_importance(model, feature_names, name)
    
    # Save best model
    print("\nSaving best model...")
    model_path, best_model_name = save_best_model(models, metrics)
    print(f"Best model ({best_model_name}) saved to {model_path}")
    
    return models, metrics

if __name__ == "__main__":
    train_and_evaluate() 