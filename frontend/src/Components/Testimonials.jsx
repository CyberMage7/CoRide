import React, { useState, useEffect } from 'react';
import a1 from "../assets/a1.png";
import a2 from "../assets/a2.png";
import a3 from "../assets/a3.png";

const UniqueTestimonialsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Sample testimonial data with Indian student names from various Noida universities
  const testimonials = [
    {
      quote: "CoRide has transformed my campus commute! As an environmental science student, I'm proud to reduce my carbon footprint while enjoying comfortable rides.",
      name: "Aryan Malhotra",
      university: "Amity University, Noida",
      bgColor: "bg-blue-600",
      stars : "⭐⭐⭐⭐⭐",
      image: a1,
    },
    {
      quote: "The CoRide app is so intuitive and booking rides to early morning lectures has never been easier. I'm saving time and helping the planet!",
      name: "Diya Sharma",
      university: "Sharda University, Greater Noida",
      bgColor: "bg-indigo-700",
      stars : "⭐⭐⭐⭐",
      image: a2,
    },
    {
      quote: "Since our hostel is off-campus, my friends and I share CoRide rides daily. It's affordable, reliable, and we love contributing to a greener future.",
      name: "Kabir Singh",
      university: "Bennett University, Greater Noida",
      bgColor: "bg-purple-700",
      stars : "⭐⭐⭐⭐",
      image: a3,
    },
    {
      quote: "As the sustainability club president, I recommended CoRide to all members. Now our entire department prefers it for daily commutes!",
      name: "Ishita Patel",
      university: "Jaypee Institute of Information Technology, Noida",
      bgColor: "bg-teal-600",
      stars : "⭐⭐⭐⭐⭐",
      image: a2,
    },
    {
      quote: "I can study during my CoRide rides, and the quiet electric vehicles provide the perfect environment for last-minute exam prep!",
      name: "Vivek Kapoor",
      university: "Galgotias University, Greater Noida",
      bgColor: "bg-green-600",
      stars : "⭐⭐⭐⭐⭐",
      image: a1,
    }
  ];

  // Auto scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 4000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Handlers for manual navigation
  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Voices of Our Community</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Students across Noida are choosing sustainable transportation for their daily commute</p>
        </div>
        
        <div className="relative h-96 md:h-80">
          {/* Cards */}
          <div className="relative h-full">
            {testimonials.map((testimonial, index) => {
              // Calculate the position and z-index for each card
              const isActive = index === activeIndex;
              const isPrev = index === (activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1);
              const isNext = index === (activeIndex === testimonials.length - 1 ? 0 : activeIndex + 1);
              const isHidden = !isActive && !isPrev && !isNext;
              
              let position = "opacity-0 translate-x-0";
              let zIndex = 0;
              
              if (isActive) {
                position = "opacity-100 translate-x-0 scale-100";
                zIndex = 30;
              } else if (isPrev) {
                position = "opacity-60 -translate-x-16 md:-translate-x-32 scale-95";
                zIndex = 20;
              } else if (isNext) {
                position = "opacity-60 translate-x-16 md:translate-x-32 scale-95";
                zIndex = 20;
              }
              
              return (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${position}`}
                  style={{ zIndex }}
                >
                  <div className={`h-full w-full flex flex-col md:flex-row rounded-2xl shadow-xl overflow-hidden ${isHidden ? 'pointer-events-none' : ''}`}>
                    <div className={`${testimonial.bgColor} w-full md:w-2/5 flex flex-col justify-center items-center p-8 text-white`}>
                      <div className="rounded-full border-4 border-white h-24 w-24 flex items-center justify-center mb-6">
                        <img src={testimonial.image} alt="" />
                      </div>
                      <h3 className="text-xl font-bold">{testimonial.name}</h3>
                      <p className="text-white text-opacity-80 text-center">{testimonial.university}</p>
                    </div>
                    <div className="bg-white w-full md:w-3/5 p-8 flex flex-col justify-center">
                      <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
                      <div className="mt-auto flex items-center">
                        {testimonial.stars}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-40 focus:outline-none hover:bg-gray-100 transition-colors"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-40 focus:outline-none hover:bg-gray-100 transition-colors"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Dots indicator */}
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 mx-1 rounded-full focus:outline-none transition-all duration-300 ${
                index === activeIndex ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniqueTestimonialsCarousel;