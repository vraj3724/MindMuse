import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#d72638] to-[#ff9500] shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          MindMuse
        </h1>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-white hover:text-yellow-100 font-semibold transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white text-[#d72638] font-semibold px-5 py-2 rounded-full shadow hover:bg-yellow-50 transition"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-white text-[#d72638] px-5 py-2 rounded-full font-semibold shadow hover:bg-yellow-50 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
