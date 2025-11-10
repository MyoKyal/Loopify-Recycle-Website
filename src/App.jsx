// src/App.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);



  return (
    <>
      <Navbar />

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

      <Footer />
    </>
  );
}
