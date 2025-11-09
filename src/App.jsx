// src/App.jsx
import React, { useState, useEffect } from "react";
import Logo from "./assets/Logo.jpg";

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
                {/* <svg
                  className="w-6 h-8 mx-0.5 inline-block align-middle"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12c2-3 6-3 8 0s6 3 8 0" />
                  <path d="M5 12c2 3 6 3 8 0s6-3 8 0" />
                </svg> */}
                <svg width="28" height="20" viewBox="0 0 100 55" fill="none" stroke="white" stroke-width="8" class= "align-middle relative top-[2px]">
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
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="absolute bottom-20 left-10 max-w-3xl text-white">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-5 drop-shadow-2xl font-title">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 drop-shadow-lg font-quote italic">
                {slide.text}
              </p>
              <a
                href="/public/return"
                className="inline-flex items-center bg-loopifyMain hover:bg-loopifySecondary text-white font-semibold text-lg px-8 py-3 rounded-full transition transform hover:scale-105 shadow-lg font-body"
              >
                Start a Return
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === current ? "bg-white scale-110" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="text-center bg-loopifyLight py-20">
        <h2 className="font-title text-5xl font-bold text-loopifyMain mb-4">Sustainability in Motion</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-loopifyDark">
          At Loopify, we believe every cycle counts. From waste reduction to resource regeneration — we help communities close the loop for a greener tomorrow.
        </p>
        <button className="bg-loopifyMain text-white px-8 py-3 rounded-full font-semibold hover:bg-loopifySecondary transition transform hover:scale-105 shadow-lg font-body">
          Join Us 
        </button>
      </section>

      {/* 3-STEP FLOW */}
      <section className="py-24 bg-loopifySoft font-body">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-loopifyDark font-title">
            Return in <span className="text-loopifyMain">3 simple steps</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              { num: "1", title: "Drop or Ship", desc: "Find a nearby collection box or print a free label." },
              { num: "2", title: "We Sort & Test", desc: "Items go to our zero-waste hub for diagnostics." },
              { num: "3", title: "Get Rewarded", desc: "Instant store credit or cash." },
            ].map((step) => (
              <div key={step.num} className="text-center group">
                <div className="mx-auto w-20 h-20 bg-loopifyMain text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 group-hover:scale-110 transition transform shadow-md font-title">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-loopifyDark font-title">{step.title}</h3>
                <p className="text-loopifyMuted text-base font-body">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href="/public/return"
              className="inline-block px-10 py-4 bg-loopifyMain hover:bg-loopifySecondary text-white font-semibold text-lg rounded-full transition transform hover:scale-105 shadow-lg font-body"
            >
              Start Your Return Now
            </a>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE LOOPIFY */}
      <section className="py-20 bg-loopifyLight text-center">
        <h2 className="font-title text-4xl font-bold text-loopifyMain mb-12">Why Choose Loopify?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
          <div className="p-6 bg-loopifySecondary rounded-xl shadow">
            <h3 className="font-title text-xl mb-2">🌍 Eco-Driven</h3>
            <p className="text-loopifyDark">We prioritize planet-first strategies for a truly sustainable impact.</p>
          </div>
          <div className="p-6 bg-loopifySecondary rounded-xl shadow">
            <h3 className="font-title text-xl mb-2">⚙️ Tech-Enabled</h3>
            <p className="text-loopifyDark">Our smart solutions harness data to drive circular economy systems.</p>
          </div>
          <div className="p-6 bg-loopifySecondary rounded-xl shadow">
            <h3 className="font-title text-xl mb-2">🤝 Community-Centered</h3>
            <p className="text-loopifyDark">We empower local communities to take ownership of their sustainability efforts.</p>
          </div>
        </div>
      </section>

      {/* JOIN THE MOVEMENT */}
      <section className="py-24 bg-gradient-to-r from-loopifyMain to-loopifySecondary text-center">
        <h2 className="font-title text-4xl font-bold mb-4 text-white">Join the Movement</h2>
        <p className="max-w-2xl mx-auto mb-8 text-white">
          Be part of the sustainable revolution. Together, we can build a cleaner, greener, and smarter world — one loop at a time.
        </p>
        <button className="bg-white text-loopifyMain px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg font-body">
          Get Started
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-loopifyDark text-loopifyMuted py-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-title text-2xl text-white mb-3">Loopify</h3>
            <p className="text-sm text-white">Closing the loop for a sustainable future.</p>
          </div>
          <div>
            <h4 className="font-title text-lg text-white mb-2">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-loopifyMain">About</a></li>
              <li><a href="#" className="hover:text-loopifyMain">Projects</a></li>
              <li><a href="#" className="hover:text-loopifyMain">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-title text-lg text-white mb-2">Follow Us</h4>
            <p className="text-sm text-white">Instagram • Twitter • LinkedIn</p>
          </div>
        </div>
        <p className="text-center text-sm mt-10 border-t border-loopifyMuted pt-4">© 2025 Loopify. All Rights Reserved.</p>
      </footer>
    </>
  );
}
