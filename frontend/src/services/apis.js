// const BASE_URL = process.env.REACT_APP_BASE_URL

// // AUTH ENDPOINTS
// export const endpoints = {
//   SENDOTP_API: BASE_URL + "/auth/sendotp",
//   SIGNUP_API: BASE_URL + "/auth/signup",
// //   LOGIN_API: BASE_URL + "/auth/login",
// //   RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
// //   RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
// }
// export const profileEndpoints = {
//     GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
//   }
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