"use client"

import { CalendarCheck, Car, ThumbsUp, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
    },
  }

  return (
    <section className="w-full py-12 md:py-24 bg-[#FBF3D5] relative overflow-hidden">
      {/* Decorative background elements */}
      <motion.div
        className="absolute top-20 left-10 w-24 h-24 rounded-full bg-[#EFBC9B]/20"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-[#9CAFAA]/20"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-[#D6DAC8]/20"
        animate={{
          y: [0, 30, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <div className="container px-4 md:px-6 relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#9CAFAA]"
              animate={pulseAnimation}
            >
              How It Works
            </motion.h2>
            <motion.p
              className="mx-auto max-w-[700px] text-[#9CAFAA]/80 md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              Our simple 3-step process gets you on the road in no time
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Step 1 */}
            <motion.div
              className="group relative overflow-hidden rounded-lg transition-all hover:shadow-xl"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#EFBC9B] to-[#F5D0B5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-md group-hover:translate-y-[-5px] transition-transform duration-300">
                <motion.div
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EFBC9B] mb-4"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <CalendarCheck className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#9CAFAA] mb-2">Step 1: Sign Up & Verify</h3>
                <p className="text-[#9CAFAA]/80 text-center">
                  Register with your college details and verify your account for a seamless experience.
                </p>
                <motion.div
                  className="absolute top-0 right-0 bg-[#D6DAC8] text-white font-bold rounded-bl-lg px-3 py-1"
                  whileHover={{ scale: 1.1 }}
                >
                  01
                </motion.div>
              </div>
            </motion.div>

            {/* Arrow 1 */}
            <div className="hidden md:flex absolute left-[31.5%] top-1/2 transform -translate-y-1/2 z-10">
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <ChevronRight className="h-12 w-12 text-[#9CAFAA]" />
              </motion.div>
            </div>

            {/* Step 2 */}
            <motion.div
              className="group relative overflow-hidden rounded-lg transition-all hover:shadow-xl"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#EFBC9B] to-[#F5D0B5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-md group-hover:translate-y-[-5px] transition-transform duration-300">
                <motion.div
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D6DAC8] mb-4"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Car className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#9CAFAA] mb-2">Step 2: Book Your Ride</h3>
                <p className="text-[#9CAFAA]/80 text-center">
                  Choose between a private or shared ride based on your preference and schedule.
                </p>
                <motion.div
                  className="absolute top-0 right-0 bg-[#9CAFAA] text-white font-bold rounded-bl-lg px-3 py-1"
                  whileHover={{ scale: 1.1 }}
                >
                  02
                </motion.div>
              </div>
            </motion.div>

            {/* Arrow 2 */}
            <div className="hidden md:flex absolute left-[65.5%] top-1/2 transform -translate-y-1/2 z-10">
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <ChevronRight className="h-12 w-12 text-[#9CAFAA]" />
              </motion.div>
            </div>

            {/* Step 3 */}
            <motion.div
              className="group relative overflow-hidden rounded-lg transition-all hover:shadow-xl"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#EFBC9B] to-[#F5D0B5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex flex-col items-center p-6 bg-white rounded-lg shadow-md group-hover:translate-y-[-5px] transition-transform duration-300">
                <motion.div
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-[#9CAFAA] mb-4"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <ThumbsUp className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#9CAFAA] mb-2">Step 3: Ride With Confidence</h3>
                <p className="text-[#9CAFAA]/80 text-center">
                  Enjoy a safe and smooth journey with verified drivers and fellow students.
                </p>
                <motion.div
                  className="absolute top-0 right-0 bg-[#EFBC9B] text-white font-bold rounded-bl-lg px-3 py-1"
                  whileHover={{ scale: 1.1 }}
                >
                  03
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
          >
            {/* <motion.button
              className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-to-br from-[#EFBC9B] to-[#F5D0B5] px-8 text-base font-medium text-white shadow transition-colors hover:bg-gradient-to-br hover:from-[#F5D0B5] hover:to-[#EFBC9B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CAFAA]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button> */}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative dots pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 grid grid-cols-3 gap-2 opacity-20">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#9CAFAA]"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <div className="absolute bottom-10 left-10 grid grid-cols-3 gap-2 opacity-20">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#EFBC9B]"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

