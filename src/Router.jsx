// src/Router.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./App.jsx"; // ✅ your homepage
import ReturnPage from "./pages/Returnpage.jsx";
import Footer from "./components/Footer";

export default function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/return" element={<ReturnPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}
