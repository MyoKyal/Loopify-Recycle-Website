// src/App.jsx
import React, { useState, useEffect } from "react";
import Logo from "./assets/Logo.jpg";
import LogoAndName from "./assets/LogoAndName.jpg";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.1.0&auto=format&fit=crop&q=80",
    title: "Return Your Old Devices",
    text: "Earn rewards and help the planet",
  },
  {
    src: "https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg",
    title: "Give Clothes a Second Life",
    text: "Donate or recycle with Loopify",
  },
  {
    src: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.1.0&auto=format&fit=crop&q=80",
    title: "Zero-Waste Packaging",
    text: "Return and get rewarded",
  },
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navItems = ["Home", "About", "Contact", "Leaderboard"];

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-2xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Name */}
            <div className="flex items-center">
              <img
                src={Logo}
                alt="Loopify"
                className="h-12 w-12 rounded-full border-4 border-green-600 shadow-lg"
              />
              <img
                src={LogoAndName}
                alt="Loopify"
                className="h-10 ml-3 hidden sm:block"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-lg font-semibold text-gray-700 hover:text-green-600 transition"
                >
                  {item}
                </a>
              ))}
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-full transition transform hover:scale-110 shadow-xl">
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-green-600"
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
            <div className="md:hidden bg-white border-t-2 border-green-100">
              <div className="px-4 pt-4 pb-6 space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block px-4 py-3 text-xl font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-full text-xl shadow-xl">
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO CAROUSEL */}
      <div className="relative h-screen mt-16 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-20 left-10 max-w-4xl text-white">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl">
                {slide.title}
              </h1>
              <p className="text-2xl md:text-4xl mb-10 drop-shadow-lg font-medium">
                {slide.text}
              </p>
              <a
                href="/public/return"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold text-2xl px-12 py-6 rounded-full transition transform hover:scale-110 shadow-2xl"
              >
                Start a Return
                <svg className="ml-4 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ))}

        {/* Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                i === current ? "bg-white w-12" : "bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3-STEP FLOW */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 text-gray-800">
            Return in <span className="text-green-600">3 simple steps</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto">
            {[
              { num: "1", title: "Drop or Ship", desc: "Find a nearby collection box or print a free label." },
              { num: "2", title: "We Sort & Test", desc: "Items go to our zero-waste hub for diagnostics." },
              { num: "3", title: "Get Rewarded", desc: "Instant store credit or cash." },
            ].map((step) => (
              <div key={step.num} className="text-center group transform hover:-translate-y-4 transition duration-300">
                <div className="mx-auto w-28 h-28 bg-green-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mb-8 shadow-2xl group-hover:shadow-green-500/50">
                  {step.num}
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 text-xl leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-20">
            <a
              href="/public/return"
              className="inline-block px-16 py-6 bg-green-600 hover:bg-green-700 text-white font-bold text-2xl rounded-full transition transform hover:scale-110 shadow-2xl"
            >
              Start Your Return Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}