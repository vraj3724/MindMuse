import React, { useState } from "react";
import axios from "axios";

export default function InteractiveSession() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const userName = localStorage.getItem("username") || "Friend";

  const questions = [
    { id: "q1", type: "mcq", text: "How was your day?", options: ["Good", "Okay", "Bad"] },
    { id: "q2", type: "mcq", text: "Where did this feeling mostly come from?", options: ["Work", "Family", "Health", "Friends", "Self"] },
    { id: "q3", type: "text", text: "Can you describe what happened specifically?" },
    { id: "q4", type: "mcq", text: "How are you feeling right now?", options: ["Calm", "Tired", "Anxious", "Happy", "Low"] },
    { id: "q5", type: "mcq", text: "What do you need the most right now?", options: ["Rest", "Motivation", "Connection", "Reflection"] },
    { id: "q6", type: "text", text: "What are you grateful for today?" }
  ];

  const currentQuestion = questions[step];

  const handleAnswer = async (answer) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(updatedAnswers);
    setCurrentInput("");

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      // Final step reached – generate GPT feedback
      setLoading(true);
      try {
        // Compose full entry
        const entryText = Object.entries(updatedAnswers)
          .map(([qid, ans]) => {
            const q = questions.find((q) => q.id === qid);
            return `Q: ${q.text}\nA: ${ans}`;
          })
          .join("\n\n");

        const mood = updatedAnswers.q1?.toLowerCase() || "neutral";
        const emotion = updatedAnswers.q4?.toLowerCase() || "neutral";

        const res = await axios.post("http://localhost:5000/api/ai/interactive-feedback", {
          entry: entryText,
          mood,
          emotion,
        });

        setFeedback(res.data.feedback);
      } catch (err) {
        console.error(err);
        setFeedback("Something went wrong while generating feedback.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-xl border border-gray-200 rounded-3xl p-8 max-w-2xl w-full space-y-6">
        {feedback ? (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-orange-700">Your Reflection Summary</h2>
            <div className="text-left space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-gray-50 p-4 rounded-xl border">
                  <p className="font-semibold text-orange-800">Q{index + 1}: {q.text}</p>
                  <p className="text-gray-800 mt-1">A: {answers[q.id]}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-orange-100 text-orange-800 p-4 rounded-xl border-l-4 border-orange-500 whitespace-pre-wrap">
              🧠 {feedback}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-orange-700 text-center">
              {currentQuestion.text}
            </h2>

            {currentQuestion.type === "mcq" ? (
              <div className="grid gap-4">
                {currentQuestion.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className="bg-gradient-to-r from-[#d72638] to-[#ff9500] text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  rows="4"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Write your thoughts..."
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleAnswer(currentInput.trim())}
                    disabled={!currentInput.trim() || loading}
                    className="bg-gradient-to-r from-[#d72638] to-[#ff9500] text-white font-semibold px-6 py-2 rounded-xl disabled:opacity-50 hover:opacity-90 transition"
                  >
                    {loading ? "Processing..." : "Next"}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
