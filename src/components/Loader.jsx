import React from "react";
import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );
};
