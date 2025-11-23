import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
      });
      setSuccess('Account created successfully!');
      setError('');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-loopifyLight to-white px-4 font-body">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 space-y-6">

          <h2 className="text-center text-3xl font-bold text-loopifyDark font-title">
            Create Account
          </h2>
          <p className="text-center text-loopifyMuted text-sm">
            Join Loopify today
          </p>

          <form className="space-y-5" onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-loopifyMuted focus:ring-2 focus:ring-loopifyMain outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-loopifyMuted focus:ring-2 focus:ring-loopifyMain outline-none"
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-loopifyMuted focus:ring-2 focus:ring-loopifyMain outline-none"
            />

            <button
              type="submit"
              className="w-full py-3 text-white bg-loopifyMain rounded-lg hover:bg-loopifySecondary transition"
            >
              Sign Up
            </button>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}
          </form>

        </div>
      </div>
    );

};

export default Signup;
