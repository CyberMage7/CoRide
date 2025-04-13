import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';

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
  }
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
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