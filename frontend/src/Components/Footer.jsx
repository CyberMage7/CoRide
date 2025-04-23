import React from "react";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#F5D0B5] to-[#EFBC9B] text-[#4A5D58] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-2">CoRide</h2>
            <p className="text-sm">
              Smart, sustainable ride-sharing for students. Save money, reduce
              carbon, and ride together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="/" className="hover:text-[#9CAFAA] transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#9CAFAA] transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/safety" className="hover:text-[#9CAFAA] transition">
                  Safety & Trust
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#9CAFAA] transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-md font-semibold mb-2">Features</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  href="/find-ride"
                  className="hover:text-[#9CAFAA] transition"
                >
                  Find a Ride
                </a>
              </li>
              <li>
                <a
                  href="/offer-ride"
                  className="hover:text-[#9CAFAA] transition"
                >
                  Offer a Ride
                </a>
              </li>
              <li>
                <a href="/commutes" className="hover:text-[#9CAFAA] transition">
                  Regular Commutes
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-md font-semibold mb-2">Get in Touch</h3>
            <p className="text-sm mb-1">📧 support@coride.com</p>
            <p className="text-sm">📍 Student Hub, Sector 62, India</p>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-8 border-t border-[#9CAFAA]/30 pt-4 text-center text-xs text-[#4A5D58]">
          © {new Date().getFullYear()} CoRide. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
