import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaHourglass, FaTimes, FaCar, FaUsers, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUser, FaExchangeAlt, FaArrowLeft, FaSchool, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

function RideConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [consentAction, setConsentAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Map related refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routingControlRef = useRef(null);
  const sourceMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);

  // Fetch ride details either from location state or API
  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        console.log("Fetching ride details...");
        
        // If ride comes from navigation state
        if (location.state && location.state.ride) {
          console.log("Using ride from navigation state");
          setRide(location.state.ride);
          setLoading(false);
          return;
        }

        // Otherwise try to get from URL params
        const urlParams = new URLSearchParams(location.search);
        const rideId = urlParams.get('id');

        if (!rideId) {
          console.log("No ride ID found in URL");
          setError('No ride information found');
          setLoading(false);
          return;
        }

        console.log("Getting ride with ID:", rideId);

        // Fetch ride details from API
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          navigate('/login');
          return;
        }
        
        // Try the debug endpoint first
        console.log("Trying debug endpoint first...");
        let debugData;
        try {
          const debugResponse = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/rides/debug/${rideId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          debugData = debugResponse.data;
          console.log("Debug data:", debugData);
        } catch (debugErr) {
          console.log("Debug endpoint failed:", debugErr.response?.status, debugErr.message);
        }
        
        // If debug data shows the ride doesn't exist or user isn't authorized, don't make the main request
        if (debugData && !debugData.success) {
          setError(debugData.message || 'Error loading ride details');
          setLoading(false);
          return;
        }
        
        // Now try the main ride endpoint
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/rides/${rideId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          console.log('Ride data fetched:', response.data);
          setRide(response.data.data);
          setLoading(false);
        } catch (mainErr) {
          console.error('Error fetching ride details from main endpoint:', mainErr);
          
          // If we got debug data earlier, use a simplified version from it
          if (debugData && debugData.success && debugData.basic) {
            console.log("Using simplified ride data from debug endpoint");
            // Create a fallback ride object with basic info
            const fallbackRide = {
              _id: debugData.basic.id,
              rideType: debugData.basic.rideType,
              status: debugData.basic.status,
              source: "Unable to load details",
              destination: "Unable to load details",
              fare: 0,
              pickupTime: new Date(),
              bookingTime: new Date()
            };
            
            setRide(fallbackRide);
            setError("Limited ride information available. Some details could not be loaded.");
          } else {
            setError(mainErr.response?.data?.message || 'Failed to load ride details');
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('General error fetching ride details:', err);
        setError('An unexpected error occurred. Please try again later.');
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [location, navigate]);

  // Initialize map when ride data is available
  useEffect(() => {
    if (ride && mapContainerRef.current && !mapInstanceRef.current) {
      // Create map
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([28.6139, 77.2090], 13);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
      
      // If we have coordinates, show the route
      if (ride.sourceCoordinates && ride.destinationCoordinates) {
        // Source marker
        const sourceIcon = L.divIcon({
          className: 'source-marker',
          html: `<div style="background-color: #10B981; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2);"></div>`,
          iconSize: [15, 15],
          iconAnchor: [7.5, 7.5],
        });
        
        // Destination marker
        const destIcon = L.divIcon({
          className: 'destination-marker',
          html: `<div style="background-color: #EF4444; width: 15px; height: 15px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2);"></div>`,
          iconSize: [15, 15],
          iconAnchor: [7.5, 7.5],
        });
        
        // Add markers
        sourceMarkerRef.current = L.marker(
          [ride.sourceCoordinates.latitude, ride.sourceCoordinates.longitude],
          { icon: sourceIcon }
        ).addTo(mapInstanceRef.current)
          .bindPopup(`<b>Pickup:</b> ${ride.source}`);
        
        destinationMarkerRef.current = L.marker(
          [ride.destinationCoordinates.latitude, ride.destinationCoordinates.longitude],
          { icon: destIcon }
        ).addTo(mapInstanceRef.current)
          .bindPopup(`<b>Destination:</b> ${ride.destination}`);
        
        // Add routing
        routingControlRef.current = L.Routing.control({
          waypoints: [
            L.latLng(ride.sourceCoordinates.latitude, ride.sourceCoordinates.longitude),
            L.latLng(ride.destinationCoordinates.latitude, ride.destinationCoordinates.longitude)
          ],
          routeWhileDragging: false,
          showAlternatives: false,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [
              { color: '#3B82F6', opacity: 1, weight: 6 },
              { color: '#2563EB', opacity: 1, weight: 3 }
            ]
          },
          createMarker: function() { return null; } // Disable default markers
        }).addTo(mapInstanceRef.current);
        
        // Hide control container but keep the route visible
        setTimeout(() => {
          const routingContainer = document.querySelector('.leaflet-routing-container');
          if (routingContainer) {
            routingContainer.style.display = 'none';
          }
        }, 500);
        
        // Fit map to bounds
        const bounds = L.latLngBounds(
          L.latLng(ride.sourceCoordinates.latitude, ride.sourceCoordinates.longitude),
          L.latLng(ride.destinationCoordinates.latitude, ride.destinationCoordinates.longitude)
        );
        mapInstanceRef.current.fitBounds(bounds.pad(0.3));
      }
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        routingControlRef.current = null;
        sourceMarkerRef.current = null;
        destinationMarkerRef.current = null;
      }
    };
  }, [ride]);

  // Handle consent action (accept/decline shared ride)
  const handleConsentAction = async (consent) => {
    try {
      setActionLoading(true);
      setConsentAction(consent);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/consent`,
        {
          rideId: ride._id,
          consent
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update ride data with new status
      setRide(response.data.data);
    } catch (err) {
      console.error(`Error ${consent}ing ride:`, err);
      setError(err.response?.data?.message || `Failed to ${consent} ride`);
    } finally {
      setActionLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Return to rides list
  const goToRidesList = () => {
    navigate('/my-rides');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 max-w-md w-full text-center">
          <FaTimes className="mx-auto mb-2 text-2xl" />
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/ride')}
          className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          <FaArrowLeft /> Book Another Ride
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <FaArrowLeft /> Back
        </button>

        {/* Status Banner */}
        <div className={`p-6 rounded-xl mb-6 flex items-center gap-4 ${
          ride.status === 'confirmed' 
            ? 'bg-green-100 text-green-800'
            : ride.status === 'waiting' 
            ? 'bg-yellow-100 text-yellow-800'
            : ride.status === 'private' 
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {ride.status === 'confirmed' && <FaCheckCircle className="text-2xl" />}
          {ride.status === 'waiting' && <FaHourglass className="text-2xl" />}
          {ride.status === 'private' && <FaCar className="text-2xl" />}
          
          <div>
            <h2 className="text-lg font-bold">
              {ride.status === 'confirmed' && 'Ride Confirmed'}
              {ride.status === 'waiting' && 'Awaiting Match Confirmation'}
              {ride.status === 'private' && 'Private Ride Confirmed'}
            </h2>
            <p>
              {ride.status === 'confirmed' && 'Your shared ride has been confirmed with all passengers.'}
              {ride.status === 'waiting' && 'Waiting for all passengers to confirm this shared ride.'}
              {ride.status === 'private' && 'Your private ride has been booked successfully.'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Ride Details</h1>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                {ride.rideType === 'private' ? (
                  <>
                    <FaCar />
                    <span>Private</span>
                  </>
                ) : (
                  <>
                    <FaUsers />
                    <span>Shared</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Map Section - New */}
            <div className="mb-6 overflow-hidden rounded-lg shadow-sm border border-gray-200" style={{ height: '280px' }}>
              <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}></div>
            </div>

            {/* Route Info */}
            <div className="mb-6">
              <h3 className="text-gray-500 font-medium mb-3">Route</h3>
              <div className="flex items-start">
                <div className="mr-4 flex flex-col items-center">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="h-14 w-0.5 bg-gray-200 my-1"></div>
                  <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <p className="font-medium">{ride.source}</p>
                    <p className="text-gray-500 text-sm">Pickup Location</p>
                  </div>
                  <div>
                    <p className="font-medium">{ride.destination}</p>
                    <p className="text-gray-500 text-sm">Destination</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ride Details */}
            <div className="border-t border-gray-100 pt-6 mb-6">
              <h3 className="text-gray-500 font-medium mb-3">Ride Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FaClock className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Pickup Time</p>
                    <p className="font-medium">{formatDate(ride.pickupTime)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Booking Time</p>
                    <p className="font-medium">{formatDate(ride.bookingTime)}</p>
                  </div>
                </div>
                {ride.fare && (
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-3 font-bold">₹</span>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Fare</p>
                      <p className="font-medium">₹{ride.fare}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <FaUser className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Ride ID</p>
                    <p className="font-medium">{ride._id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shared Ride Matching Info */}
            {ride.rideType === 'shared' && ride.status === 'waiting' && !ride.matchedWith?.length && (
              <div className="border-t border-gray-100 pt-6 mb-6">
                <h3 className="text-gray-500 font-medium mb-3">Ride Matching</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaHourglass className="text-yellow-500 mr-2" />
                    <p className="font-medium">Waiting for Match</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    We're looking for passengers heading to the same destination. You'll be notified when we find a match.
                  </p>
                </div>
              </div>
            )}

            {/* User Info Section - New */}
            {ride.userId && typeof ride.userId === 'object' && (
              <div className="border-t border-gray-100 pt-6 mb-6">
                <h3 className="text-gray-500 font-medium mb-3">Ride Creator</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-blue-500 text-white rounded-full h-12 w-12 flex items-center justify-center">
                      <span className="text-lg font-medium">
                        {ride.userId.name ? ride.userId.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{ride.userId.name || "User"}</p>
                      <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mt-1">
                        {ride.userId.email && (
                          <div className="flex items-center gap-1">
                            <FaEnvelope className="text-blue-500" />
                            <span>{ride.userId.email}</span>
                          </div>
                        )}
                        {ride.userId.collegeName && (
                          <div className="flex items-center gap-1">
                            <FaSchool className="text-blue-500" />
                            <span>{ride.userId.collegeName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shared Ride Passenger Information - Enhanced */}
            {ride.rideType === 'shared' && ride.matchedWith && ride.matchedWith.length > 0 && (
              <div className="border-t border-gray-100 pt-6 mb-6">
                <h3 className="text-gray-500 font-medium mb-3">Co-Passengers</h3>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm mb-4">
                    {ride.status === 'confirmed' 
                      ? 'All passengers have confirmed this shared ride.' 
                      : 'Please confirm if you would like to share this ride with the matched passenger(s).'}
                  </p>
                  
                  {/* Co-passenger details */}
                  <div className="space-y-4">
                    {ride.matchedWith.map((passenger, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="bg-purple-500 text-white rounded-full h-10 w-10 flex items-center justify-center">
                            <span className="text-md font-medium">
                              {passenger.name ? passenger.name.charAt(0).toUpperCase() : 'P'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{passenger.name || "Passenger"}</p>
                            <div className="flex flex-wrap gap-x-4 text-sm text-gray-600 mt-1">
                              {passenger.email && (
                                <div className="flex items-center gap-1">
                                  <FaEnvelope className="text-purple-500" />
                                  <span>{passenger.email}</span>
                                </div>
                              )}
                              {passenger.collegeName && (
                                <div className="flex items-center gap-1">
                                  <FaSchool className="text-purple-500" />
                                  <span>{passenger.collegeName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 text-sm text-gray-500">
                          {ride.status === 'confirmed' ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <FaCheckCircle /> Confirmed
                            </span>
                          ) : (
                            <span className="text-yellow-600 flex items-center gap-1">
                              <FaHourglass /> Awaiting confirmation
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consent action buttons */}
                {ride.status === 'waiting' && !actionLoading && !consentAction && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleConsentAction('accepted')}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaCheckCircle />
                      Accept Shared Ride
                    </button>
                    <button
                      onClick={() => handleConsentAction('declined')}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                    >
                      <FaTimes />
                      Decline & Go Private
                    </button>
                  </div>
                )}

                {/* Loading state for action */}
                {actionLoading && (
                  <div className="text-center py-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-500">Processing your request...</p>
                  </div>
                )}

                {/* Consent already provided */}
                {!actionLoading && consentAction && (
                  <div className={`text-center py-3 px-4 rounded-lg ${
                    consentAction === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {consentAction === 'accepted' ? (
                      <p>You've accepted this shared ride.</p>
                    ) : (
                      <p>You've declined this shared ride and switched to a private ride.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/ride')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <FaExchangeAlt />
                Book Another Ride
              </button>
              <button
                onClick={goToRidesList}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <FaCar />
                View My Rides
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RideConfirmation;