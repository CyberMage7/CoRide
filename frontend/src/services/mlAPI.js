import axios from 'axios';

const baseURL = import.meta.env.VITE_ML_API_URL || 'http://localhost:5000';

export const getMLPrediction = async (data) => {
    try {
        console.log('Sending prediction request with data:', data);
        const response = await axios.post(`${baseURL}/predict`, {
            source: {
                latitude: data.source.latitude,
                longitude: data.source.longitude
            },
            destination: {
                latitude: data.destination.latitude,
                longitude: data.destination.longitude
            },
            pickupTime: data.pickupTime,
            rideType: data.rideType,
            numberOfRiders: data.numberOfRiders
        });
        
        if (response.data.error) {
            console.error('API returned error:', response.data.error);
            throw new Error(response.data.error);
        }
        
        console.log('Prediction response:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Server responded with error:', {
                status: error.response.status,
                data: error.response.data
            });
            throw new Error(error.response.data.error || `Server error: ${error.response.status}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            throw new Error('No response from prediction service. Please check if the service is running.');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
            throw new Error(`Request error: ${error.message}`);
        }
    }
};

export const checkMLServiceHealth = async () => {
    try {
        const response = await axios.get(`${baseURL}/health`);
        const isHealthy = response.data.status === 'ok' && response.data.model_loaded;
        console.log('ML service health check:', { isHealthy, response: response.data });
        return isHealthy;
    } catch (error) {
        console.error('Error checking ML service health:', error);
        return false;
    }
}; 