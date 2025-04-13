import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Us – CoRide 🚗🎓
          </h1>
          <p className="text-xl text-gray-600">
            Welcome to CoRide, your go-to ride-sharing solution made by students, for students.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <p className="text-gray-700 mb-6">
            At CoRide, we understand the daily struggle of commuting as a college student. Whether it's the high cost of individual rides or the inconvenience of unreliable transport, we've been there — and that's exactly why we built this platform.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-8">
            To make student travel smarter, safer, and more affordable by connecting students heading to the same destinations through real-time ride-sharing with mutual consent.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Offer</h2>
          <p className="text-gray-700 mb-4">
            CoRide is not just another ride-booking app — it's a community-driven mobility platform focused on:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
            <li>Private and Shared Rides tailored for college routes.</li>
            <li>Smart Fare Splitting based on distance, so you only pay your share.</li>
            <li>Pre-Booking with Flexibility, giving you control over your schedule.</li>
            <li>Real-Time Notifications to keep you informed about your ride status.</li>
            <li>Mutual Consent System that ensures you're always comfortable with who you're riding with.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why CoRide?</h2>
          <p className="text-gray-700 mb-4">
            Because student life is hectic enough — we believe your commute shouldn't be.
          </p>
          <p className="text-gray-700 mb-8">
            We aim to reduce transportation costs, build trust among students, and even help reduce the carbon footprint by encouraging ride-sharing.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-700">
            To expand CoRide to campuses across the country, enabling eco-friendly, cost-effective, and student-centered travel — starting with your campus.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 