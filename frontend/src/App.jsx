import { useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Signup from "./Pages/Signup"
import OpenRoute from "./Components/core/OpenRoute"
import VerifyEmail from "./Pages/VerifyEmail"
import Login from "./Pages/Login"

function App() {
  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<Login />} />
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
