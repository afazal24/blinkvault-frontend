import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      <div className="flex items-center border rounded-full px-4 py-2 bg-white dark:bg-gray-800 shadow">
        <Search size={20} className="text-gray-500 mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent focus:outline-none text-gray-700 dark:text-white"
          placeholder="Search posts, users, hashtags..."
        />
      </div>
    </div>
  );
};

export default SearchBar;
