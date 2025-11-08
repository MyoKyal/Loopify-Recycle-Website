import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import HomePage from "./pages/HomePage";
import ReturnPage from "./pages/ReturnPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LeaderboardPage from "./pages/LeaderboardPage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/return" element={<ReturnPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}