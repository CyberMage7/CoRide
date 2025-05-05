import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaMapPin, FaClock, FaCarSide, FaUsers, FaCheckCircle, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import { updateRideConsent, cancelRide, getRideById } from '../services/operations/rideAPI';

function RideConfirmation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get ride data from Redux store or from navigation state
  const { currentRide: reduxRide, loading: reduxLoading } = useSelector((state) => state.rides);
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  const [formattedTime, setFormattedTime] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  // Get the ride ID either from Redux state or from the router state - run only once
  useEffect(() => {
    // Skip if we've already fetched data
    if (dataFetched) return;

    const fetchRideData = async () => {
      setLoading(true);
      try {
        // First check if we have a ride in the location state
        if (location.state?.ride?._id) {
          console.log("Using ride from router state:", location.state.ride._id);
          // Get the full ride details from the API to ensure we have the latest data
          const fetchedRide = await dispatch(getRideById(location.state.ride._id));
          if (fetchedRide) {
            setRide(fetchedRide);
          } else {
            console.log("Failed to fetch ride data, falling back to provided state");
            setRide(location.state.ride);
          }
        }
        // Otherwise use the ride from Redux
        else if (reduxRide) {
          console.log("Using ride from Redux store:", reduxRide._id);
          setRide(reduxRide);
        }
        // If no ride data is available, redirect to ride booking page
        else {
          console.log("No ride data available, redirecting to ride page");
          navigate('/ride');
          return;
        }

        // Mark data as fetched to prevent infinite fetching
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching ride details:", error);
        setDataFetched(true); // Still mark as fetched to prevent infinite loops
      } finally {
        setLoading(false);
      }
    };

    fetchRideData();
  }, [location.state, reduxRide, dispatch, navigate, dataFetched]);

  // Format pickup time for display when ride data is available - only when ride changes
  useEffect(() => {
    if (ride?.pickupTime) {
      const pickupDate = new Date(ride.pickupTime);

      // Format time (e.g., "3:30 PM")
      setFormattedTime(pickupDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));

      // Format date (e.g., "May 15, 2025")
      setFormattedDate(pickupDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }));
    }
  }, [ride]);

  // Helper function to check if user has sent consent
  const hasUserSentConsent = () => {
    if (!ride || !ride.consentStatus) return false;

    // Get the user ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) return false;

    // Convert consentStatus from MongoDB Map to regular object if needed
    let consentMap = ride.consentStatus;
    if (typeof consentMap !== 'object') {
      try {
        consentMap = JSON.parse(consentMap);
      } catch {
        consentMap = {};
      }
    }

    // Check if user ID exists in consent map
    return consentMap[user._id] === 'accepted' || consentMap[user._id] === 'declined';
  };

  // Helper function to check if any user has sent consent
  const hasAnyUserSentConsent = () => {
    if (!ride || !ride.consentStatus) return false;

    // Convert consentStatus from MongoDB Map to regular object if needed
    let consentMap = ride.consentStatus;
    if (typeof consentMap !== 'object') {
      try {
        consentMap = JSON.parse(consentMap);
      } catch {
        return false;
      }
    }

    // Check if any user has sent consent
    return Object.keys(consentMap).length > 0 &&
      Object.values(consentMap).some(status =>
        status === 'accepted' || status === 'declined'
      );
  };

  // Handle ride acceptance for shared rides
  const handleAcceptRide = () => {
    setConfirmationAction('accept');
    setShowConfirmation(true);
  };

  // Handle ride rejection for shared rides
  const handleRejectRide = () => {
    setConfirmationAction('reject');
    setShowConfirmation(true);
  };

  // Handle ride cancellation
  const handleCancelRide = () => {
    setConfirmationAction('cancel');
    setShowConfirmation(true);
  };

  // Confirm the selected action
  const confirmAction = async () => {
    if (confirmationAction === 'accept') {
      const updatedRide = await dispatch(updateRideConsent(ride._id, 'accepted'));
      if (updatedRide) {
        setRide(updatedRide);
      }
    } else if (confirmationAction === 'reject') {
      const updatedRide = await dispatch(updateRideConsent(ride._id, 'declined'));
      if (updatedRide) {
        navigate('/ride');
      }
    } else if (confirmationAction === 'cancel') {
      const success = await dispatch(cancelRide(ride._id));
      if (success) {
        navigate('/ride');
      }
    }

    setShowConfirmation(false);
  };

  // If loading or no ride data, show loading state
  if (loading || reduxLoading || !ride) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">Loading ride details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto pt-8 px-4 pb-16">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Dashboard</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">Ride Confirmation</h1>
            <div className="flex items-center">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${ride.status === 'waiting' ? 'bg-yellow-400 text-yellow-800' :
                  ride.status === 'confirmed' ? 'bg-green-400 text-green-800' :
                    ride.status === 'private' ? 'bg-purple-400 text-purple-800' :
                      ride.status === 'cancelled' ? 'bg-red-400 text-red-800' :
                        'bg-blue-400 text-blue-800'
                }`}>
                {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
              </div>

              <div className="mx-2 h-1 w-1 bg-white rounded-full opacity-50"></div>

              <div className={`px-3 py-1 rounded-full text-sm font-medium ${ride.rideType === 'private' ? 'bg-indigo-400 text-indigo-800' : 'bg-teal-400 text-teal-800'
                }`}>
                {ride.rideType === 'private' ? 'Private Ride' : 'Shared Ride'}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Ride Details */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Ride Details</h2>

              <div className="space-y-4">
                {/* Source */}
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FaMapMarkerAlt className="text-green-600" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Pickup Location</div>
                    <div className="font-medium">{ride.source}</div>
                  </div>
                </div>

                {/* Destination */}
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FaMapPin className="text-red-600" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Destination</div>
                    <div className="font-medium">{ride.destination}</div>
                  </div>
                </div>

                {/* Time */}
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaClock className="text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Pickup Time</div>
                    <div className="font-medium">{formattedTime} on {formattedDate}</div>
                  </div>
                </div>

                {/* Ride Type */}
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      {ride.rideType === 'private' ? (
                        <FaCarSide className="text-purple-600" />
                      ) : (
                        <FaUsers className="text-purple-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Ride Type</div>
                    <div className="font-medium">
                      {ride.rideType === 'private' ? 'Private Ride' : 'Shared Ride'}
                      {ride.rideType === 'shared' && ride.matchedWith && (
                        <span className="ml-2 text-sm text-gray-500">
                          {ride.matchedWith.length ?
                            `(Matched with ${ride.matchedWith.length} ${ride.matchedWith.length === 1 ? 'rider' : 'riders'})` :
                            '(Waiting for matches)'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fare */}
                {ride.fare && (
                  <div className="flex">
                    <div className="mr-4">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 font-semibold">₹</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Estimated Fare</div>
                      <div className="font-medium">₹{ride.fare}</div>
                    </div>
                  </div>
                )}

                {/* Consent Status */}
                {ride.rideType === 'shared' &&
                  ride.matchedWith?.length > 0 &&
                  hasAnyUserSentConsent() && (
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FaCheckCircle className="text-indigo-600" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Consent Status</div>
                        <div className="font-medium">
                          {hasUserSentConsent() ?
                            'You have responded to this ride request' :
                            'A response is required for this shared ride'}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Shared Ride Consent Section (only for shared rides with matches) */}
            {ride.rideType === 'shared' &&
              ride.matchedWith?.length > 0 &&
              !hasUserSentConsent() && (
                <div className="mb-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Shared Ride Confirmation</h3>
                  <p className="text-gray-600 mb-4">
                    We've found riders going your way! Would you like to share this ride?
                  </p>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAcceptRide}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <FaCheckCircle className="mr-2" />
                      Accept
                    </button>

                    <button
                      onClick={handleRejectRide}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <FaTimesCircle className="mr-2" />
                      Decline
                    </button>
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleCancelRide}
                disabled={ride.status === 'cancelled'}
                className={`px-6 py-2.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors ${ride.status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Cancel Ride
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                View All Rides
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-3">
              {confirmationAction === 'accept' ? 'Accept Shared Ride?' :
                confirmationAction === 'reject' ? 'Decline Shared Ride?' :
                  'Cancel Ride?'}
            </h3>

            <p className="text-gray-600 mb-6">
              {confirmationAction === 'accept'
                ? 'You are about to accept sharing this ride with other passengers. Proceed?'
                : confirmationAction === 'reject'
                  ? 'If you decline, we\'ll create a private ride for you instead. Proceed?'
                  : 'Are you sure you want to cancel this ride? This action cannot be undone.'}
            </p>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              >
                No, Go Back
              </button>

              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${confirmationAction === 'accept' ? 'bg-green-500 hover:bg-green-600' :
                    confirmationAction === 'reject' ? 'bg-blue-500 hover:bg-blue-600' :
                      'bg-red-500 hover:bg-red-600'
                  }`}
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RideConfirmation;