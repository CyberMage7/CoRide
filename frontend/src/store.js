import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileslice';
import ridesReducer from './slices/ridesSlice';

// Preload state from localStorage if available
const preloadedState = {
  auth: {
    token: localStorage.getItem("token") || null,
    loading: false,
    signupData: null
  },
  profile: {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false
  },
  rides: {
    allRides: [],
    currentRide: null,
    loading: false,
    error: null
  }
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    rides: ridesReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setSignupData'],
        ignoredPaths: ['auth.signupData.collegeId'],
      },
    }),
});

export default store;