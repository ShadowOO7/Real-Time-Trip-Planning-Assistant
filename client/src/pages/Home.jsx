import React from 'react';
import { Link } from 'react-router-dom';
import Slideshow from '../components/Slideshow';

export default function Home() {
  const images = [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80", // mountains
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80", // sea/river
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80", // hills/forest
    "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=2000&q=80", // city
  ];
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="flex flex-col md:flex-row items-center gap-12 px-8 max-w-7xl w-full">
        {/* Left: slideshow */}
        <div className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0">
          <Slideshow images={images} interval={3000} />
        </div>

        {/* Right: text + buttons */}
        <div className="w-full md:w-1/2 lg:w-2/3 flex-grow text-center md:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
            Plan trips together in <span className="text-blue-600">real-time</span>
          </h1>
          <p className="text-lg lg:text-xl mb-10 text-gray-600 max-w-2xl mx-auto md:mx-0">
            Collaborative itineraries, live chat, proposals, suggestions & more.
          </p>

          <div className="flex gap-6 justify-center md:justify-start">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
