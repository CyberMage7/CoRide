"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  ChevronDown,
  Home,
  Info,
  MessageCircle,
  Shield,
  X,
  Menu,
} from "lucide-react";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";
import ProfileDropdown from "./core/Auth/ProfileDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [mobileHowItWorksOpen, setMobileHowItWorksOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);

  // Helper function to create nav link classes based on active state
  const navLinkClass = (isActive) => `
    group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors 
    hover:bg-[#9CAFAA]/20 hover:text-[#4A5D58] focus:bg-[#9CAFAA]/20 focus:text-[#4A5D58] focus:outline-none
    ${isActive ? "bg-[#9CAFAA]/20 text-[#4A5D58]" : ""}
  `;

  // Helper function for mobile nav links
  const mobileNavLinkClass = (isActive) => `
    flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-[#9CAFAA]/20
    ${isActive ? "bg-[#9CAFAA]/20 text-[#4A5D58]" : ""}
  `;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-gradient-to-r from-[#EFBC9B] to-[#F5D0B5] shadow-lg">
      <div className="flex items-center gap-2">
        <img src={logo} className="h-6 w-18 text-[#9CAFAA]" />
        <h1 className="text-xl font-bold tracking-tight">CoRide</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex">
        <ul className="flex space-x-1">
          <li>
            <Link
              to="/"
              className={navLinkClass(window.location.pathname === "/")}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className={navLinkClass(window.location.pathname === "/about")}
            >
              <Info className="mr-2 h-4 w-4" />
              <span>About</span>
            </Link>
          </li>

          <li className="relative">
            <button
              className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-[#9CAFAA]/20 hover:text-[#4A5D58] focus:bg-[#9CAFAA]/20 focus:text-[#4A5D58] focus:outline-none"
              onClick={() => setHowItWorksOpen(!howItWorksOpen)}
              onBlur={() => setTimeout(() => setHowItWorksOpen(false), 100)}
            >
              <Car className="mr-2 h-4 w-4" />
              <span>How It Works</span>
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${
                  howItWorksOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {howItWorksOpen && (
              <div className="absolute left-0 top-full mt-2 w-[600px] rounded-md border border-[#9CAFAA]/20 bg-white p-4 shadow-lg">
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="row-span-3 md:col-span-1">
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[#9CAFAA]/50 to-[#9CAFAA] p-6 no-underline outline-none focus:shadow-md"
                      to="/"
                    >
                      <Car className="h-6 w-6 text-white" />
                      <div className="mb-2 mt-4 text-lg font-medium text-white">
                        Start Carpooling Today
                      </div>
                      <p className="text-sm leading-tight text-white/90">
                        Join thousands of commuters saving money and reducing
                        their carbon footprint.
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#9CAFAA]/20 focus:bg-[#9CAFAA]/20"
                      to="/find-ride"
                    >
                      <div className="text-sm font-medium leading-none">
                        Find a Ride
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                        Search for available rides in your area
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#9CAFAA]/20 focus:bg-[#9CAFAA]/20"
                      to="/offer-ride"
                    >
                      <div className="text-sm font-medium leading-none">
                        Offer a Ride
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                        Share your journey and reduce costs
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#9CAFAA]/20 focus:bg-[#9CAFAA]/20"
                      to="/commutes"
                    >
                      <div className="text-sm font-medium leading-none">
                        Regular Commutes
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                        Set up recurring rides for your daily commute
                      </p>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>

          <li className="relative">
            <button
              className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-[#9CAFAA]/20 hover:text-[#4A5D58] focus:bg-[#9CAFAA]/20 focus:text-[#4A5D58] focus:outline-none"
              onClick={() => setSafetyOpen(!safetyOpen)}
              onBlur={() => setTimeout(() => setSafetyOpen(false), 100)}
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Safety & Trust</span>
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${
                  safetyOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {safetyOpen && (
              <div className="absolute left-0 top-full mt-2 w-[400px] rounded-md border border-[#9CAFAA]/20 bg-white p-4 shadow-lg">
                <h4 className="text-md font-semibold mb-2">
                  Your Safety Matters
                </h4>
                <p className="text-sm text-gray-600">
                  CoRide ensures every ride is consent-based and verified
                  through college IDs. Riders are notified before any shared
                  match is finalized.
                </p>
              </div>
            )}
          </li>

          <li className="relative">
            <button
              className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-[#9CAFAA]/20 hover:text-[#4A5D58] focus:bg-[#9CAFAA]/20 focus:text-[#4A5D58] focus:outline-none"
              onClick={() => setContactOpen(!contactOpen)}
              onBlur={() => setTimeout(() => setContactOpen(false), 100)}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>Contact</span>
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${
                  contactOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {contactOpen && (
              <div className="absolute left-0 top-full mt-2 w-[400px] rounded-md border border-[#9CAFAA]/20 bg-white p-4 shadow-lg">
                <h4 className="text-md font-semibold mb-2">
                  We'd love to hear from you!
                </h4>
                <p className="text-sm text-gray-600">
                  Got questions or suggestions? Reach us at{" "}
                  <span className="text-[#4A5D58] font-medium">
                    support@coride.com
                  </span>
                </p>
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile Navigation Toggle */}
      <button
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent hover:bg-[#9CAFAA]/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-[300px] bg-[#EFBC9B] p-4 shadow-xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-[#9CAFAA]" />
                  <h2 className="text-lg font-semibold">Carpooling</h2>
                </div>
                <button
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#9CAFAA]/10"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </button>
              </div>
              <div className="border-t border-[#9CAFAA]/20 pt-4">
                <nav className="flex flex-col space-y-4">
                  <Link
                    to="/"
                    className={mobileNavLinkClass(
                      window.location.pathname === "/"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className={mobileNavLinkClass(
                      window.location.pathname === "/about"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    About
                  </Link>
                  <div className="flex flex-col">
                    <button
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-[#9CAFAA]/20"
                      onClick={() =>
                        setMobileHowItWorksOpen(!mobileHowItWorksOpen)
                      }
                    >
                      <div className="flex items-center">
                        <Car className="mr-2 h-4 w-4" />
                        How It Works
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          mobileHowItWorksOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileHowItWorksOpen && (
                      <div className="ml-5 mt-2 flex flex-col space-y-2">
                        <Link
                          to="/find-ride"
                          className="rounded-md px-3 py-1 text-sm hover:bg-[#9CAFAA]/20"
                          onClick={() => setIsOpen(false)}
                        >
                          Find a Ride
                        </Link>
                        <Link
                          to="/offer-ride"
                          className="rounded-md px-3 py-1 text-sm hover:bg-[#9CAFAA]/20"
                          onClick={() => setIsOpen(false)}
                        >
                          Offer a Ride
                        </Link>
                        <Link
                          to="/commutes"
                          className="rounded-md px-3 py-1 text-sm hover:bg-[#9CAFAA]/20"
                          onClick={() => setIsOpen(false)}
                        >
                          Regular Commutes
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/safety"
                    className={mobileNavLinkClass(
                      window.location.pathname === "/safety"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Safety & Trust
                  </Link>
                  <Link
                    to="/contact"
                    className={mobileNavLinkClass(
                      window.location.pathname === "/contact"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up / Login Button */}
      <div className="hidden md:flex items-center gap-4">
        {token === null ? (
          <Link
            to="/login"
            className="flex items-center justify-center px-4 py-2 rounded bg-[#9CAFAA] hover:bg-[#7A9994] text-white shadow-md transition-all duration-300 hover:shadow-lg"
          >
            Sign Up / Login
          </Link>
        ) : (
          <ProfileDropdown />
        )}
      </div>
    </nav>
  );
}
