// components/LoaderOverlay.js
import React from "react";

export default function LoaderOverlay() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-[#d72638] border-b-[#ff9500] border-l-transparent border-r-transparent rounded-full animate-spin"></div>
    </div>
  );
}
