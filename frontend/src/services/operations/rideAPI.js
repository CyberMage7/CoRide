import { toast } from "react-hot-toast"
import { setRideLoading, setCurrentRide, setAllRides, setRideError } from "../../slices/ridesSlice"
import { apiConnector } from "../apiConnector"
import { rideEndpoints } from "../apis"

const {
  CREATE_RIDE,
  GET_USER_RIDES,
  GET_RIDE_BY_ID,
  UPDATE_RIDE_CONSENT,
  CANCEL_RIDE,
} = rideEndpoints

// Create a new ride
export function createRide(rideData, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating your ride...")
    dispatch(setRideLoading(true))
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to create a ride")
      }

      const response = await apiConnector("POST", CREATE_RIDE, rideData, {
        Authorization: `Bearer ${token}`
      })

      console.log("CREATE RIDE API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      // Store the created ride in Redux
      dispatch(setCurrentRide(response.data.data))
      
      toast.success("Ride created successfully!")
      
      // Navigate to the ride confirmation page
      if (navigate) {
        navigate('/ride-confirmation')
      }
      
      return response.data.data
    } catch (error) {
      console.log("CREATE RIDE API ERROR............", error)
      toast.error(error.response?.data?.message || error.message || "Failed to create ride")
      dispatch(setRideError(error.response?.data?.message || error.message))
    } finally {
      dispatch(setRideLoading(false))
      toast.dismiss(toastId)
    }
  }
}

// Get all user rides
export function getUserRides() {
  return async (dispatch) => {
    const toastId = toast.loading("Fetching your rides...")
    dispatch(setRideLoading(true))
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to view your rides")
      }

      const response = await apiConnector("GET", GET_USER_RIDES, null, {
        Authorization: `Bearer ${token}`
      })

      console.log("GET USER RIDES API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      dispatch(setAllRides(response.data.data))
      toast.success("Rides loaded successfully")
      return response.data.data
    } catch (error) {
      console.log("GET USER RIDES API ERROR............", error)
      toast.error(error.response?.data?.message || error.message || "Failed to fetch rides")
      dispatch(setRideError(error.response?.data?.message || error.message))
    } finally {
      dispatch(setRideLoading(false))
      toast.dismiss(toastId)
    }
  }
}

// Get a specific ride by ID
export function getRideById(rideId) {
  return async (dispatch) => {
    const toastId = toast.loading("Fetching ride details...")
    dispatch(setRideLoading(true))
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to view ride details")
      }

      const response = await apiConnector("GET", `${GET_RIDE_BY_ID}/${rideId}`, null, {
        Authorization: `Bearer ${token}`
      })

      console.log("GET RIDE BY ID API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      // Store the fetched ride in Redux
      dispatch(setCurrentRide(response.data.data))
      
      toast.success("Ride details loaded")
      return response.data.data
    } catch (error) {
      console.log("GET RIDE BY ID API ERROR............", error)
      toast.error(error.response?.data?.message || error.message || "Failed to fetch ride details")
      dispatch(setRideError(error.response?.data?.message || error.message))
      return null
    } finally {
      dispatch(setRideLoading(false))
      toast.dismiss(toastId)
    }
  }
}

// Update ride consent (for shared rides)
export function updateRideConsent(rideId, consent) {
  return async (dispatch) => {
    const toastId = toast.loading(`Updating ride consent to ${consent}...`)
    dispatch(setRideLoading(true))
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to update ride consent")
      }

      const response = await apiConnector("POST", UPDATE_RIDE_CONSENT, 
        { rideId, consent }, 
        { Authorization: `Bearer ${token}` }
      )

      console.log("UPDATE RIDE CONSENT API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      dispatch(setCurrentRide(response.data.data))
      toast.success(`Ride consent updated to ${consent}`)
      return response.data.data
    } catch (error) {
      console.log("UPDATE RIDE CONSENT API ERROR............", error)
      toast.error(error.response?.data?.message || error.message || "Failed to update ride consent")
      dispatch(setRideError(error.response?.data?.message || error.message))
    } finally {
      dispatch(setRideLoading(false))
      toast.dismiss(toastId)
    }
  }
}

// Cancel a ride
export function cancelRide(rideId) {
  return async (dispatch) => {
    const toastId = toast.loading("Cancelling ride...")
    dispatch(setRideLoading(true))
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("You must be logged in to cancel a ride")
      }

      const response = await apiConnector("DELETE", `${CANCEL_RIDE}/${rideId}`, null, {
        Authorization: `Bearer ${token}`
      })

      console.log("CANCEL RIDE API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      // Refresh user rides after cancellation
      dispatch(getUserRides())
      
      toast.success("Ride cancelled successfully")
      return true
    } catch (error) {
      console.log("CANCEL RIDE API ERROR............", error)
      toast.error(error.response?.data?.message || error.message || "Failed to cancel ride")
      dispatch(setRideError(error.response?.data?.message || error.message))
      return false
    } finally {
      dispatch(setRideLoading(false))
      toast.dismiss(toastId)
    }
  }
}