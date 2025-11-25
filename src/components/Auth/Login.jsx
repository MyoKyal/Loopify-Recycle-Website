// src/components/Auth/Login.jsx

import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkAdmin = async (userEmail) => {
    console.log("Checking admin for:", userEmail);
    const q = query(collection(db, 'admins'), where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);

    console.log("Admin found?", !querySnapshot.empty);
    return !querySnapshot.empty;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const isAdmin = await checkAdmin(user.email);
      navigate(isAdmin ? '/dashboard' : '/');
    } catch (err) {
      setError(err.message);
    }
  };

  

  const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // --- NEW PART — SAVE USER TO FIRESTORE IF NOT EXISTS ---
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        username: user.displayName,   // <-- auto username
        photoURL: user.photoURL,      // <-- google profile photo
        createdAt: new Date(),
      });
    }

    // check admin
    const isAdmin = await checkAdmin(user.email);
    navigate(isAdmin ? "/dashboard" : "/");
  } catch (err) {
    setError(err.message);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-loopifyLight to-white px-4 font-body">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 space-y-6">

        <h2 className="text-center text-3xl font-bold text-loopifyDark font-title">
          Welcome Back
        </h2>
        <p className="text-center text-loopifyMuted text-sm">
          Sign in to continue
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-loopifyMuted focus:ring-2 focus:ring-loopifyMain outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-loopifyMuted focus:ring-2 focus:ring-loopifyMain outline-none"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-loopifyDark">
              <input type="checkbox" className="h-4 w-4" />
              Remember me
            </label>
            <a className="text-loopifyMain hover:text-loopifySecondary cursor-pointer">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-loopifyMain rounded-lg hover:bg-loopifySecondary transition"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-loopifyMuted">
            Don’t have an account?{' '}
            <Link className="text-loopifyMain hover:text-loopifySecondary" to="/signup">
              Create one
            </Link>
          </p>

          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>

        <div className="text-center relative">
          <div className="border-t border-loopifyMuted"></div>
          <span className="px-3 bg-white text-loopifyMuted absolute -top-3 left-1/2 -translate-x-1/2">
            or
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 border border-loopifyMuted rounded-lg hover:bg-loopifySoft transition"
        >
          Sign in with Google
        </button>

      </div>
    </div>
  );
};

export default Login;
