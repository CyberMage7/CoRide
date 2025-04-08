import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../services/operations/authAPI"
import { Mail, Lock, Eye, EyeOff, Heart, Shield, Users, MapPin, Star, Clock } from "lucide-react"

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    setWindowWidth(window.innerWidth)

    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = formData
    setLoading(true)
    try {
      dispatch(login(email, password, navigate))
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <div className="flex-1 p-6 md:p-10 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl border border-gray-100 p-6 md:p-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <motion.h1
              className="text-4xl font-bold text-gray-800 mb-3"
              animate={{
                textShadow: ["0 0 0px rgba(0,0,0,0)", "0 0 10px rgba(0,0,0,0.2)", "0 0 0px rgba(0,0,0,0)"],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              Welcome Back
            </motion.h1>
            <motion.p
              className="text-gray-600 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Continue your journey with Co-Ride
            </motion.p>
          </motion.div>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label className="w-full">
                <p className="mb-2.5 text-[0.95rem] leading-[1.375rem] text-gray-700 font-medium">
                  Email Address <sup className="text-yellow-500">*</sup>
                </p>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full rounded-xl bg-white p-[14px] pl-14 text-gray-800 border border-gray-300 focus:border-yellow-500 focus:outline-none focus:ring-3 focus:ring-yellow-500/20 transition-all duration-300 shadow-sm"
                  />
                </div>
              </label>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className="relative w-full">
                <p className="mb-2.5 text-[0.95rem] leading-[1.375rem] text-gray-700 font-medium">
                  Password <sup className="text-yellow-500">*</sup>
                </p>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    className="w-full rounded-xl bg-white p-[14px] pl-14 pr-12 text-gray-800 border border-gray-300 focus:border-yellow-500 focus:outline-none focus:ring-3 focus:ring-yellow-500/20 transition-all duration-300 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <Link to="/forgot-password">
                    <p className="mt-3 text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors hover:underline">
                      Forgot Password?
                    </p>
                  </Link>
                </div>
              </label>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              className="mt-8 rounded-xl bg-yellow-500 py-4 px-6 font-semibold text-white hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(234, 179, 8, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>

            <motion.p
              className="text-center text-gray-600 text-base mt-6 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Don't have an account?{" "}
              <Link to="/signup" className="text-yellow-600 hover:text-yellow-700 transition-colors font-semibold hover:underline">
                Sign up
              </Link>
            </motion.p>
          </form>
        </div>
      </div>

      {/* Enhanced Animated Illustration Side */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-indigo-700 items-center justify-center relative overflow-hidden">
        {/* Floating particles */}
        {[...Array(40)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.15} />
        ))}

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />

        {/* Animated map with route */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatedMap />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-10">
          <div className="text-center space-y-10 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.h2
                className="text-7xl font-bold text-white"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255, 255, 255, 0.3)",
                    "0 0 40px rgba(255, 255, 255, 0.5)",
                    "0 0 20px rgba(255, 255, 255, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                Co-Ride
              </motion.h2>
            </motion.div>

            <motion.p
              className="text-white/80 max-w-md mx-auto text-xl font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Your trusted ride-sharing community for safe and affordable commuting
            </motion.p>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { icon: Shield, text: "Safe & Secure", desc: "Verified drivers & encrypted data" },
                { icon: Users, text: "Verified Users", desc: "Background checks for all members" },
                { icon: Heart, text: "Trusted Community", desc: "4.9/5 average user rating" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg shadow-black/5"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.6 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(255, 255, 255, 0.3)",
                    y: -5,
                  }}
                >
                  <motion.div
                    className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center bg-white/20"
                    whileHover={{ rotate: 5 }}
                    animate={index === 1 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{
                      duration: index === 1 ? 2 : 0.3,
                      repeat: index === 1 ? Number.POSITIVE_INFINITY : 0,
                      ease: "easeInOut",
                    }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <p className="text-lg font-medium text-white">{feature.text}</p>
                  <p className="text-sm text-white/80 mt-2">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

// Enhanced floating particle component
function FloatingParticle({ delay = 0 }) {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomSize = Math.random() * 4 + 1
  const randomDuration = Math.random() * 10 + 5
  const randomOpacity = Math.random() * 0.5 + 0.3

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        background: `rgba(255, 255, 255, ${randomOpacity})`,
        boxShadow: `0 0 ${randomSize * 2}px rgba(255, 255, 255, ${randomOpacity})`,
      }}
      animate={{
        x: [0, Math.random() * 30 - 15, 0],
        y: [0, Math.random() * 30 - 15, 0],
        scale: [1, Math.random() * 0.5 + 1.2, 1],
        opacity: [randomOpacity, randomOpacity * 1.5, randomOpacity],
      }}
      transition={{
        duration: randomDuration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: delay,
      }}
    />
  )
}

// Animated map component
function AnimatedMap() {
  return (
    <motion.div
      className="relative w-[500px] h-[500px] opacity-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 2 }}
    >
      {/* Map grid */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
        {[...Array(100)].map((_, i) => (
          <div key={i} className="border border-white/10" />
        ))}
      </div>

      {/* Map route */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
        <motion.path
          d="M100,400 C150,300 200,350 250,200 S350,100 400,100"
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="4"
          strokeDasharray="10 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
        />

        {/* Start point */}
        <motion.circle
          cx="100"
          cy="400"
          r="8"
          fill="rgba(255, 255, 255, 0.8)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* End point */}
        <motion.circle
          cx="400"
          cy="100"
          r="8"
          fill="rgba(255, 255, 255, 0.8)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 1, delay: 3.5 }}
        />

        {/* Moving point along the path */}
        <motion.circle
          cx="0"
          cy="0"
          r="6"
          fill="#FFDD00"
          filter="drop-shadow(0 0 8px rgba(255, 221, 0, 0.8))"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
          style={{ offsetPath: "path('M100,400 C150,300 200,350 250,200 S350,100 400,100')" }}
        />
      </svg>

      {/* Location markers */}
      <motion.div
        className="absolute left-[100px] top-[400px] -ml-4 -mt-4"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
      </motion.div>

      <motion.div
        className="absolute left-[400px] top-[100px] -ml-4 -mt-4"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 3.5 }}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
      </motion.div>

      {/* Floating UI elements */}
      <motion.div
        className="absolute left-[250px] top-[200px] -ml-16 -mt-16 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20 w-32"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="w-4 h-4 text-yellow-300" />
          <span className="text-white text-xs">15 min ride</span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-300" />
          <span className="text-white text-xs">4.9 rating</span>
        </div>
      </motion.div>
    </motion.div>
  )
}


