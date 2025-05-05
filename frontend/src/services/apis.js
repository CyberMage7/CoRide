const BASE_URL = import.meta.env.VITE_BASE_URL;
 export const profileEndpoints = {
     GET_USER_DETAILS_API: `${BASE_URL}/profile/getUserDetails`,
   };
// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: `${BASE_URL}/auth/sendotp`,
  SIGNUP_API: `${BASE_URL}/auth/signup`,
  LOGIN_API:  `${BASE_URL}/auth/login`,
  GET_USER_PROFILE: `${BASE_URL}/auth/me`,
};

// RIDE ENDPOINTS
export const rideEndpoints = {
  CREATE_RIDE: `${BASE_URL}/rides`,
  GET_USER_RIDES: `${BASE_URL}/rides`,
  GET_RIDE_BY_ID: `${BASE_URL}/rides`,
  UPDATE_RIDE_CONSENT: `${BASE_URL}/rides/consent`,
  CANCEL_RIDE: `${BASE_URL}/rides`
};