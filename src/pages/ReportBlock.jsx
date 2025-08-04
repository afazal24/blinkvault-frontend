import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../utils/axios";

const ReportBlock = () => {
  const [reportType, setReportType] = useState("post");
  const [targetId, setTargetId] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetId || !reason) {
      return toast.error("Please fill all fields");
    }

    try {
      const res = await axios.post("/report", {
        type: reportType,
        targetId,
        reason,
      });
      toast.success(res.data?.message || "Report submitted");
      setTargetId("");
      setReason("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong while reporting"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white dark:bg-gray-900 shadow rounded-xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        🚨 Report / Block
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
          >
            <option value="post">Report Post</option>
            <option value="user">Block User</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            {reportType === "post" ? "Post ID" : "User ID"}
          </label>
          <input
            type="text"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            placeholder={`Enter ${reportType === "post" ? "Post" : "User"} ID`}
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
            placeholder="Describe your reason"
          />
        </div>

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReportBlock;
