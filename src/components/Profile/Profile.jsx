// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "/src/assets/defaultAvatar2.png";

export default function Profile() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Profile states
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [returnItems, setReturnItems] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch user profile from Firestore
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();

        setName(data.name || user.displayName || "");
        setPhoto(data.photoURL || user.photoURL || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
      } else {
        // fallback → for new google users
        setName(user.displayName || "");
        setPhoto(user.photoURL || "");
      }

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  // Fetch user's returned items with real-time updates
  useEffect(() => {
    if (!user) return;

    const returnsQuery = query(
      collection(db, "returns"),
      where("userId", "==", user.uid),
      orderBy("returnDate", "desc")
    );

    const unsubscribe = onSnapshot(returnsQuery, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setReturnItems(items);
    });

    return () => unsubscribe();
  }, [user]);

  // Save profile changes
  const handleSave = async () => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      name,
      phone,
      address,
      photoURL: photo || user.photoURL || "",
    });

    alert("Profile updated successfully!");
  };

  const handleLogout = async () => {
    try {
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <div className="p-10 text-center text-xl">
        Please Login first.
      </div>
    );
  }

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-loopifyLight text-loopifyDark">
      <div className="max-w-xl mx-auto p-6">

        <h1 className="text-3xl font-title font-bold mb-6">My Profile</h1>

        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <img
            src={defaultAvatar}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-loopifyMain shadow-md object-cover"
          />
        </div>

        {/* FORM */}
        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="font-semibold">Name</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="font-semibold">Email</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md bg-gray-100"
              value={user.email}
              readOnly
            />
          </div>

          {/* Phone */}
          <div>
            <label className="font-semibold">Phone</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Address */}
          <div>
            <label className="font-semibold">Address</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-loopifyMain text-white rounded-md hover:bg-loopifyDark"
          >
            Save Changes
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-loopifySecondary text-white rounded-md hover:bg-loopifyDark"
          >
            Return Home
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-loopifySecondary text-white rounded-md hover:bg-loopifyDark"
          >
            Logout
          </button>
        </div>

        {/* Returned Items Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Returned Items</h2>
          {returnItems.length === 0 ? (
            <p>No return items found.</p>
          ) : (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-loopifyMain text-white">
                  <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Condition</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Return Date</th>
                </tr>
              </thead>
              <tbody>
                {returnItems.map((item) => (
                  <tr key={item.id} className="even:bg-loopifyLight/50 odd:bg-loopifyLight/30">
                    <td className="border border-gray-300 px-4 py-2">{item.itemName}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.condition}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.returnDate?.toDate
                        ? item.returnDate.toDate().toLocaleDateString()
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
