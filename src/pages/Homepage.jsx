// src/pages/home.jsx

import React from "react";
import Carousel from "../components/carousel";

export default function HomePage() {
  return (
    <>
      <Carousel />
      <section className="bg-gradient-to-br from-[#1C5C3F] to-[#1C5C3FE6] text-white py-24">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold">Give your products a second life.</h1>
          <p className="mt-6 text-lg md:text-xl opacity-90">
            Return electronics, clothing, or packaging at any of our 2,000+ collection points.
          </p>
          <a href="#/return" className="mt-8 inline-block bg-[#AAFF8B] text-[#1C5C3F] px-8 py-4 rounded-xl font-semibold hover:scale-105 transition">
            Start a Return →
          </a>
        </div>
      </section>

      {/* 3-step flow */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Return in <span className="text-[#AAFF8B]">3 simple steps</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              ["Drop or Ship", "Find a nearby collection box or print a free label."],
              ["We Sort & Test", "Items go to our zero-waste hub for diagnostics."],
              ["Get Rewarded", "Instant store credit or cash."]
            ].map(([title, text], i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1C5C3F] text-white flex items-center justify-center text-2xl font-bold">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}