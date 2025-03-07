import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
// import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
   LOGIN_API,
//   RESETPASSTOKEN_API,
//   RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
    fullName,
    email,
    phone,
    collegeName,
    // collegeId,
    password,
    confirmPassword,
    // profilePic,
    preferredGender,
    emergencyContact,
    otp,
    navigate
) {
  return async (dispatch) => {
    console.log("SignUp Props Received:", {
      fullName,
      email,
      phone,
      collegeName,
      password: password ? "Password provided" : "No password",
      confirmPassword: confirmPassword ? "Password provided" : "No password",
      preferredGender,
      emergencyContact,
      otp,
      navigate: navigate ? "Navigate function provided" : "No navigate function"
    });

    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const payload = {
        fullName,
        email,
        phone,
        collegeName,
        password,
        preferredGender,
        emergencyContact,
        otp,
      };
      console.log("SignUp API Payload:", payload);
      
      const response = await apiConnector("POST", SIGNUP_API, payload);

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login") // change 
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    console.log("Login Props Received:", {
      email,
      password: password ? "Password provided" : "No password",
      navigate: navigate ? "Navigate function provided" : "No navigate function"
    });

    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const payload = {
        email,
        password,
      };
      console.log("Login API Payload:", payload);

      // Call backend
      const response = await apiConnector("POST", LOGIN_API, payload);

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful");
      dispatch(setToken(response.data.token));

    
        
      const userImage = `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.fullName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));

      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/"); // dashboard/myprofile continue by vishwash mishra
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
     
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}


export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
      dispatch(resetCart())
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
  }