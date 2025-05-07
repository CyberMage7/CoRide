"use client"

import { useEffect, useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import {
  FaMapMarkerAlt,
  FaMapPin,
  FaClock,
  FaCarSide,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
} from "react-icons/fa"
import { updateRideConsent, cancelRide, getRideById } from "../services/operations/rideAPI"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"
import "leaflet-routing-machine"
;<style jsx>{`
    .custom-marker {
      position: relative;
    }
    .marker-shadow {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 16px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      filter: blur(2px);
    }
    .custom-popup {
      padding: 4px 8px;
      font-size: 12px;
    }
  `}</style>

function RideConfirmation() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Get ride data from Redux store or from navigation state
  const { currentRide: reduxRide, loading: reduxLoading } = useSelector((state) => state.rides)
  const [ride, setRide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dataFetched, setDataFetched] = useState(false)
  const [userSource, setUserSource] = useState(null)
  const [allSources, setAllSources] = useState([])

  const [formattedTime, setFormattedTime] = useState("")
  const [formattedDate, setFormattedDate] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationAction, setConfirmationAction] = useState(null)

  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const sourceMarkersRef = useRef([])
  const destinationMarkerRef = useRef(null)
  const routingControlsRef = useRef([])

  // Change the map container style to make it taller and fill the height
  const mapContainerStyle = {
    height: "100%",
    width: "100%",
    borderRadius: "12px",
  }

  // Get current user from localStorage
  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    return user?._id
  }

  // Get the ride ID either from Redux state or from the router state - run only once
  useEffect(() => {
    // Skip if we've already fetched data
    if (dataFetched) return

    const fetchRideData = async () => {
      setLoading(true)
      try {
        // First check if we have a ride in the location state
        if (location.state?.ride?._id) {
          console.log("Using ride from router state:", location.state.ride._id)
          // Get the full ride details from the API to ensure we have the latest data
          const fetchedRide = await dispatch(getRideById(location.state.ride._id))
          if (fetchedRide) {
            setRide(fetchedRide)
          } else {
            console.log("Failed to fetch ride data, falling back to provided state")
            setRide(location.state.ride)
          }
        }
        // Otherwise use the ride from Redux
        else if (reduxRide) {
          console.log("Using ride from Redux store:", reduxRide._id)
          setRide(reduxRide)
        }
        // If no ride data is available, redirect to ride booking page
        else {
          console.log("No ride data available, redirecting to ride page")
          navigate("/ride")
          return
        }

        // Mark data as fetched to prevent infinite fetching
        setDataFetched(true)
      } catch (error) {
        console.error("Error fetching ride details:", error)
        setDataFetched(true) // Still mark as fetched to prevent infinite loops
      } finally {
        setLoading(false)
      }
    }

    fetchRideData()
  }, [location.state, reduxRide, dispatch, navigate, dataFetched])

  // Format pickup time for display and determine user's source when ride data is available
  useEffect(() => {
    if (!ride) return

    // Format pickup time
    if (ride.pickupTime) {
      const pickupDate = new Date(ride.pickupTime)

      // Format time (e.g., "3:30 PM")
      setFormattedTime(
        pickupDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      )

      // Format date (e.g., "May 15, 2025")
      setFormattedDate(
        pickupDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      )
    }

    // Determine the correct source location for this user
    const currentUserId = getCurrentUserId()
    if (!currentUserId) return

    // Initialize sources array with the main ride source (owner's source)
    const sources = []

    // Add the ride owner's source first with user details
    sources.push({
      userId: typeof ride.userId === "object" ? ride.userId._id : ride.userId,
      name: typeof ride.userId === "object" ? ride.userId.name || "Ride Owner" : "Ride Owner",
      source: ride.source,
      coordinates: ride.sourceCoordinates,
      isCurrentUser: (typeof ride.userId === "object" ? ride.userId._id : ride.userId) === currentUserId,
      isOwner: true,
    })

    // If there are matched users, add their sources too
    if (ride.matchedWith && Array.isArray(ride.matchedWith)) {
      ride.matchedWith.forEach((match) => {
        const userId = typeof match.userId === "object" ? match.userId._id : match.userId
        const userName =
          typeof match.userId === "object"
            ? match.userId.name || match.userId.email?.split("@")[0] || "Co-passenger"
            : "Co-passenger"

        sources.push({
          userId,
          name: userName,
          source: match.source,
          coordinates: match.sourceCoordinates,
          isCurrentUser: userId === currentUserId,
          isOwner: false,
        })
      })
    }

    // Set all sources
    setAllSources(sources)

    // Set current user's source for backward compatibility
    const userSourceInfo = sources.find((s) => s.isCurrentUser)
    if (userSourceInfo) {
      setUserSource({
        name: userSourceInfo.source,
        coordinates: userSourceInfo.coordinates,
      })
    } else {
      // Fallback to main ride source if user source not found
      setUserSource({
        name: ride.source,
        coordinates: ride.sourceCoordinates,
      })
    }
  }, [ride])

  // Helper function to check if user has sent consent
  const hasUserSentConsent = () => {
    if (!ride || !ride.consentStatus) return false

    // Get the user ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || !user._id) return false

    // Convert consentStatus from MongoDB Map to regular object if needed
    let consentMap = ride.consentStatus
    if (typeof consentMap !== "object") {
      try {
        consentMap = JSON.parse(consentMap)
      } catch {
        consentMap = {}
      }
    }

    // Check if user ID exists in consent map
    return consentMap[user._id] === "accepted" || consentMap[user._id] === "declined"
  }

  // Helper function to check if any user has sent consent
  const hasAnyUserSentConsent = () => {
    if (!ride || !ride.consentStatus) return false

    // Convert consentStatus from MongoDB Map to regular object if needed
    let consentMap = ride.consentStatus
    if (typeof consentMap !== "object") {
      try {
        consentMap = JSON.parse(consentMap)
      } catch {
        return false
      }
    }

    // Check if any user has sent consent
    return (
      Object.keys(consentMap).length > 0 &&
      Object.values(consentMap).some((status) => status === "accepted" || status === "declined")
    )
  }

  // Handle ride acceptance for shared rides
  const handleAcceptRide = () => {
    setConfirmationAction("accept")
    setShowConfirmation(true)
  }

  // Handle ride rejection for shared rides
  const handleRejectRide = () => {
    setConfirmationAction("reject")
    setShowConfirmation(true)
  }

  // Handle ride cancellation
  const handleCancelRide = () => {
    setConfirmationAction("cancel")
    setShowConfirmation(true)
  }

  // Confirm the selected action
  const confirmAction = async () => {
    if (confirmationAction === "accept") {
      const updatedRide = await dispatch(updateRideConsent(ride._id, "accepted"))
      if (updatedRide) {
        setRide(updatedRide)
      }
    } else if (confirmationAction === "reject") {
      const updatedRide = await dispatch(updateRideConsent(ride._id, "declined"))
      if (updatedRide) {
        navigate("/ride")
      }
    } else if (confirmationAction === "cancel") {
      const success = await dispatch(cancelRide(ride._id))
      if (success) {
        navigate("/ride")
      }
    }

    setShowConfirmation(false)
  }

  // Get the count of matched riders
  const getMatchedRidersCount = () => {
    if (!ride?.matchedWith) return 0

    // Handle both array of objects and array of strings/IDs
    if (ride.matchedWith.length > 0 && typeof ride.matchedWith[0] === "object") {
      return ride.matchedWith.length
    }

    return ride.matchedWith.length
  }

  // Get user name based on user object or ID
  const getUserName = (user) => {
    if (!user) return "Unknown User"

    // Case 1: If user is directly a populated user object with name
    if (typeof user === "object" && user.name) {
      return user.name
    }

    // Case 2: If user is a populated user object but name is accessed differently
    if (typeof user === "object" && user._id) {
      // Try common patterns for accessing the name
      if (user.name) return user.name
      if (user.email) return user.email.split("@")[0] // Fallback to email username
    }

    // Case 3: If the user object is nested deeper
    if (typeof user === "object" && user.userId) {
      if (typeof user.userId === "object") {
        if (user.userId.name) return user.userId.name
        if (user.userId.email) return user.userId.email.split("@")[0]
      }
      return "User " + user.userId.toString().slice(-4) // Show last 4 chars of ID
    }

    // Case 4: If it's just a string ID
    if (typeof user === "string" || (typeof user === "object" && user.toString)) {
      return "User " + user.toString().slice(-4) // Show last 4 chars of ID
    }

    return "Unknown User"
  }

  // Initialize map
  useEffect(() => {
    if (ride && allSources.length > 0 && mapContainerRef.current && !mapInstanceRef.current) {
      // Create map instance
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([ride.destinationCoordinates.latitude, ride.destinationCoordinates.longitude], 13)

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstanceRef.current)

      // Add zoom control in a better position
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(mapInstanceRef.current)

      // Add markers and routes
      addMarkersAndRoutes()
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [ride, allSources])

  // Update the addMarkersAndRoutes function to create routes from owner to co-passenger and then to destination
  const addMarkersAndRoutes = () => {
    if (!mapInstanceRef.current || !ride) return

    // Clear existing markers and routes
    sourceMarkersRef.current.forEach((marker) => {
      if (marker) mapInstanceRef.current.removeLayer(marker)
    })
    sourceMarkersRef.current = []

    if (destinationMarkerRef.current) {
      mapInstanceRef.current.removeLayer(destinationMarkerRef.current)
    }

    routingControlsRef.current.forEach((control) => {
      if (control) mapInstanceRef.current.removeControl(control)
    })
    routingControlsRef.current = []

    // Add destination marker
    if (ride.destinationCoordinates) {
      destinationMarkerRef.current = L.marker(
        [ride.destinationCoordinates.latitude, ride.destinationCoordinates.longitude],
        { icon: createDestinationIcon() },
      )
        .addTo(mapInstanceRef.current)
        .bindPopup(`<div class="custom-popup"><strong>Destination:</strong><br>${ride.destination}</div>`)
    }

    // Find the ride owner's source
    const ownerSource = allSources.find((source) => source.isOwner)

    // Add source markers for all users
    allSources.forEach((source, index) => {
      if (source.coordinates) {
        const marker = L.marker([source.coordinates.latitude, source.coordinates.longitude], {
          icon: createSourceIcon(source.isCurrentUser),
        })
          .addTo(mapInstanceRef.current)
          .bindPopup(`<div class="custom-popup"><strong>${source.name}</strong><br>${source.source}</div>`)

        sourceMarkersRef.current.push(marker)
      }
    })

    // Create routes: owner to co-passengers, then to destination
    if (ride.rideType === "shared" && ownerSource && allSources.length > 1) {
      // First create routes from owner to each co-passenger
      allSources.forEach((source) => {
        if (!source.isOwner && source.coordinates && ownerSource.coordinates) {
          // Route from owner to co-passenger (blue color)
          createRoute(
            ownerSource.coordinates,
            source.coordinates,
            "#3B82F6", // Blue color for pickup routes
            "pickup",
          )

          // Route from co-passenger to destination (green color)
          if (ride.destinationCoordinates) {
            createRoute(
              source.coordinates,
              ride.destinationCoordinates,
              "#10B981", // Green color for destination routes
              "destination",
            )
          }
        }
      })
    } else {
      // For private rides or if there's only one source, just create direct routes to destination
      allSources.forEach((source) => {
        if (source.coordinates && ride.destinationCoordinates) {
          createRoute(source.coordinates, ride.destinationCoordinates, source.isCurrentUser ? "#3B82F6" : "#94A3B8")
        }
      })
    }

    // Fit map to show all markers
    const bounds = []

    // Add source coordinates to bounds
    allSources.forEach((source) => {
      if (source.coordinates) {
        bounds.push([source.coordinates.latitude, source.coordinates.longitude])
      }
    })

    // Add destination coordinates to bounds
    if (ride.destinationCoordinates) {
      bounds.push([ride.destinationCoordinates.latitude, ride.destinationCoordinates.longitude])
    }

    if (bounds.length > 0) {
      mapInstanceRef.current.fitBounds(L.latLngBounds(bounds).pad(0.3))
    }
  }

  // Update the createRoute function to accept a route type parameter
  const createRoute = (source, destination, color = "#3B82F6", routeType = "default") => {
    if (!mapInstanceRef.current) return

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(source.latitude, source.longitude), L.latLng(destination.latitude, destination.longitude)],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: false,
      lineOptions: {
        styles: [
          { color: color, opacity: 0.8, weight: 6 },
          { color: color, opacity: 1, weight: 3 },
        ],
      },
      createMarker: () => null, // Disable default markers
    }).addTo(mapInstanceRef.current)

    // Hide routing container but make sure routes are visible
    setTimeout(() => {
      const routingContainer = document.querySelector(".leaflet-routing-container")
      if (routingContainer) {
        routingContainer.style.display = "none"
      }
    }, 100)

    routingControlsRef.current.push(routingControl)
  }

  // Modern source marker
  const createSourceIcon = (isCurrentUser = false) => {
    return L.divIcon({
      className: "source-marker",
      html: `
        <div class="custom-marker source-marker-inner">
          <div class="marker-icon">
            <svg viewBox="0 0 24 24" width="32" height="32">
              <path fill="${isCurrentUser ? "#10B981" : "#6366F1"}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div class="marker-shadow"></div>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42],
    })
  }

  // Modern destination marker
  const createDestinationIcon = () => {
    return L.divIcon({
      className: "destination-marker",
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
    })
  }

  // If loading or no ride data, show loading state
  if (loading || reduxLoading || !ride) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-gray-700">Loading ride details...</h2>
        </div>
      </div>
    )
  }

  // Replace the Map Section and the content layout with a side-by-side layout
  // Replace the return statement from the line with the Main Card div to the end of the component with this updated layout:
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pt-8 px-4 pb-16">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Dashboard</span>
        </button>

        {/* Main Content - Side by Side Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Ride Details */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h1 className="text-2xl font-bold mb-2">Ride Confirmation</h1>
                <div className="flex items-center">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ride.status === "waiting"
                        ? "bg-yellow-400 text-yellow-800"
                        : ride.status === "confirmed"
                          ? "bg-green-400 text-green-800"
                          : ride.status === "private"
                            ? "bg-purple-400 text-purple-800"
                            : ride.status === "cancelled"
                              ? "bg-red-400 text-red-800"
                              : "bg-blue-400 text-blue-800"
                    }`}
                  >
                    {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                  </div>

                  <div className="mx-2 h-1 w-1 bg-white rounded-full opacity-50"></div>

                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      ride.rideType === "private" ? "bg-indigo-400 text-indigo-800" : "bg-teal-400 text-teal-800"
                    }`}
                  >
                    {ride.rideType === "private" ? "Private Ride" : "Shared Ride"}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
                {/* Ride Details */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Ride Details</h2>

                  <div className="space-y-4">
                    {/* User's Source */}
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FaMapMarkerAlt className="text-green-600" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Your Pickup Location</div>
                        <div className="font-medium">{userSource?.name || ride.source}</div>
                      </div>
                    </div>

                    {/* Show All Passenger Pickup Locations for Shared Rides */}
                    {ride.rideType === "shared" && ride.status !== "cancelled" && allSources.length > 1 && (
                      <div className="mt-2 ml-14">
                        <div className="text-sm font-medium text-gray-700 mb-2">All Pickup Locations:</div>
                        <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                          {allSources.map((source, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 ring-2 ring-green-200 mr-2"></div>
                              <div>
                                <div className="text-sm font-medium">
                                  {source.name} {source.isCurrentUser && "(You)"} {source.isOwner && "(Ride Owner)"}
                                </div>
                                <div className="text-xs text-gray-500">{source.source}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                        <div className="font-medium">
                          {formattedTime} on {formattedDate}
                        </div>
                      </div>
                    </div>

                    {/* Ride Type */}
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          {ride.rideType === "private" ? (
                            <FaCarSide className="text-purple-600" />
                          ) : (
                            <FaUsers className="text-purple-600" />
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Ride Type</div>
                        <div className="font-medium">
                          {ride.rideType === "private" ? "Private Ride" : "Shared Ride"}
                          {ride.rideType === "shared" && (
                            <span className="ml-2 text-sm text-gray-500">
                              {getMatchedRidersCount()
                                ? `(Matched with ${getMatchedRidersCount()} ${getMatchedRidersCount() === 1 ? "rider" : "riders"})`
                                : "(Waiting for matches)"}
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
                          {ride.originalFare && ride.originalFare > ride.fare && (
                            <div className="text-xs text-green-600 mt-1">
                              Discount applied: ₹{ride.originalFare} → ₹{ride.fare}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Consent Status */}
                    {ride.rideType === "shared" && getMatchedRidersCount() > 0 && hasAnyUserSentConsent() && (
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-indigo-600" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Consent Status</div>
                          <div className="font-medium">
                            {hasUserSentConsent()
                              ? "You have responded to this ride request"
                              : "A response is required for this shared ride"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Matched Users - Show only for shared rides */}
                    {ride.rideType === "shared" && getMatchedRidersCount() > 0 && (
                      <div className="flex">
                        <div className="mr-4">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <FaUsers className="text-teal-600" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            {getCurrentUserId() === ride.userId || getCurrentUserId() === ride.userId?._id
                              ? "Matched With"
                              : "Sharing With"}
                          </div>
                          <div className="font-medium">
                            {/* Show ride owner if current user is not the owner */}
                            {getCurrentUserId() !== ride.userId && getCurrentUserId() !== ride.userId?._id && (
                              <div className="mb-1">
                                {ride.userId && typeof ride.userId === "object" && ride.userId.name
                                  ? ride.userId.name
                                  : ride.userId && typeof ride.userId === "object" && ride.userId.email
                                    ? ride.userId.email.split("@")[0]
                                    : "Ride Owner"}{" "}
                                (Ride Owner)
                              </div>
                            )}

                            {/* Show matched users */}
                            {ride.matchedWith &&
                              ride.matchedWith.map((match, index) => {
                                // Determine the name to display
                                let userName = "A Co-Passenger"

                                // Try to get user from populated field
                                if (match.userId && typeof match.userId === "object") {
                                  if (match.userId.name) {
                                    userName = match.userId.name
                                  } else if (match.userId.email) {
                                    userName = match.userId.email.split("@")[0]
                                  }
                                }

                                // Check if this is the current user
                                const isCurrentUser =
                                  getCurrentUserId() === match.userId ||
                                  (match.userId &&
                                    typeof match.userId === "object" &&
                                    getCurrentUserId() === match.userId._id)

                                return (
                                  <div key={index} className="mb-1">
                                    {userName}
                                    {isCurrentUser && " (You)"}
                                  </div>
                                )
                              })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shared Ride Consent Section (only for shared rides with matches) */}
                {ride.rideType === "shared" && getMatchedRidersCount() > 0 && !hasUserSentConsent() && (
                  <div className="mb-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Shared Ride Confirmation</h3>

                    <p className="text-gray-600 mb-4">
                      {getCurrentUserId() === ride.userId || getCurrentUserId() === ride.userId?._id ? (
                        <>
                          We've found {getMatchedRidersCount()} {getMatchedRidersCount() === 1 ? "rider" : "riders"}{" "}
                          going your way!
                          {ride.matchedWith.length > 0 && (
                            <>
                              You'll be sharing with{" "}
                              {ride.matchedWith.map((match, idx) => {
                                // Get user name
                                let userName = "A Co-Passenger"
                                if (match.userId && typeof match.userId === "object") {
                                  if (match.userId.name) {
                                    userName = match.userId.name
                                  } else if (match.userId.email) {
                                    userName = match.userId.email.split("@")[0]
                                  }
                                }

                                return (
                                  <span key={idx} className="font-medium">
                                    {idx > 0 && idx === ride.matchedWith.length - 1 ? " and " : idx > 0 ? ", " : ""}
                                    {userName}
                                  </span>
                                )
                              })}
                              .
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {ride.userId && typeof ride.userId === "object" ? (
                            <>
                              You're matched with{" "}
                              {ride.userId.name || ride.userId.email?.split("@")[0] || "another rider"}'s ride to{" "}
                              {ride.destination}. Would you like to share this ride?
                            </>
                          ) : (
                            <>
                              You're matched with another rider's ride to {ride.destination}. Would you like to share
                              this ride?
                            </>
                          )}
                        </>
                      )}
                    </p>

                    <p className="text-gray-600 mb-4">
                      Accepting will reduce your fare by half when all riders confirm.
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
                    disabled={ride.status === "cancelled"}
                    className={`px-6 py-2.5 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors ${
                      ride.status === "cancelled" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Cancel Ride
                  </button>

                  <button
                    onClick={() => navigate("/my-rides?view=all")}
                    className="px-6 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    View All Rides
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="w-full lg:w-1/2 h-[600px] lg:h-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <h2 className="text-xl font-bold">Ride Map</h2>
              </div>
              <div className="p-6 h-[calc(100%-80px)] relative">
                <div ref={mapContainerRef} style={mapContainerStyle} className="shadow-md"></div>

                {/* Map Legend Overlay - Positioned on top of the map */}
                <div className="absolute bottom-10 right-10 bg-white border-2 border-blue-200 p-3 rounded-lg shadow-md max-w-[280px] z-[1000]">
                  <h3 className="font-semibold text-gray-800 mb-2 text-center border-b border-gray-200 pb-1 text-sm">
                    Map Legend
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Markers */}
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <h4 className="text-xs font-medium text-blue-700 mb-1 border-b border-blue-100 pb-1">Markers</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs">
                          <div className="w-6 h-6 mr-2 flex items-center justify-center bg-white rounded-full shadow-sm">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                              <path
                                fill="#6366F1"
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                              />
                            </svg>
                          </div>
                          <span className="font-medium">Ride Owner's Pickup</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <div className="w-6 h-6 mr-2 flex items-center justify-center bg-white rounded-full shadow-sm">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                              <path
                                fill="#10B981"
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                              />
                            </svg>
                          </div>
                          <span className="font-medium">Your Pickup</span>
                        </div>
                        <div className="flex items-center text-xs">
                          <div className="w-6 h-6 mr-2 flex items-center justify-center bg-white rounded-full shadow-sm">
                            <svg viewBox="0 0 24 24" width="18" height="18">
                              <path
                                fill="#EF4444"
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                              />
                            </svg>
                          </div>
                          <span className="font-medium">Destination</span>
                        </div>
                        {ride.rideType === "shared" && (
                          <div className="flex items-center text-xs">
                            <div className="w-6 h-6 mr-2 flex items-center justify-center bg-white rounded-full shadow-sm">
                              <svg viewBox="0 0 24 24" width="18" height="18">
                                <path
                                  fill="#94A3B8"
                                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                />
                              </svg>
                            </div>
                            <span className="font-medium">Co-passenger Pickup</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Routes */}
                    <div className="bg-indigo-50 p-2 rounded-lg">
                      <h4 className="text-xs font-medium text-indigo-700 mb-1 border-b border-indigo-100 pb-1">
                        Routes
                      </h4>
                      <div className="space-y-2">
                        {ride.rideType === "shared" ? (
                          <>
                            <div className="flex items-center text-xs">
                              <div className="w-8 h-3 bg-blue-500 mr-2 rounded-full shadow-sm"></div>
                              <span className="font-medium">Pickup Route</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <div className="w-8 h-3 bg-green-500 mr-2 rounded-full shadow-sm"></div>
                              <span className="font-medium">Destination Route</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center text-xs">
                              <div className="w-8 h-3 bg-blue-500 mr-2 rounded-full shadow-sm"></div>
                              <span className="font-medium">Your Route</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <div className="w-8 h-3 bg-gray-400 mr-2 rounded-full shadow-sm"></div>
                              <span className="font-medium">Other Routes</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-3">
                {confirmationAction === "accept"
                  ? "Accept Shared Ride?"
                  : confirmationAction === "reject"
                    ? "Decline Shared Ride?"
                    : "Cancel Ride?"}
              </h3>

              <p className="text-gray-600 mb-6">
                {confirmationAction === "accept"
                  ? "You are about to accept sharing this ride with other passengers. Proceed?"
                  : confirmationAction === "reject"
                    ? "If you decline, we'll create a private ride for you instead. Proceed?"
                    : "Are you sure you want to cancel this ride? This action cannot be undone."}
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
                  className={`flex-1 px-4 py-2 text-white rounded-lg ${
                    confirmationAction === "accept"
                      ? "bg-green-500 hover:bg-green-600"
                      : confirmationAction === "reject"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  Yes, Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}





export default RideConfirmation;