import React, { useState } from "react";

const SaveButton = () => {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <button
      onClick={toggleSave}
      className={`text-sm px-3 py-1 border rounded-full ${
        isSaved
          ? "bg-yellow-400 text-white border-yellow-500"
          : "bg-gray-200 text-gray-800 border-gray-300"
      }`}
    >
      {isSaved ? "Saved" : "💾 Save"}
    </button>
  );
};

export default SaveButton;
