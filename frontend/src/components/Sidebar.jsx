import React from "react";
import { FiLogOut } from "react-icons/fi";
import { Link } from 'react-router-dom';

export default function Sidebar({ setSelectedScreen, onLogout }) {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-[#d72638] to-[#ff9500] text-white shadow-xl p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-extrabold mb-10 tracking-tight">
          MindMuse
        </h2>
        <nav className="flex flex-col gap-6">
          <button
            onClick={() => setSelectedScreen("entry")}
            className="text-white hover:text-yellow-100 font-medium text-left transition"
          >
            📝 New Entry
          </button>
          <button
            onClick={() => setSelectedScreen("interactive")}
            className="text-white hover:text-yellow-100 font-medium text-left transition"
          >
            💬 Interactive Session
          </button>
          <button
            onClick={() => setSelectedScreen("entries")}
            className="text-white hover:text-yellow-100 font-medium text-left transition"
          >
            📚 View Entries
          </button>

          <Link
            to="/mood-trend"
            className="text-white hover:text-yellow-100 font-medium text-left transition"
          >
            📈 Mood Trend
          </Link>

        </nav>
      </div>

      <div className="flex flex-col gap-6">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-white hover:text-yellow-100 font-medium transition"
        >
          <FiLogOut />
          Logout
        </button>
        <p className="text-sm text-white/70">© 2025 MindMuse</p>
      </div>
    </div>
  );
}
