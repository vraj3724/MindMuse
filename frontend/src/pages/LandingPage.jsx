import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPenNib, FaSmile, FaRobot, FaTwitter, FaGithub, FaHeart } from "react-icons/fa";
import Navbar from "../components/Navbar";
import bgImage from "../images/photo1.png";
import LoaderOverlay from "../components/LoaderOverlay";

export default function LandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/auth");
    }, 1200);
  };

  const howItWorks = [
    { icon: <FaPenNib size={24} />, label: "Write Daily" },
    { icon: <FaSmile size={24} />, label: "Track Mood" },
    { icon: <FaRobot size={24} />, label: "AI Insights" },
  ];

  return (
    <div className="w-full overflow-x-hidden text-[#381e1f] relative">
      {loading && <LoaderOverlay />}
      <Navbar />

      {/* Section 1: Hero */}
      <div className="flex flex-col md:flex-row items-center h-screen w-full bg-gradient-to-r from-[#fff7f0] via-white to-[#fff2e5]">
        <motion.div
          className="flex flex-col justify-center items-start px-12 md:w-1/2"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#d72638] mb-6 leading-tight">
            Welcome to <span className="text-[#ff9500]">MindMuse</span>
          </h1>
          <p className="text-lg mb-8">
            Your AI-powered journal to track mood, understand your emotions, and grow every day.
          </p>
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-[#d72638] to-[#ff9500] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition transform"
          >
            Get Started
          </button>
        </motion.div>
        <motion.div
          className="md:w-1/2 h-full flex justify-center items-center"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={bgImage}
            alt="MindMuse Visual"
            className="object-cover w-full h-full rounded-l-[3rem] shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Section 2: How It Works */}
      <div className="py-20 px-6 md:px-20 bg-white text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-10 text-[#512843]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          How MindMuse Works
        </motion.h2>
        <div className="flex flex-col md:flex-row items-center justify-around gap-10">
          {howItWorks.map((item, i) => (
            <motion.div
              key={i}
              className="bg-[#fef7fa] border border-[#fce2e7] rounded-xl p-6 shadow-md w-full md:w-1/4 hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3 }}
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white bg-gradient-to-r from-[#d72638] to-[#ff9500]">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold">{item.label}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section 3: Features */}
      <div className="py-20 px-6 md:px-20 bg-gradient-to-br from-[#fff7f0] to-[#ffffff] text-center border-t border-gray-100">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-10 text-[#512843]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Features You'll Love
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-10">
          {["Mood Calendar", "Smart Recommendations", "Privacy First"].map((title, i) => (
            <motion.div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center text-gray-500">
                Image
              </div>
              <h3 className="text-xl font-semibold text-[#512843]">{title}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section 4: CTA */}
      <div className="py-24 px-6 md:px-20 bg-gradient-to-r from-[#d72638] to-[#ff9500] text-white text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Ready to Explore Your Mind?
        </motion.h2>
        <p className="text-lg mb-8">
          Start your self-care journey with MindMuse today.
        </p>
        <button
          onClick={handleStart}
          className="bg-white text-[#d72638] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition"
        >
          Start Journaling
        </button>
      </div>

      {/* Section 5: Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6 md:px-20 text-center text-sm text-gray-600">
        <div className="mb-4 flex justify-center gap-6">
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#ff9500] transition">
            <FaTwitter size={20} />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#ff9500] transition">
            <FaGithub size={20} />
          </a>
        </div>
        <p>
          Made with <FaHeart className="inline text-[#d72638]" /> by MindMuse Team © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
