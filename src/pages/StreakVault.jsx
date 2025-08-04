import React from "react";

const StreakVault = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Your StreakVault</h1>
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xl font-semibold">🔥 Current Streak</p>
            <p className="text-3xl">5 days</p>
          </div>
          <div>
            <p className="text-xl font-semibold">🏆 Longest Streak</p>
            <p className="text-3xl">10 days</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Come back daily to maintain your streak and unlock achievements!
        </p>
      </div>
    </div>
  );
};

export default StreakVault;
