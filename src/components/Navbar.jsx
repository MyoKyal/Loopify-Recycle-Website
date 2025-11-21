// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.jpg";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const navItems = [
    { name: "Home", to: "/" },
    { name: "About", to: "#about" },
    { name: "Return Items", to: "/return" },
    { name: "Contact", to: "#contact" },
    { name: "Leaderboard", to: "#leaderboard" },
  ];


const navigate = useNavigate();

const handleClick = (item) => {
  setMobileMenuOpen(false);

  if (item.to.startsWith("#")) {
    // If we're not on home page, navigate first
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        const section = document.querySelector(item.to);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 400); // wait a bit for the home page to load
    } else {
      const section = document.querySelector(item.to);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  } else {
    navigate(item.to);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  }
};


  return (
    <nav className="fixed top-0 left-0 right-0 backdrop-blur-md bg-gradient-to-r from-loopifyMain via-loopifySecondary to-loopifyTertiary shadow-lg z-50 border-b border-white/20 transition-all duration-300">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ─── Logo + Title ─── */}
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full border-2 border-loopifyHighlight bg-white flex items-center justify-center overflow-hidden shadow-md hover:scale-110 transition-transform duration-300">
              <img
                src={Logo}
                alt="Loopify Logo"
                className="h-10 w-10 object-cover rounded-full"
              />
            </div>
            <span className="text-2xl font-extrabold text-white font-title tracking-wide flex items-center drop-shadow-lg">
              L
              <svg
                width="28"
                height="20"
                viewBox="0 0 100 55"
                fill="none"
                stroke="#FFD166"
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

          {/* ─── Desktop Navigation ─── */}
          <div className="hidden md:flex items-center space-x-8 font-body">
            {navItems.map((item, index) =>
              item.to.startsWith("#") ? (
                <button
                  key={index}
                  onClick={() => handleClick(item)}
                  className={`relative text-lg text-loopifyLight border-b-2 border-transparent hover:border-loopifyAccent transition-all duration-300 pb-1 ${
                    location.pathname === item.to ? "border-loopifyAccent" : ""
                  }`}
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  key={index}
                  to={item.to}
                  onClick={() => handleClick(item)}
                  className={`relative text-lg text-loopifyLight border-b-2 border-transparent hover:border-loopifyAccent transition-all duration-300 pb-1 no-underline hover:text-loopifyLight focus:text-loopifyLight active:text-loopifyLight ${
                    location.pathname === item.to ? "border-loopifyAccent" : ""
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}

            {/* ─── Login/Profile Button ─── */}
            {user ? (
              <Link
                to="/profile"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-loopifyAccent text-loopifyDark font-semibold py-2.5 px-6 rounded-full hover:bg-loopifyHighlight hover:text-loopifyDark transition transform hover:scale-105 shadow-md font-body duration-300 flex items-center justify-center"
              >
                {user.email.split('@')[0]}
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-loopifyAccent text-loopifyDark font-semibold py-2.5 px-6 rounded-full hover:bg-loopifyHighlight hover:text-loopifyDark transition transform hover:scale-105 shadow-md font-body duration-300 flex items-center justify-center"
              >
                Login
              </Link>
            )}
          </div>

          {/* ─── Mobile Menu Toggle ─── */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-loopifyLight hover:text-loopifyAccent transition"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  mobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* ─── Mobile Dropdown ─── */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-loopifyLight/95 border-t border-loopifySoft font-body animate-slideDown">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navItems.map((item, index) =>
                item.to.startsWith("#") ? (
                  <button
                    key={index}
                    onClick={() => handleClick(item)}
                    className="block w-full text-left px-4 py-3 text-lg text-loopifyDark hover:bg-loopifySoft hover:text-loopifyMain rounded-lg transition flex items-center justify-center"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={index}
                    to={item.to}
                    onClick={() => handleClick(item)}
                    className="block px-4 py-3 text-lg text-loopifyDark hover:bg-loopifySoft hover:text-loopifyMain rounded-lg transition flex items-center justify-center"
                  >
                    {item.name}
                  </Link>
                )
              )}
              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-loopifyMain hover:bg-loopifySecondary text-white font-semibold py-3 rounded-full text-lg shadow-md transition flex items-center justify-center"
                >
                  {user.email.split('@')[0]}
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full bg-loopifyMain hover:bg-loopifySecondary text-white font-semibold py-3 rounded-full text-lg shadow-md transition flex items-center justify-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
