import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-loopifyLight text-loopifyDark font-body">
      {/* Top Navbar */}
      <header className="w-full bg-loopifyMain text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-title">Admin Dashboard</h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-loopifySecondary text-white rounded-md hover:bg-loopifyDark transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-6xl mx-auto px-4 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-loopifyMuted mt-2">Manage all users who signed up</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-semibold">Leaderboard</h2>
          <p className="text-loopifyMuted mt-2">View & update ranking scores</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
          <h2 className="text-xl font-semibold">Settings</h2>
          <p className="text-loopifyMuted mt-2">Control admin configurations</p>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
