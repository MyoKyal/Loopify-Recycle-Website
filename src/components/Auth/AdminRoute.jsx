import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AdminRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(null); // null = still checking

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return setIsAdmin(false);

      const q = query(
        collection(db, "admins"),
        where("email", "==", user.email)
      );

      const snap = await getDocs(q);
      setIsAdmin(!snap.empty); // true if admin, false if not
    };

    checkAdmin();
  }, [user]);

  // Firebase auth still loading
  if (loading) return <div>Loading...</div>;

  // Admin check still running
  if (isAdmin === null) return <div>Checking permissions...</div>;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but not admin
  if (isAdmin === false) return <Navigate to="/" replace />;

  // Admin verified
  return children;
}
