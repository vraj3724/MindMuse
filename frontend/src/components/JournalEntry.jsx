import React, { useState } from "react";
import { format } from "date-fns";

const JournalEntry = ({ onSave, isLoading }) => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [primaryEmotion, setPrimaryEmotion] = useState("");
  const [secondaryEmotions, setSecondaryEmotions] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState("");
  const [error, setError] = useState("");

  const getMoodColor = (mood) => {
    switch (mood) {
      case "positive":
        return "bg-green-100 text-green-700";
      case "negative":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getEmotionColor = (emotion) => {
    const emotionColors = {
      joy: "bg-green-100 text-green-700",
      surprise: "bg-blue-100 text-blue-700",
      neutral: "bg-gray-200 text-gray-700",
      sadness: "bg-red-100 text-red-700",
      fear: "bg-yellow-100 text-yellow-700",
      anger: "bg-red-200 text-red-800",
      disgust: "bg-pink-100 text-pink-700",
    };
    return emotionColors[emotion] || "bg-gray-100 text-gray-700";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await onSave({title, content });

      if (response && response.entry) {
        const {
          mood,
          confidence,
          primary_emotion,
          secondary_emotions,
          ai_recommendations,
        } = response.entry;

        if (!mood || !confidence || !primary_emotion) {
          throw new Error("Invalid response format from server");
        }

        setMood(mood);
        setConfidence(confidence);
        setPrimaryEmotion(primary_emotion);
        setSecondaryEmotions(secondary_emotions || []);
        setAiRecommendations(ai_recommendations || ""); 
        setContent("");
        setTitle("");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("❌ Error saving entry:", err);
      setError(err.message || "Failed to save entry. Please try again.");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-6">
      <h3 className="text-lg font-semibold text-gray-600">
        {format(new Date(), "MMMM d, yyyy")}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
          rows={1}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <textarea
          rows={6}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-4 rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {mood && (
          <div className="space-y-2 text-sm text-[#512843]">
            <div className="font-semibold">
              AI Analysis: Mood{" "}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(mood)}`}>
                {mood} ({(confidence * 100).toFixed(1)}%)
              </span>
            </div>

            <div>
              Primary Emotion:{" "}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEmotionColor(primaryEmotion)}`}>
                {primaryEmotion}
              </span>
            </div>

            {secondaryEmotions.length > 0 && (
              <div>
                <p className="font-medium mb-1">Other Emotions:</p>
                <div className="flex flex-wrap gap-2">
                  {secondaryEmotions.map((e, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getEmotionColor(e.emotion)}`}
                    >
                      {e.emotion} ({(e.score * 100).toFixed(1)}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {aiRecommendations && (
              <div className="mt-4 p-4 border-l-4 border-blue-500 bg-blue-50 text-blue-800 rounded-md text-sm whitespace-pre-line">
                <p className="font-semibold mb-1">AI Recommendations:</p>
                  {aiRecommendations}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="bg-gradient-to-r from-[#d72638] to-[#ff9500] text-white font-semibold py-2 px-6 rounded-full shadow-md hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalEntry;
