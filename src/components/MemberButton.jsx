import React, { useState } from "react";

const MemberButton = () => {
  const [isMember, setIsMember] = useState(false);

  const toggleMembership = () => {
    setIsMember(!isMember);
  };

  return (
    <button
      onClick={toggleMembership}
      className={`px-4 py-2 rounded-full text-sm font-medium ${
        isMember
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-green-500 text-white hover:bg-green-600"
      }`}
    >
      {isMember ? "Remove Member" : "Become Member"}
    </button>
  );
};

export default MemberButton;
