import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JournalEntry from "../components/JournalEntry";
import EntryList from "../components/EntryList";
import InteractiveSession from "../components/InteractiveSession";
import Sidebar from "../components/Sidebar";
import { entryService } from "../services/api";
import { motion } from "framer-motion";
import sampleImg1 from "../images/sample1.jpg";
import sampleImg2 from "../images/sample2.jpg";

function Dashboard() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotification({
        open: true,
        message: "Please login to continue",
        severity: "error",
      });
      navigate("/auth");
      return;
    }
    fetchEntries();
  }, [navigate]);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleAuthError = () => {
    localStorage.removeItem("token");
    setNotification({
      open: true,
      message: "Session expired. Please login again.",
      severity: "error",
    });
    navigate("/auth");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/auth", { replace: true });
  };

  const fetchEntries = async () => {
    try {
      const response = await entryService.getAll();
      setEntries(response);
      console.log("📒 All fetched entries:", response);
    } catch (error) {
      console.error("Fetch entries error:", error);
      if (error.response?.status === 401) {
        handleAuthError();
      } else {
        setNotification({
          open: true,
          message: "Failed to fetch entries",
          severity: "error",
        });
      }
    }
  };

  const handleSaveEntry = async (entryData) => {
    console.log("🚀 Saving entry with data:", entryData);
    
    try {
      const response = await entryService.create(entryData);
      if (response && response.entry) {
        setNotification({
          open: true,
          message: "Entry saved successfully!",
          severity: "success",
        });
        fetchEntries();
        return response;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      if (error.response?.status === 401) {
        handleAuthError();
      } else {
        setNotification({
          open: true,
          message: error.message || "Failed to save entry. Please try again.",
          severity: "error",
        });
      }
      throw error;
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar setSelectedScreen={setSelectedScreen} onLogout={handleLogout} />

      <motion.div
        className="flex-1 overflow-y-auto p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {!selectedScreen && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-[#d72638] mb-4">
              Welcome back, {localStorage.getItem("email")}!
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Your journey to self-awareness begins here. Dive into your mental wellness with daily reflections, emotional tracking, and AI-powered insights.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
                <img src={sampleImg1} alt="Insight 1" className="rounded-xl mb-4 w-full object-cover h-48" />
                <h3 className="text-xl font-semibold text-[#ff9500] mb-2">Track Daily Moods</h3>
                <p className="text-gray-600">Monitor how you feel each day and discover emotional patterns through beautiful visualizations.</p>
              </div>
              <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
                <img src={sampleImg2} alt="Insight 2" className="rounded-xl mb-4 w-full object-cover h-48" />
                <h3 className="text-xl font-semibold text-[#ff9500] mb-2">AI-Generated Reflections</h3>
                <p className="text-gray-600">Receive personalized feedback and encouragement powered by AI to support your growth and wellbeing.</p>
              </div>
            </div>
          </div>
        )}

        {selectedScreen === "entry" && (
          <motion.div
            className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold text-[#d72638] mb-4">
              New Journal Entry
            </h2>
            <JournalEntry onSave={handleSaveEntry} isLoading={loading} />
          </motion.div>
        )}

        {selectedScreen === "interactive" && (
          <motion.div
            className="mt-0 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold text-[#d72638] mb-4">
              Interactive Session
            </h2>
            <InteractiveSession />
          </motion.div>
        )}

        {selectedScreen === "entries" && (
          <motion.div
            className="bg-white border border-gray-200 p-8 rounded-2xl shadow-xl mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-semibold text-[#d72638] mb-4">
              Your Entries
            </h2>

    {entries.length === 0 ? (
      <p className="text-gray-500 text-sm">
        You have no entries yet. Try writing your first one!
      </p>
    ) : (
      <EntryList
        entries={entries}
        onEdit={() => {}}
        onDelete={() => {}}
        onView={() => {}}
      />
    )}
  </motion.div>
)}
      </motion.div>


      {notification.open && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={`px-6 py-4 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 ${
              notification.severity === "success"
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : "bg-gradient-to-r from-red-500 to-orange-500"
            }`}
          >
            {notification.message}
            <button
              className="ml-4 underline text-sm"
              onClick={handleCloseNotification}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
