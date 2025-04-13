import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendOtp } from "../services/operations/authAPI";
import { setSignupData } from "../slices/authSlice";
import { useNavigate } from "react-router-dom"; // Add this import
import { useDispatch } from "react-redux";
import {
  Car,
  Upload,
  User,
  Mail,
  Phone,
  School,
  Lock,
  PhoneCall,
  Eye,
  EyeOff,
  Heart,
  Shield,
  Users,
  MapPin,
} from "lucide-react";
import { signUp } from "../services/operations/authAPI";

// Particle component for background effects
const Particle = ({ delay }) => (
  <motion.div
    className="absolute w-1 h-1 bg-white/20 rounded-full"
    initial={{
      x: Math.random() * 100 + "%",
      y: -10,
      opacity: 0,
    }}
    animate={{
      y: "100vh",
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 2 + Math.random() * 2,
      repeat: Number.POSITIVE_INFINITY,
      delay: delay,
      ease: "linear",
    }}
  />
);

// Animated car wheel component
const CarWheel = ({ className }) => (
  <motion.div
    className={`absolute w-4 h-4 bg-white rounded-full ${className}`}
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    }}
  />
);

export default function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState("");
  const [idPreview, setIdPreview] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    collegeName: "",
    collegeId: null,
    password: "",
    confirmPassword: "",
    // profilePic: null,
    preferredGender: "",
    emergencyContact: "",
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    let strength = 0;
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    Object.values(validations).forEach((valid) => {
      if (valid) strength += 20;
    });

    setPasswordStrength(strength);
    return strength >= 80;
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Full name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!validateEmail(formData.email))
        newErrors.email = "Invalid email format";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      else if (!validatePhone(formData.phone))
        newErrors.phone = "Invalid phone number";
      if (otpSent && !formData.otp) newErrors.otp = "OTP is required";
    }

    if (stepNumber === 2) {
      if (!formData.password) newErrors.password = "Password is required";
      else if (!validatePassword(formData.password))
        newErrors.password = "Password is too weak";
      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
      if (!formData.collegeName.trim())
        newErrors.collegeName = "College name is required";
      if (!formData.collegeId)
        newErrors.collegeId = "College ID is required";
    }

    if (stepNumber === 3) {
      // if (!formData.profilePic)
      //   newErrors.profilePic = "Profile picture is required";
      if (!formData.preferredGender)
        newErrors.preferredGender = "Please select preferred gender";
      if (!formData.emergencyContact)
        newErrors.emergencyContact = "Emergency contact is required";
      else if (!validatePhone(formData.emergencyContact))
        newErrors.emergencyContact = "Invalid emergency contact number";
      if (!acceptTerms)
        newErrors.terms = "Please accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("File size should be less than 5MB");
          return;
        }
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload an image file");
          return;
        }
      }
      setFormData((prev) => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "profilePic") setProfilePreview(reader.result);
        if (name === "collegeId") setIdPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (name === "password") validatePassword(value);
    }
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // const sendOTP = () => {
  //   if (!validatePhone(formData.phone)) {
  //     toast.error("Please enter a valid phone number")
  //     return
  //   }
  //   setOtpSent(true)
  //   dispatch(sendOtp(formData.email, navigate))
  //   toast.success("OTP sent successfully!")

  // }

  const verifyOTP = () => {
    if (formData.otp === "1234") {
      // Replace with actual OTP verification
      toast.success("OTP verified successfully!");
      setStep(2);
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) {
      toast.error("Please fill all required fields correctly");
      return;
    }
    setLoading(true);
    try {
      // Store signup data in Redux state
      dispatch(setSignupData(formData));
      
      // Only send OTP and navigate to verification page
      dispatch(sendOtp(formData.email, navigate));
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen #EFBC9B">
      <div className="flex-1 p-8">
        <div className="max-w-md mx-auto bg-slate-50 rounded-lg   shadow-2xl border-spacing-11   p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.h1
              className="text-4xl font-bold text-black mb-2"
              animate={{
                textShadow: [
                  "0 0 0px rgba(0,0,0,0)",
                  "0 0 10px rgba(0,0,0,0.2)",
                  "0 0 0px rgba(0,0,0,0)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              Welcome to Co-Ride  
            </motion.h1>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Start your journey with us
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <div className="h-2 bg-gray-200 rounded-full mb-6">
            <motion.div
              className="h-full bg-black rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        name="fullName"
                        type="text"
                        className={`pl-10 w-full p-3 border ${
                          errors.fullName ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        name="email"
                        type="email"
                        className={`pl-10 w-full p-3 border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          name="phone"
                          type="tel"
                          className={`pl-10 w-full p-3 border ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                          placeholder="1234567890"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      {/* <button
                        type="button"
                        onClick={sendOTP}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        Send OTP
                      </button> */}
                      <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar
                      />
                    </div>
                  </div>

                  {/* {otpSent && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                      <div className="flex gap-2">
                        <input
                          name="otp"
                          type="text"
                          className={`flex-1 p-3 border ${errors.otp ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                          placeholder="Enter OTP"
                          value={formData.otp}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={verifyOTP}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Verify
                        </button>
                      </div>
                      {errors.otp && <p className="mt-1 text-xs text-red-500">{errors.otp}</p>}
                    </motion.div>
                  )} */}

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className={`pl-10 pr-10 w-full p-3 border ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-yellow-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Password strength:{" "}
                      {passwordStrength >= 80
                        ? "Strong"
                        : passwordStrength >= 60
                        ? "Medium"
                        : "Weak"}
                    </p>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        className={`pl-10 w-full p-3 border ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* College Name Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      College Name
                    </label>
                    <div className="relative">
                      <School className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        name="collegeName"
                        type="text"
                        className={`pl-10 w-full p-3 border ${
                          errors.collegeName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                        placeholder="Enter your college name"
                        value={formData.collegeName}
                        onChange={handleChange}
                      />
                      {errors.collegeName && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.collegeName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* College ID Upload */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      College ID
                    </label>
                    <div className="flex items-center gap-4">
                      {idPreview && (
                        <img
                          src={idPreview}
                          alt="ID preview"
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <label
                        className={`flex-1 flex items-center gap-2 p-4 border-2 border-dashed ${
                          errors.collegeId
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg hover:bg-gray-50 cursor-pointer`}
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">Upload College ID</span>
                        <input
                          name="collegeId"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    {errors.collegeId && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.collegeId}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 p-3 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Profile Picture Upload */}
                  {/* <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      {profilePreview && (
                        <img
                          src={profilePreview || "/placeholder.svg"}
                          alt="Profile preview"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <label
                        className={`flex-1 flex items-center gap-2 p-4 border-2 border-dashed ${
                          errors.profilePic
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg hover:bg-gray-50 cursor-pointer`}
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">Upload photo</span>
                        <input
                          name="profilePic"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    {errors.profilePic && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.profilePic}
                      </p>
                    )}
                  </div> */}

                  {/* Preferred Gender */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Enter Gender
                    </label>
                    <select
                      name="preferredGender"
                      className={`w-full p-3 border ${
                        errors.preferredGender
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                      value={formData.preferredGender}
                      onChange={handleChange}
                    >
                      <option value="">Select preference</option>
                      <option value="Any">Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.preferredGender && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.preferredGender}
                      </p>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Emergency Contact
                    </label>
                    <div className="relative">
                      <PhoneCall className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        name="emergencyContact"
                        type="tel"
                        className={`pl-10 w-full p-3 border ${
                          errors.emergencyContact
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                        placeholder="Emergency contact number"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                      />
                      {errors.emergencyContact && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.emergencyContact}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I accept the{" "}
                      <a href="#" className="text-yellow-500 hover:underline">
                        terms and conditions
                      </a>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-xs text-red-500">{errors.terms}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 p-3 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-yellow-300"
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>
                    <ToastContainer
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
      {/* Enhanced Animated Illustration Side */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-500 to-indigo-600 items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-6 p-8 relative z-10"
        >
          <div className="relative">
            {/* Sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-500" />

            {/* Sun */}
            <motion.div
              className="absolute top-4 right-4 w-16 h-16 bg-yellow-300 rounded-full"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Clouds */}
            <motion.div
              className="absolute top-8 left-4 w-20 h-8 bg-white rounded-full"
              animate={{
                x: [0, 20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute top-16 right-8 w-24 h-10 bg-white rounded-full"
              animate={{
                x: [0, -30, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Road */}
            {/* <motion.div className="absolute bottom-0 left-0 right-0 h-24 bg-gray-700" /> */}
            <motion.div className="absolute bottom-0 left-0 right-0 h-24 bg-gray-700 flex justify-center items-center">
              {/* Center lane - dashed line */}
              <div className="flex w-full justify-center">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-1 w-8 bg-white mx-2" />
                ))}
              </div>
            </motion.div>

            {/* Car animation */}
            <motion.div
              animate={{
                x: [-100, 400],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ perspective: 1000 }}
              className="absolute bottom-4 left-0"
            >
              <Car className="w-16 h-12 text-red-500" />
            </motion.div>

            {/* Road markings */}
            <motion.div className="absolute bottom-5 left-0 right-0 flex justify-between">
              {[...Array()].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-2 w-12 bg-yellow-400"
                  animate={{
                    x: [-100, -400],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>

          <motion.h2
            className="text-4xl font-bold tracking-tighter text-white"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Co-Ride
          </motion.h2>

          <motion.p
            className="text-white/80 max-w-md mx-auto py-3"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Join our community of riders and make your daily commute more
            affordable, sustainable, and social. Share rides with verified
            college students and make new friends along the way.
          </motion.p>

          {/* Feature cards */}
          <motion.div
            className="grid grid-cols-2 gap-4 max-w-sm mx-auto"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Heart className="w-8 h-8 mx-auto text-pink-300 mb-2" />
              </motion.div>
              <p className="text-sm font-medium text-white">Safe & Secure</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <User className="w-8 h-8 mx-auto text-purple-300 mb-2" />
              </motion.div>
              <p className="text-sm font-medium text-white">Verified Users</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
