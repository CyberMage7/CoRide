import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

// Custom SVG components for feature icons
const CarPoolIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M36 18H12L8 30H40L36 18Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 36H10V33H38V36H34"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="16" cy="30" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="32" cy="30" r="3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M24 18V12H32L36 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="20" cy="14" r="4" stroke="currentColor" strokeWidth="2" />
    <circle cx="28" cy="14" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const SaveMoneyIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 12C14.1 12 6 18.6 6 24C6 29.4 14.1 36 24 36C33.9 36 42 29.4 42 24C42 18.6 33.9 12 24 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 30C26.7614 30 29 27.3137 29 24C29 20.6863 26.7614 18 24 18C21.2386 18 19 20.6863 19 24C19 27.3137 21.2386 30 24 30Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M24 18V30"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M32 14L16 34"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const RideOptionsIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 24H12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M36 24H42"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect
      x="12"
      y="18"
      width="24"
      height="12"
      rx="6"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="18" cy="24" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="30" cy="24" r="3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M9 16C6.5 18.5 6 22.5 6 24C6 25.5 6.5 29.5 9 32"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M39 16C41.5 18.5 42 22.5 42 24C42 25.5 41.5 29.5 39 32"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LiveTrackingIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 6L24 42"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="2 4"
    />
    <path
      d="M12 12H36"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="2 4"
    />
    <path
      d="M12 36H36"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="2 4"
    />
    <path
      d="M30 18C30 16.3431 32.6863 15 36 15C39.3137 15 42 16.3431 42 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect
      x="30"
      y="18"
      width="12"
      height="6"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="36" cy="30" r="6" stroke="currentColor" strokeWidth="2" />
    <circle cx="36" cy="30" r="2" stroke="currentColor" strokeWidth="2" />
    <path
      d="M16 24L10 30L16 36"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Features() {
  const features = [
    {
      icon: <CarPoolIcon />,
      title: "Campus Connections",
      description:
        "Travel safely with verified students from your college community.",
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      icon: <SaveMoneyIcon />,
      title: "Student-Friendly Pricing",
      description: "Split costs and save up to 60% compared to rideshare apps.",
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-200",
    },
    {
      icon: <RideOptionsIcon />,
      title: "Flexible Schedules",
      description: "Find rides for daily classes or weekend trips back home.",
      color: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      icon: <LiveTrackingIcon />,
      title: "Campus Navigation",
      description: "Track rides in real-time and never be late to class again.",
      color: "bg-amber-50 text-amber-600",
      borderColor: "border-amber-200",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white via-white to-[#f7f9fa] relative overflow-hidden">
      {/* Road Graphics */}
      <div className="absolute w-full h-6 bottom-0 left-0 right-0 bg-[#e0e5e8]"></div>
      <div
        className="absolute w-full h-1 bottom-3 left-0 right-0 bg-[#f3d062]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #f3d062 50%, transparent 50%)",
          backgroundSize: "20px 100%",
        }}
      ></div>

      {/* Animated Car */}
      <motion.div
        className="absolute bottom-6 left-0"
        initial={{ x: -100 }}
        animate={{ x: "100vw" }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg
          width="60"
          height="30"
          viewBox="0 0 60 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="15" width="40" height="10" rx="5" fill="#4A5D58" />
          <rect x="15" y="5" width="20" height="15" rx="3" fill="#4A5D58" />
          <circle cx="15" cy="25" r="5" fill="#333" />
          <circle cx="15" cy="25" r="2" fill="#666" />
          <circle cx="45" cy="25" r="5" fill="#333" />
          <circle cx="45" cy="25" r="2" fill="#666" />
        </svg>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-block bg-gradient-to-r from-[#9CAFAA]/30 to-[#F5D0B5]/30 rounded-full px-6 py-2 text-[#4A5D58] font-medium text-sm mb-4 shadow-sm">
            CAMPUS COMMUTE MADE EASY
          </div>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#4A5D58] to-[#7A9994] bg-clip-text text-transparent mb-6 pb-2 leading-relaxed">
            Ride Smart, Ride Together
          </h2>
          <p className="text-lg text-[#4A5D58]/80 max-w-2xl mx-auto">
            CoRide connects college students for affordable, convenient, and
            eco-friendly transportation tailored to campus life
          </p>
        </motion.div>

        {/* Road Graphics Top */}
        <div className="relative h-6 mb-12 overflow-hidden">
          <div className="absolute w-full h-6 bg-[#e0e5e8]"></div>
          <div
            className="absolute w-full h-1 top-3 bg-[#f3d062]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #f3d062 50%, transparent 50%)",
              backgroundSize: "20px 100%",
            }}
          ></div>
        </div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl overflow-hidden"
              style={{
                borderColor: `var(--${feature.color
                  .split(" ")[1]
                  .replace("text-", "")})`,
              }}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
            >
              {/* Feature Icon */}
              <motion.div
                className={`${feature.color} p-4 rounded-lg inline-block mb-4`}
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>

              {/* Feature Content */}
              <h3 className="text-xl font-bold mb-2 text-[#4A5D58]">
                {feature.title}
              </h3>
              <p className="text-[#4A5D58]/80">{feature.description}</p>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#9CAFAA]/10 to-transparent rounded-bl-full"></div>
              <motion.div
                className="absolute -bottom-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-tl from-[#EFBC9B]/30 to-transparent"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Campus Building Illustration */}
        <div className="relative h-40 my-12">
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,200 L0,100 L100,100 L100,50 L150,50 L150,100 L200,100 L200,150 L250,150 L250,70 L300,70 L300,150 L350,150 L350,120 L400,120 L400,80 L450,80 L450,120 L500,120 L500,150 L550,150 L550,100 L600,100 L600,50 L650,50 L650,100 L700,100 L700,150 L800,150 L800,70 L850,70 L850,100 L900,100 L900,50 L950,50 L950,100 L1000,100 L1000,150 L1050,150 L1050,120 L1100,120 L1100,80 L1150,80 L1150,100 L1200,100 L1200,200 Z"
              fill="#e0e5e8"
            />
            <path
              d="M550,100 L550,50 L570,30 L590,50 L590,100 Z"
              fill="#4A5D58"
            />
            <rect x="560" y="80" width="20" height="20" fill="#9CAFAA" />
            <rect x="300" y="100" width="20" height="50" fill="#9CAFAA" />
            <rect x="330" y="100" width="20" height="50" fill="#9CAFAA" />
            <rect x="850" y="100" width="20" height="50" fill="#9CAFAA" />
            <rect x="880" y="100" width="20" height="50" fill="#9CAFAA" />
          </svg>
        </div>

        {/* Benefits List */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg border border-[#9CAFAA]/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-[#4A5D58]">
            Why College Students Love CoRide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "Verified student profiles",
              "Cashless campus payments",
              "24/7 student support",
              "Eco-friendly commuting",
              "Safety rating system",
              "Schedule for class times",
              "Late night campus rides",
              "Weekend trip planning",
              "Group rides for events",
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 bg-[#f7f9fa] p-3 rounded-lg"
                whileHover={{ scale: 1.05, backgroundColor: "#e0f5ef" }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle className="h-5 w-5 text-[#9CAFAA]" />
                <span className="text-[#4A5D58] font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call To Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.a
            href="#get-started"
            className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-[#4A5D58] to-[#7A9994] text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join Your Campus Rides
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
