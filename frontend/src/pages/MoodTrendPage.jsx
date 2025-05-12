import React, { useEffect, useState } from 'react';
import MoodTrendChart from '../components/MoodTrendChart';
import { entryService } from '../services/api';

export default function MoodTrendPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    entryService.getAll().then(setEntries).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-10 animate-fade-in-up">
        <h1 className="text-5xl font-extrabold text-[#d72638] drop-shadow mb-2">
          🧠 MindMuse Mood Insights
        </h1>
        <p className="text-gray-700 text-md font-medium">
          Tracking your emotional journey one entry at a time.
        </p>
      </div>
      <MoodTrendChart entries={entries} />
    </div>
  );
}
