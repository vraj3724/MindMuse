import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../images/photo1.png";
import { authService } from "../services/api";
import { motion } from "framer-motion";
import LoaderOverlay from "../components/LoaderOverlay"; // ✅ add loader import

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/dashboard", { replace: true });
      }
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response =
        mode === "login"
          ? await authService.login(formData)
          : await authService.register(formData);

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("email", response.user?.email || formData.email);

        setSuccessMessage(`Welcome, ${formData.email}!`);

        setTimeout(() => {
          setIsLoading(false);
          navigate("/dashboard", { replace: true });
        }, 1500);
      } else {
        setMode("login");
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen w-full overflow-hidden relative">
      {isLoading && <LoaderOverlay />} {/* ✅ Loader */}

      {/* Left Side – Image */}
      <div
        className="hidden md:block bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      {/* Right Side – Form Card */}
      <div className="flex items-center justify-center bg-white">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl border border-[#ffd8d8] rounded-3xl p-10">
          <h2 className="text-3xl font-extrabold text-center text-[#d72638] mb-6">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>

          {error && (
            <p className="text-red-500 text-center mb-4 font-medium text-sm">
              {error}
            </p>
          )}

          {successMessage && (
            <motion.p
              className="text-green-600 text-center mb-4 font-semibold text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              ✅ {successMessage}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d72638] to-[#ff9500] text-white font-bold py-3 rounded-full shadow-lg hover:opacity-90 transition-all"
              disabled={isLoading}
            >
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-[#d72638] font-medium hover:underline text-sm"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
