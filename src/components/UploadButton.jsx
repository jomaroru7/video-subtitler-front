import React from "react";

const UploadButton = ({ onClick, uploading }) => {
  return (
    <button
      onClick={onClick}
      disabled={uploading}
      className={`w-full px-4 py-2 text-white font-medium rounded-xl shadow-md ${
        uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {uploading ? "Uploading..." : "Upload"}
    </button>
  );
};

export default UploadButton;
