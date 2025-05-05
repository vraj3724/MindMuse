import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const getMoodScore = (mood) => {
  if (mood === 'positive') return 2;
  if (mood === 'neutral') return 1;
  if (mood === 'negative') return 0;
  return 1;
};

const MoodTrendChart = ({ entries }) => {
  const filteredEntries = Array.isArray(entries)
    ? entries.filter(
        (e) =>
          e.date &&
          e.mood &&
          ['positive', 'neutral', 'negative'].includes(e.mood)
      )
    : [];

  const sortedEntries = [...filteredEntries].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const data = sortedEntries.length > 0 ? {
    labels: sortedEntries.map((entry) =>
      new Date(entry.date).toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour12: true
      })
    ),
    datasets: [
      {
        label: 'Mood Score (0=Negative, 1=Neutral, 2=Positive)',
        data: sortedEntries.map((entry) => getMoodScore(entry.mood)),
        borderColor: 'rgba(253, 126, 20, 1)',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(253, 126, 20, 0.6)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7
      },
    ],
  } : null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 2,
        ticks: {
          stepSize: 1,
          callback: (val) =>
            val === 2 ? 'Positive' : val === 1 ? 'Neutral' : 'Negative',
          color: '#512843',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          color: '#f3f4f6'
        },
        title: {
          display: true,
          text: 'Mood Level',
          color: '#d72638',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
      },
      x: {
        ticks: {
          color: '#512843',
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: false
        },
        title: {
          display: true,
          text: 'Entry Date',
          color: '#d72638',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#512843',
          font: {
            size: 13,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: '#fff8f0',
        titleColor: '#d72638',
        bodyColor: '#333'
      }
    },
  };

  return (
    <div className="bg-white/70 rounded-2xl shadow-lg p-6 backdrop-blur-md border border-orange-200 mt-8 max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-[#d72638] mb-4 text-center">📈 Mood Trend Over Time</h3>
      <div className="h-96">
        {data && data.datasets ? (
          <Line data={data} options={options} />
        ) : (
          <p className="text-center text-gray-600">No valid entries available for mood visualization.</p>
        )}
      </div>
    </div>
  );
};

export default MoodTrendChart;
