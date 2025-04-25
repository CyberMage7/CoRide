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
   GET_USER_PROFILE,
   UPDATE_PASSWORD_API,
//   RESETPASSTOKEN_API,
//   RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending OTP...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      
      // Always navigate to verify-email if navigation function is provided
      if (navigate) {
        navigate("/verify-email")
      }
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error(error.response?.data?.message || "Could Not Send OTP")
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
    collegeId,
    password,
    confirmPassword,
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
      collegeId: collegeId ? "College ID provided" : "No college ID",
      password: password ? "Password provided" : "No password",
      confirmPassword: confirmPassword ? "Password provided" : "No password",
      preferredGender,
      emergencyContact,
      otp,
      navigate: navigate ? "Navigate function provided" : "No navigate function"
    });

    const toastId = toast.loading("Creating your account...")
    dispatch(setLoading(true))
    try {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("collegeName", collegeName);
      formData.append("password", password);
      formData.append("preferredGender", preferredGender);
      formData.append("emergencyContact", emergencyContact);
      formData.append("otp", otp); // Use the OTP provided by the user
      
      // Append file if it exists
      if (collegeId) {
        formData.append("collegeId", collegeId);
      }
      
      console.log("SignUp API FormData created");
      
      // Log the content of the FormData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'collegeId' ? 'File data' : pair[1]));
      }
      
      const response = await apiConnector("POST", SIGNUP_API, formData, {
        "Content-Type": "multipart/form-data",
        // Ensure axios doesn't try to serialize FormData
        transformRequest: [(data) => data],
      });

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Account created successfully!")
      navigate("/login") 
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error(error.response?.data?.message || error.message || "Signup Failed")
      // Don't navigate away
      dispatch(setLoading(false))
      toast.dismiss(toastId)
      return
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
      
      // Important: Get the token value
      const token = response.data.token;
      
      // Store token in Redux
      dispatch(setToken(token));
      
      // Store token in localStorage (as raw string)
      localStorage.setItem("token", token);
      
      try {
        // Fetch user profile data immediately after login
        const userResponse = await apiConnector("GET", GET_USER_PROFILE, null, {
          Authorization: `Bearer ${token}`,
        });
        
        console.log("GET USER PROFILE API RESPONSE............", userResponse);
        
        if (!userResponse.data.success) {
          throw new Error(userResponse.data.message);
        }
        
        const userData = userResponse.data.user;
        
        // Set user image from Cloudinary if available or use default
        let userImage;
        if (userData.collegeId && userData.collegeId.secure_url) {
          userImage = userData.collegeId.secure_url;
        } else {
          userImage = `https://api.dicebear.com/5.x/initials/svg?seed=${userData.fullName}`;
        }
        
        // Update Redux state with complete user data
        dispatch(setUser({ ...userData, image: userImage }));
        
        // Store complete user data in localStorage
        localStorage.setItem("user", JSON.stringify({
          ...userData,
          image: userImage
        }));
        
        console.log("User data set to profile state:", { ...userData, image: userImage });
        
        // Navigate to dashboard with complete user data loaded
        navigate("/dashboard");
      } catch (profileError) {
        console.log("Error fetching user profile:", profileError);
        toast.error("Logged in but couldn't fetch profile data");
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error(error.response?.data?.message || "Login Failed");
    }

    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
    return (dispatch) => {
      dispatch(setToken(null))
      dispatch(setUser(null))
      // dispatch(resetCart())
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged Out")
      navigate("/")
    }
  }

// Get user profile data
export function getUserProfile(token) {
  return async (dispatch) => {
    const toastId = toast.loading("Fetching your profile...");
    dispatch(setLoading(true));
    
    try {
      console.log("getUserProfile called with token:", token);
      
      const response = await apiConnector("GET", GET_USER_PROFILE, null, {
        Authorization: `Bearer ${token}`,
      });
      
      console.log("GET USER PROFILE API RESPONSE............", response);
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      
      const userData = response.data.user;
      
      // Set user image from Cloudinary if available or use default
      let userImage;
      if (userData.collegeId && userData.collegeId.secure_url) {
        userImage = userData.collegeId.secure_url;
      } else {
        userImage = `https://api.dicebear.com/5.x/initials/svg?seed=${userData.fullName}`;
      }
      
      const updatedUserData = { ...userData, image: userImage };
      
      // Update Redux state with complete user data
      dispatch(setUser(updatedUserData));
      
      // Also update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      
      // console.log("User profile fetched and stored in Redux:", updatedUserData);
      
      toast.success("Profile loaded successfully");
      
      // Return the user data for the component to use
      return updatedUserData;
    } catch (error) {
      console.log("GET USER PROFILE API ERROR............", error);
      toast.error("Failed to fetch profile");
      throw error;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

// Update user password
export function updatePassword(currentPassword, newPassword, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating password...");
    dispatch(setLoading(true));
    
    try {
      const response = await apiConnector("PUT", UPDATE_PASSWORD_API, {
        currentPassword,
        newPassword
      }, {
        Authorization: `Bearer ${token}`
      });
      
      console.log("UPDATE PASSWORD API RESPONSE............", response);
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      
      toast.success("Password updated successfully");
      return response.data;
    } catch (error) {
      console.log("UPDATE PASSWORD API ERROR............", error);
      toast.error(error.response?.data?.message || "Failed to update password");
      throw error;
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}