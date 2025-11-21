// src/components/Auth/Login.jsx

import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkAdmin = async (userEmail) => {
    const q = query(collection(db, 'admins'), where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const isAdmin = await checkAdmin(user.email);
      navigate(isAdmin ? '/dashboard' : '/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isAdmin = await checkAdmin(user.email);
      navigate(isAdmin ? '/dashboard' : '/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-loopifyLight py-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-loopifyDark font-title">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-loopifyMuted placeholder-loopifyMuted text-loopifyDark rounded-t-md focus:outline-none focus:ring-loopifyMain focus:border-loopifyMain focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-loopifyMuted placeholder-loopifyMuted text-loopifyDark rounded-b-md focus:outline-none focus:ring-loopifyMain focus:border-loopifyMain focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-loopifyMain focus:ring-loopifyMain border-loopifyMuted rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-loopifyDark">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-loopifyMain hover:text-loopifySecondary">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-loopifyMain hover:bg-loopifySecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-loopifyMain"
            >
              Sign in
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-loopifyMuted">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-loopifyMain hover:text-loopifySecondary">
                Sign up
              </Link>
            </p>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-loopifyMuted" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-loopifyLight text-loopifyMuted">Or</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="group relative w-full flex justify-center py-2 px-4 border border-loopifyMuted text-sm font-medium rounded-md text-loopifyDark bg-white hover:bg-loopifySoft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-loopifyMain"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
