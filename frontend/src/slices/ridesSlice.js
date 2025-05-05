import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  allRides: [],
  currentRide: null,
  loading: false,
  error: null,
}

const ridesSlice = createSlice({
  name: "rides",
  initialState: initialState,
  reducers: {
    setRideLoading(state, value) {
      state.loading = value.payload
    },
    setCurrentRide(state, value) {
      state.currentRide = value.payload
    },
    setAllRides(state, value) {
      state.allRides = value.payload
    },
    setRideError(state, value) {
      state.error = value.payload
    },
    clearRideError(state) {
      state.error = null
    },
    clearCurrentRide(state) {
      state.currentRide = null
    }
  },
})

export const { 
  setRideLoading, 
  setCurrentRide, 
  setAllRides, 
  setRideError,
  clearRideError,
  clearCurrentRide
} = ridesSlice.actions

export default ridesSlice.reducer