import { useState, useEffect } from 'react';

export default function useGeolocation() {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { latitude: 0, longitude: 0, accuracy: 0 },
    error: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        loaded: true,
        error: "Geolocation is not supported by your browser"
      });
      return;
    }

    const onSuccess = (position) => {
      setLocation({
        loaded: true,
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        },
        error: null
      });
    };

    const onError = (error) => {
      setLocation({
        loaded: true,
        coordinates: { latitude: 0, longitude: 0, accuracy: 0 },
        error: error.message
      });
    };

    // Options for better accuracy
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const watcher = navigator.geolocation.watchPosition(onSuccess, onError, options);

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return location;
}