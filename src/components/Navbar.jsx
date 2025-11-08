// src/components/Navbar.jsx
import React, { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-xl fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.jpg"
              alt="Loopify"
              className="h-12 w-12 rounded-full border-2 border-green-500"
            />
            <span className="ml-3 text-3xl font-bold text-green-600">Loopify</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "About", "Contact", "Leaderboard"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-lg font-medium text-gray-700 hover:text-green-600 transition duration-200"
              >
                {item}
              </a>
            ))}
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105">
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {["Home", "About", "Contact", "Leaderboard"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-3 py-2 text-lg font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md"
                >
                  {item}
                </a>
              ))}
              <button className="w-full text-left bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-md mt-4">
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}