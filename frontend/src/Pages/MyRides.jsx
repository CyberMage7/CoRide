import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaCar, FaUsers, FaCheckCircle, FaHourglass, FaTimes, FaExclamationCircle, FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaChevronRight, FaPlus } from 'react-icons/fa';

function MyRides() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Check if we should show all rides (when coming from dashboard)
  const queryParams = new URLSearchParams(location.search);
  const showAll = queryParams.get('view') === 'all';
  const [activeTab, setActiveTab] = useState(showAll ? 'all' : 'upcoming');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setRides(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rides:', err);
        setError(err.response?.data?.message || 'Failed to load your rides');
        setLoading(false);
      }
    };

    fetchRides();
  }, [navigate]);

  // Filter rides based on active tab
  const filteredRides = rides.filter(ride => {
    const rideDate = new Date(ride.pickupTime);
    const now = new Date();
    
    if (activeTab === 'all') {
      return true; // Show all rides
    } else if (activeTab === 'upcoming') {
      return rideDate >= now && ride.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return rideDate < now || ride.status === 'cancelled';
    }
    return true;
  });

  // Sort rides by pickupTime
  const sortedRides = [...filteredRides].sort((a, b) => {
    if (activeTab === 'upcoming') {
      return new Date(a.pickupTime) - new Date(b.pickupTime);
    } else {
      return new Date(b.pickupTime) - new Date(a.pickupTime);
    }
  });

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

  // Get status badge data
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, label: 'Confirmed' };
      case 'waiting':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <FaHourglass />, label: 'Awaiting Match' };
      case 'private':
        return { color: 'bg-blue-100 text-blue-800', icon: <FaCar />, label: 'Private Ride' };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: <FaTimes />, label: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <FaExclamationCircle />, label: status };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Rides</h1>
            <p className="text-gray-500">View and manage your upcoming and past rides</p>
          </div>
          <button
            onClick={() => navigate('/ride')}
            className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus />
            Book New Ride
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-lg shadow-sm mb-6 flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-6 text-center transition-colors ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Rides
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center transition-colors ${
              activeTab === 'upcoming'
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Rides
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center transition-colors ${
              activeTab === 'past'
                ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Rides
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* No Rides Message */}
        {!loading && sortedRides.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="bg-gray-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaCar className="text-gray-500 text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No {activeTab} rides found</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming rides scheduled."
                : activeTab === 'past'
                ? "You haven't taken any rides yet."
                : "You don't have any rides yet."}
            </p>
            <button
              onClick={() => navigate('/ride')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <FaPlus />
              Book a Ride
            </button>
          </div>
        )}

        {/* Ride List */}
        {sortedRides.length > 0 && (
          <div className="space-y-4">
            {sortedRides.map(ride => {
              const statusBadge = getStatusBadge(ride.status);
              
              return (
                <div 
                  key={ride._id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/ride-confirmation?id=${ride._id}`)}
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center mb-3 md:mb-0">
                        <div className={`p-2 rounded-full mr-4 ${ride.rideType === 'private' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                          {ride.rideType === 'private' ? (
                            <FaCar className={`${ride.rideType === 'private' ? 'text-blue-600' : 'text-purple-600'}`} />
                          ) : (
                            <FaUsers className="text-purple-600" />
                          )}
                        </div>
                        <div>
                          <span className="block text-sm text-gray-500">
                            {ride.rideType === 'private' ? 'Private Ride' : 'Shared Ride'}
                          </span>
                          <span className="block font-medium">
                            {formatDate(ride.pickupTime)}
                          </span>
                        </div>
                      </div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusBadge.color}`}>
                        {statusBadge.icon}
                        <span className="ml-1">{statusBadge.label}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <div className="h-10 w-0.5 bg-gray-200 my-1"></div>
                        <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">From</p>
                          <p className="font-medium truncate">{ride.source}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">To</p>
                          <p className="font-medium truncate">{ride.destination}</p>
                        </div>
                      </div>
                    </div>
                    
                    {ride.rideType === 'shared' && ride.matchedWith && ride.matchedWith.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-1">
                          {ride.status === 'confirmed' ? 'Sharing ride with:' : 'Possible co-passengers:'}
                        </p>
                        <p className="text-sm font-medium">
                          {ride.matchedWith.length} passenger(s)
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 py-3 px-6 border-t border-gray-100 flex justify-end">
                    <button className="text-blue-600 flex items-center gap-1 text-sm">
                      View Details <FaChevronRight className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRides; 