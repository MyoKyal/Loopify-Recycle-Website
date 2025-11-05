// src/App.jsx
import React from "react";

export default function App() {
  return (
    <div className="bg-light text-gray-900 min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Give your products a second life.
            </h1>
            <p className="mt-6 text-lg md:text-xl opacity-90">
              Return electronics, clothing, or packaging at any of our 2,000+ collection points.  
              Earn store credit, cash, or carbon-offset rewards.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="/public/return" className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent/90 text-primary font-semibold rounded-lg transition">
                Start a Return
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 3-Step Flow */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Return in <span className="text-accent">3 simple steps</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Drop or Ship</h3>
              <p className="text-gray-600">Find a nearby collection box or print a free label.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">We Sort & Test</h3>
              <p className="text-gray-600">Items go to our zero-waste hub for diagnostics.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Get Rewarded</h3>
              <p className="text-gray-600">Instant store credit or cash.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href="/public/return" className="inline-block px-10 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition">
              Start Your Return Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}