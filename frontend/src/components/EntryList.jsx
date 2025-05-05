import React from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function EntryList({ entries, onEdit, onDelete }) {
  const navigate = useNavigate();

  const getMoodColorClass = (mood) => {
    switch (mood) {
      case "positive":
        return "bg-green-100 text-green-700";
      case "negative":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "No date";
      const date = parseISO(dateString);
      return format(date, "MMMM d, yyyy • h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow text-center text-gray-500">
        No entries yet. Start writing your first diary entry!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div
          key={entry._id}
          onClick={() => navigate(`/entry/${entry._id}`)}
          className="bg-white/80 backdrop-blur-lg p-5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer group"
        >
          <div className="flex justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-[#512843]">
                  {entry.title || 'Untitled Entry'}
                </h3>
                {entry.mood && (
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${getMoodColorClass(entry.mood)}`}
                  >
                    {entry.mood}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-1">
                {formatDate(entry.date)}
              </p>

              <p className="text-sm text-gray-700 line-clamp-2">
                {entry.content}
              </p>
            </div>

            {/* Edit/Delete Actions */}
            <div className="flex flex-col items-end gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(entry);
                }}
                className="text-[#3590F3] hover:text-[#d72638]"
                title="Edit"
              >
                <FiEdit2 size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entry._id);
                }}
                className="text-[#d72638] hover:text-red-600"
                title="Delete"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
