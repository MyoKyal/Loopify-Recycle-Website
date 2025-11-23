// src/Router.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./App.jsx"; 
import ReturnPage from "./pages/Returnpage.jsx";
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Profile from './components/Profile/Profile';
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Dashboard from "./pages/Admin/Dashboard";

export default function AppRouter() {
  return (
    <Router>
     
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/return"
          element={
            <ProtectedRoute>
              <ReturnPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    
    </Router>
  );
}
