import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Car, Users, DollarSign, Clock } from "lucide-react";
import heroming from "../assets/heroimg.png";
import a1 from "../assets/a1.png";
import a2 from "../assets/a2.png";
import a3 from "../assets/a3.png";
export default function Hero() {
  // This would come from your authentication context in a real app
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const tokens = localStorage.getItem('token');
    if(tokens){
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EFBC9B] to-[#F5D0B5] opacity-80"></div>
      {/* <div className="absolute inset-0 bg-[url('/path/to/pattern.png')] bg-repeat opacity-20"></div> */}

      <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-6">
            <div className="inline-block bg-[#9CAFAA]/20 rounded-full px-4 py-1 text-[#4A5D58] font-medium text-sm mb-2">
              #RideTogether
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-[#4A5D58]">
              Safe, Affordable, and Convenient Carpooling for College Students!
            </h1>
            
            <p className="text-xl text-[#4A5D58]/80">
              Choose who you travel with, share rides, and save money!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isLoggedIn ? (
                <Link
                  to="/ride"
                  className="px-8 py-3 bg-[#9CAFAA] hover:bg-[#7A9994] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  Book a Ride
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-[#9CAFAA] hover:bg-[#7A9994] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  Sign Up Now
                </Link>
              )}
              <Link
                to="/how-it-works"
                className="px-8 py-3 border border-[#9CAFAA] text-[#4A5D58] hover:bg-[#9CAFAA]/10 font-medium rounded-full transition-colors duration-300 text-center"
              >
                Learn More
              </Link>
            </div>

            {/* Feature Icons */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              <div className="flex flex-col items-center text-center p-3">
                <div className="rounded-full bg-[#9CAFAA]/20 p-3 mb-2">
                  <Car className="h-6 w-6 text-[#4A5D58]" />
                </div>
                <span className="text-sm font-medium text-[#4A5D58]">Verified Drivers</span>
              </div>
              <div className="flex flex-col items-center text-center p-3">
                <div className="rounded-full bg-[#9CAFAA]/20 p-3 mb-2">
                  <Users className="h-6 w-6 text-[#4A5D58]" />
                </div>
                <span className="text-sm font-medium text-[#4A5D58]">College Community</span>
              </div>
              <div className="flex flex-col items-center text-center p-3">
                <div className="rounded-full bg-[#9CAFAA]/20 p-3 mb-2">
                  <DollarSign className="h-6 w-6 text-[#4A5D58]" />
                </div>
                <span className="text-sm font-medium text-[#4A5D58]">Save Money</span>
              </div>
              <div className="flex flex-col items-center text-center p-3">
                <div className="rounded-full bg-[#9CAFAA]/20 p-3 mb-2">
                  <Clock className="h-6 w-6 text-[#4A5D58]" />
                </div>
                <span className="text-sm font-medium text-[#4A5D58]">Flexible Times</span>
              </div>
            </div> */}
          </div>

          {/* Hero Image */}
          <div className="hidden md:block relative">
            {/* <div className="absolute -top-10 -left-10 right-10 bottom-10 rounded-3xl bg-[#9CAFAA]/20 transform rotate-3"></div> */}
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform -rotate-2">
              <img
                src={heroming}
                alt="College students carpooling together"
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#4A5D58]/80 to-transparent p-6">
                <div className="flex items-center bg-white/90 rounded-full px-4 py-2 w-max">
                  <div className="flex -space-x-2 mr-3">
                    <img src={a1} alt="User" className="h-8 w-8 rounded-full border-2 border-white" />
                    <img src={a2} alt="User" className="h-8 w-8 rounded-full border-2 border-white" />
                    <img src={a3} alt="User" className="h-8 w-8 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-sm font-medium text-[#4A5D58]">3,000+ students already joined!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path 
            fill="#FFFFFF" 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,106.7C960,117,1056,139,1152,133.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
