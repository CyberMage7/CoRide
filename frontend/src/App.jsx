import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Signup from "./Pages/Signup"
import OpenRoute from "./Components/core/OpenRoute"
import VerifyEmail from "./Pages/VerifyEmail"
import Login from "./Pages/Login"
import UserDashboard from "./Pages/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "./services/operations/authAPI";
import AboutUs from "./Pages/AboutUs";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // If token exists, fetch user profile
    if (token) {
      dispatch(getUserProfile(token));
    }
  }, [token, dispatch]);
  
  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route
          path="verify-email"
          element={
            // <OpenRoute>
              <VerifyEmail />
            // </OpenRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
