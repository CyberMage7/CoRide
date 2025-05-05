import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import useLocalStorage from "../hooks/useLocalStorage";
import useGeolocation from "../hooks/useGeoLocation";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { debounce } from "../utils/helpers";
import { FaMapMarkerAlt, FaMapPin, FaLock, FaTimes, FaCar, FaUsers, FaChevronRight, FaClock } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createRide } from "../services/operations/rideAPI";

function Ride() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get auth and ride states from Redux
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.rides);
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const sourceMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const routingControlRef = useRef(null);
  const routingMachineRef = useRef(null);

  const [userPosition, setUserPosition] = useLocalStorage("USER_MARKER", {
    latitude: 28.6139,
    longitude: 77.2090,
  });
  
  const location = useGeolocation();
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // State for ride selection and user state
  const [rideType, setRideType] = useState("private");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // State for search inputs
  const [sourceInput, setSourceInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [sourceLocation, setSourceLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [suggestions, setSuggestions] = useState({ source: [], destination: [] });
  const [activeInput, setActiveInput] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // New pre-booking state
  const [pickupTime, setPickupTime] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is logged in using token from Redux
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  // Initialize map
  useEffect(() => {
    if (!mapInstanceRef.current && mapContainerRef.current) {
      // Create map instance with custom styling
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([userPosition.latitude, userPosition.longitude], 13);

      // Add custom styled tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapInstanceRef.current);

      // Add zoom control in a better position
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstanceRef.current);

      // Add attribution in a better position
    //   L.control.attribution({
    //     position: 'bottomleft'
    //   }).addTo(mapInstanceRef.current);

      // Force a resize to ensure the map renders correctly
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          setMapInitialized(true);
        }
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Modern pulsing user location marker
  const createUserLocationIcon = () => {
    return L.divIcon({
      className: 'user-location-marker',
      html: `
        <div class="pulse-container">
          <div class="pulse-core"></div>
          <div class="pulse-circle"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Modern source marker
  const createSourceIcon = () => {
    return L.divIcon({
      className: 'source-marker',
      html: `
        <div class="custom-marker source-marker-inner">
          <div class="marker-icon">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path fill="#10B981" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div class="marker-shadow"></div>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });
  };

  // Modern destination marker
  const createDestinationIcon = () => {
    return L.divIcon({
      className: 'destination-marker',
      html: `
        <div class="custom-marker destination-marker-inner">
          <div class="marker-icon">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path fill="#EF4444" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div class="marker-shadow"></div>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    });
  };

  // Handle location updates
  useEffect(() => {
    if (mapInitialized && location.loaded && !location.error && mapInstanceRef.current) {
      const { latitude, longitude } = location.coordinates;
      
      // Update stored position
      setUserPosition({ latitude, longitude });

      // Remove existing marker and accuracy circle
      if (userMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
      }
      
      if (accuracyCircleRef.current) {
        mapInstanceRef.current.removeLayer(accuracyCircleRef.current);
      }

      // Add accuracy circle with modern styling
      if (location.coordinates.accuracy) {
        accuracyCircleRef.current = L.circle(
          [latitude, longitude],
          {
            radius: location.coordinates.accuracy,
            fillColor: 'rgba(59, 130, 246, 0.2)',
            fillOpacity: 0.5,
            stroke: true,
            color: 'rgba(59, 130, 246, 0.6)',
            weight: 1
          }
        ).addTo(mapInstanceRef.current);
      }

      // Add modern pulsing user marker
      userMarkerRef.current = L.marker(
        [latitude, longitude],
        { icon: createUserLocationIcon() }
      ).addTo(mapInstanceRef.current);

      // Center map on user location
      mapInstanceRef.current.setView([latitude, longitude], 16);
    }
  }, [location, setUserPosition, mapInitialized]);

  // Function to search for locations
  const searchLocation = async (query, type) => {
    if (!query || query.length < 3) {
      setSuggestions({ ...suggestions, [type]: [] });
      return;
    }

    setIsLoading(true);

    try {
      // Using Nominatim for geocoding (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      
      const formattedResults = data.map(item => ({
        id: item.place_id,
        name: item.display_name,
        shortName: item.display_name.split(',')[0],
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }));
      
      setSuggestions({ ...suggestions, [type]: formattedResults });
    } catch (error) {
      console.error("Error searching for location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search to prevent too many API calls
  const debouncedSearch = useRef(
    debounce((query, type) => searchLocation(query, type), 300)
  ).current;

  // Handle input changes
  const handleInputChange = (e, type) => {
    const value = e.target.value;
    if (type === 'source') {
      setSourceInput(value);
    } else {
      setDestinationInput(value);
    }
    setActiveInput(type);
    debouncedSearch(value, type);
  };

  // Clear input field
  const handleClearInput = (type) => {
    if (type === 'source') {
      setSourceInput('');
      setSourceLocation(null);
      if (sourceMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(sourceMarkerRef.current);
        sourceMarkerRef.current = null;
      }
    } else {
      setDestinationInput('');
      setDestinationLocation(null);
      if (destinationMarkerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(destinationMarkerRef.current);
        destinationMarkerRef.current = null;
      }
    }

    // Remove route if either input is cleared
    if (routingMachineRef.current) {
      mapInstanceRef.current.removeControl(routingMachineRef.current);
      routingMachineRef.current = null;
      setRouteInfo(null);
    }

    setSuggestions({ ...suggestions, [type]: [] });
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion, type) => {
    if (type === 'source') {
      setSourceInput(suggestion.shortName || suggestion.name.split(',')[0]);
      setSourceLocation(suggestion);
      
      // Remove previous marker if exists
      if (sourceMarkerRef.current) {
        mapInstanceRef.current.removeLayer(sourceMarkerRef.current);
      }
      
      // Add marker for source location with animation
      sourceMarkerRef.current = L.marker(
        [suggestion.latitude, suggestion.longitude],
        { 
          icon: createSourceIcon(),
          opacity: 0
        }
      ).addTo(mapInstanceRef.current)
        .bindPopup(`<div class="custom-popup"><strong>Pickup:</strong><br>${suggestion.name}</div>`);
      
      // Animate marker appearance
      const fadeIn = setInterval(() => {
        const opacity = sourceMarkerRef.current.options.opacity;
        if (opacity >= 1) {
          clearInterval(fadeIn);
          sourceMarkerRef.current.openPopup();
        } else {
          sourceMarkerRef.current.setOpacity(opacity + 0.1);
        }
      }, 25);
      
      // If only source is selected, zoom to it
      if (!destinationMarkerRef.current) {
        mapInstanceRef.current.flyTo([suggestion.latitude, suggestion.longitude], 15, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
      
      // Calculate route if destination is already set
      if (destinationLocation) {
        calculateRoute(suggestion, destinationLocation);
      }
    } else {
      setDestinationInput(suggestion.shortName || suggestion.name.split(',')[0]);
      setDestinationLocation(suggestion);
      
      // Remove previous marker if exists
      if (destinationMarkerRef.current) {
        mapInstanceRef.current.removeLayer(destinationMarkerRef.current);
      }
      
      // Add marker for destination location with animation
      destinationMarkerRef.current = L.marker(
        [suggestion.latitude, suggestion.longitude],
        { 
          icon: createDestinationIcon(),
          opacity: 0
        }
      ).addTo(mapInstanceRef.current)
        .bindPopup(`<div class="custom-popup"><strong>Destination:</strong><br>${suggestion.name}</div>`);
      
      // Animate marker appearance
      const fadeIn = setInterval(() => {
        const opacity = destinationMarkerRef.current.options.opacity;
        if (opacity >= 1) {
          clearInterval(fadeIn);
          destinationMarkerRef.current.openPopup();
        } else {
          destinationMarkerRef.current.setOpacity(opacity + 0.1);
        }
      }, 25);
      
      // Calculate route if source is already set
      if (sourceLocation) {
        calculateRoute(sourceLocation, suggestion);
      }
    }
    
    // Clear suggestions
    setSuggestions({ ...suggestions, [type]: [] });
  };

  // Calculate and display route
  const calculateRoute = (source, destination) => {
    // Remove existing routing control if it exists
    if (routingMachineRef.current) {
      mapInstanceRef.current.removeControl(routingMachineRef.current);
      routingMachineRef.current = null;
    }
    
    // If both source and destination are set, show the route
    if (source && destination && mapInstanceRef.current) {
      // Create routing control with modern styling
      routingMachineRef.current = L.Routing.control({
        waypoints: [
          L.latLng(source.latitude, source.longitude),
          L.latLng(destination.latitude, destination.longitude)
        ],
        routeWhileDragging: false,
        showAlternatives: true,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [
            { color: '#3B82F6', opacity: 1, weight: 6 },
            { color: '#2563EB', opacity: 1, weight: 3 } // Changed opacity from 0.9 to 1
          ]
        },
        altLineOptions: {
          styles: [
            { color: '#94A3B8', opacity: 0.8, weight: 6 },
            { color: '#64748B', opacity: 0.8, weight: 3 } // Changed opacity from 0.6 to 0.8
          ]
        },
        createMarker: function() { return null; } // Disable default markers
      }).addTo(mapInstanceRef.current);

      // Get route info and hide the default routing UI
      routingMachineRef.current.on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        
        // Calculate time in minutes
        const timeInMinutes = Math.round(summary.totalTime / 60);
        let timeStr;
        
        if (timeInMinutes < 60) {
          timeStr = `${timeInMinutes} min`;
        } else {
          const hours = Math.floor(timeInMinutes / 60);
          const mins = timeInMinutes % 60;
          timeStr = `${hours} hr${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} min` : ''}`;
        }
        
        // Calculate distance
        const distanceInKm = (summary.totalDistance / 1000).toFixed(1);
        
        setRouteInfo({
          distance: distanceInKm,
          time: timeStr,
          price: calculatePrice(summary.totalDistance / 1000, rideType)
        });

      //   // Fit map to show route
        mapInstanceRef.current.fitBounds(L.latLngBounds(
          L.latLng(source.latitude, source.longitude),
          L.latLng(destination.latitude, destination.longitude)
        ).pad(0.3));
        
        // Ensure routes are visible
        setTimeout(() => {
          document.querySelectorAll('.leaflet-overlay-pane path').forEach(path => {
            path.setAttribute('stroke-opacity', '1');
            path.setAttribute('opacity', '1');
          });
        }, 100);
      });

      // Hide routing container but make sure routes are visible
      setTimeout(() => {
        const routingContainer = document.querySelector('.leaflet-routing-container');
        if (routingContainer) {
          routingContainer.style.display = 'none';
        }
      }, 100);
    }
  };

  // Calculate estimated price based on distance and ride type
  const calculatePrice = (distanceKm, type) => {
    const basePrice = type === 'private' ? 50 : 30;
    const perKmPrice = type === 'private' ? 15 : 7;
    return Math.round(basePrice + (distanceKm * perKmPrice));
  };

  // Set minimum date time (now + 30 minutes)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  };

  // Submit ride request to backend using Redux
  const submitRideRequest = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    if (!sourceLocation || !destinationLocation) {
      setError("Please select both pickup and destination locations");
      return;
    }

    if (!pickupTime) {
      setError("Please select a pickup time");
      return;
    }

    try {
      setError("");

      const rideData = {
        source: sourceInput,
        destination: destinationInput,
        rideType,
        pickupTime,
        sourceCoordinates: {
          latitude: sourceLocation.latitude,
          longitude: sourceLocation.longitude
        },
        destinationCoordinates: {
          latitude: destinationLocation.latitude,
          longitude: destinationLocation.longitude
        },
        fare: routeInfo?.price || 0
      };

      // Use the createRide function from rideAPI.js
      const result = await dispatch(createRide(rideData, navigate));
      
      // If the createRide function returns a result, navigate is already handled in the rideAPI
    } catch (err) {
      console.error("Error creating ride:", err);
      setError(err.message || "Failed to create ride. Please try again.");
    }
  };
  
  // Find user's location
  const findMyLocation = () => {
    if (location.loaded && !location.error) {
      mapInstanceRef.current.flyTo(
        [location.coordinates.latitude, location.coordinates.longitude],
        16, 
        { duration: 1.5, easeLinearity: 0.25 }
      );
    } else {
      alert("Unable to find your location. Please enable location services.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden gap-6 m-10">
      {/* Left Panel - Search and Info - Exactly 50% width */}
      <div className="w-full md:w-1/2 bg-white flex flex-col z-20 h-[40vh] md:h-screen overflow-y-auto rounded-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <h1 className="text-3xl font-bold mb-6">
            Go with <span className="font-extrabold">CoRide</span>
          </h1>
          
          {/* Ride Type Selection - Modern Tabs */}
          <div className="flex p-1 bg-white bg-opacity-20 rounded-full">
            <button 
              className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                rideType === 'private' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`}
              onClick={() => setRideType('private')}
            >
              <FaCar className={rideType === 'private' ? "text-blue-600" : "text-white"} />
              <span>Private</span>
            </button>
            <button 
              className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                rideType === 'shared' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`}
              onClick={() => setRideType('shared')}
            >
              <FaUsers className={rideType === 'shared' ? "text-blue-600" : "text-white"} />
              <span>Shared</span>
            </button>
          </div>
        </div>
        
        {/* Search Inputs */}
        <div className="p-5 space-y-4">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Where would you like to go?</h2>
          
          {/* Source Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-green-500 ring-4 ring-green-100"></div>
            </div>
            <input
              type="text"
              value={sourceInput}
              onChange={(e) => handleInputChange(e, 'source')}
              placeholder="Enter pickup location"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {sourceInput && (
              <button 
                onClick={() => handleClearInput('source')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
          
          {/* Destination Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-100"></div>
            </div>
            <input
              type="text"
              value={destinationInput}
              onChange={(e) => handleInputChange(e, 'destination')}
              placeholder="Enter destination"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {destinationInput && (
              <button 
                onClick={() => handleClearInput('destination')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
          
          {/* Time Selection - New field for pre-booking */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaClock className="text-blue-500" />
            </div>
            <input
              type="datetime-local"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              min={getMinDateTime()}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          
          {/* Use my current location button */}
          <button
            onClick={findMyLocation}
            className="w-full flex items-center justify-center gap-2 py-2 text-blue-600 hover:text-blue-700 transition-all"
          >
            <MdMyLocation />
            <span>Use my current location</span>
          </button>
        </div>
          
        {/* Suggestions Dropdown with improved UI */}
        {activeInput && suggestions[activeInput].length > 0 && (
          <div className="border-t border-gray-100 max-h-[240px] overflow-y-auto px-5">
            <div className="py-2 space-y-1">
              {suggestions[activeInput].map(suggestion => (
                <div
                  key={suggestion.id}
                  onClick={() => handleSelectSuggestion(suggestion, activeInput)}
                  className="p-3 hover:bg-gray-100 cursor-pointer flex items-start transition-colors rounded-lg"
                >
                  <FaMapMarkerAlt className={`mt-1 mr-3 ${activeInput === 'source' ? 'text-green-500' : 'text-red-500'}`} />
                  <div>
                    <div className="font-medium">{suggestion.shortName}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{suggestion.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="p-4 text-center text-sm text-gray-500">
            <div className="loader inline-block mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent"></div>
            Searching locations...
          </div>
        )}
        
        {/* Route Info Display */}
        {routeInfo && (
          <div className="p-5 bg-blue-50 mt-auto border-t border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-700 font-medium text-lg">Trip Details</div>
              <div className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
                {rideType === 'private' ? 'Private Ride' : 'Shared Ride'}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex space-x-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Distance</div>
                    <div className="font-semibold">{routeInfo.distance} km</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Time</div>
                    <div className="font-semibold">{routeInfo.time}</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Est. Price</div>
                  <div className="font-bold text-lg">₹{routeInfo.price}</div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Prices may vary depending on traffic and availability
              </div>
            </div>
          
            {/* Error message if any */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-3 text-sm">
                {error}
              </div>
            )}
            
            {/* Book Ride Button */}
            <button 
              onClick={submitRideRequest}
              disabled={submitLoading || !sourceLocation || !destinationLocation || !pickupTime}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3.5 px-6 rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                (submitLoading || !sourceLocation || !destinationLocation || !pickupTime) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Book Ride</span>
                  <FaChevronRight />
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Book Ride Button when no route is selected */}
        {!routeInfo && (
          <div className="p-5 mt-auto border-t border-gray-200">
            {/* Error message if any */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-3 text-sm">
                {error}
              </div>
            )}
            
            <button 
              onClick={submitRideRequest}
              disabled={submitLoading || !sourceLocation || !destinationLocation || !pickupTime}
              className={`w-full font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all
                ${(submitLoading || !sourceLocation || !destinationLocation || !pickupTime)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
            >
              {submitLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Book Ride</span>
                  <FaChevronRight />
                </>
              )}
            </button>
            {(!sourceLocation || !destinationLocation || !pickupTime) && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Enter pickup, destination and pickup time to continue
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Right Panel - Map - Exactly 50% width */}
      <div className="w-full md:w-1/2 relative h-[60vh] md:h-screen rounded-3xl">
        <div
          ref={mapContainerRef}
          className="h-full w-full"
        ></div>
        
        {/* Find my location button */}
        <button
          onClick={findMyLocation}
          className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-10"
        >
          <MdMyLocation className="text-blue-600 text-xl" />
        </button>
      </div>
      
      {/* Login Prompt Modal - Glass Morphism Style */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-md rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-in-center">
            <div className="flex justify-center mb-5">
              <div className="bg-blue-100 p-4 rounded-full">
                <FaLock className="text-blue-600 text-2xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-3">Login Required</h2>
            <p className="text-gray-600 mb-6 text-center">
              Please log in to book your ride.
            </p>
            <div className="space-y-3">
              <button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login Now
              </button>
              <button 
                className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-all"
                onClick={() => setShowLoginPrompt(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Ride;