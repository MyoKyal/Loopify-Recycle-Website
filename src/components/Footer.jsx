// src/components/Footer.jsx
import React from "react";
import Logo from "../assets/Logo.jpg";

export default function Footer() {
  return (
    <footer className="bg-loopifyDark text-loopifyMuted py-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
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
          <p className="text-sm text-white pt-2">Closing the loop for a sustainable future.</p>
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
      
      <div className="text-center items-center h-3 border-t border-loopifyMuted mt-4">
          <p className="text-ms text-loopifyMuted pt-2">
            © 2025 Loopify. All Rights Reserved.
          </p>
        </div>
    </footer>
  );
}
