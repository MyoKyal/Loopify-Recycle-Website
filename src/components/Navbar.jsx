// src/components/Navbar.jsx
import React, { useState } from "react";
import Logo from "../assets/Logo.jpg";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = ["Home", "About", "Contact", "Leaderboard"];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-loopifyMain via-loopifySecondary to-loopifySecondary shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full border-2 border-white bg-white flex items-center justify-center overflow-hidden shadow-md">
              <img
                src={Logo}
                alt="Loopify Logo"
                className="h-10 w-10 object-cover rounded-full"
              />
            </div>
            <span className="text-2xl font-extrabold text-white font-title tracking-wide flex items-center">
              L
              <svg
                width="28"
                height="20"
                viewBox="0 0 100 55"
                fill="none"
                stroke="white"
                strokeWidth="8"
                className="align-middle relative top-[2px]"
              >
                <path
                  d="M10,25 
                    C10,5 40,5 50,25 
                    C60,45 90,45 90,25 
                    C90,5 60,5 50,25 
                    C40,45 10,45 10,25Z"
                />
              </svg>
              pify
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-lg font-body text-white hover:text-loopifyAccent transition"
              >
                {item}
              </a>
            ))}
            <button className="bg-white text-loopifyMain font-semibold py-2.5 px-6 rounded-full hover:bg-loopifyAccent transition transform hover:scale-105 shadow-md font-body">
              Login
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-loopifyAccent transition"
          >
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-loopifyLight border-t border-loopifySecondary">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-4 py-3 text-lg font-medium text-loopifyMuted hover:text-loopifyMain hover:bg-loopifySoft rounded-lg font-body"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="w-full bg-loopifyMain hover:bg-loopifySecondary text-white font-semibold py-3 rounded-full text-lg shadow-md transition font-body">
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
