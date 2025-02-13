import React from "react";
import useFileStore from "../stores/fileStore";

const UploadFile = () => {
  const { file, uploading, setFile, processFile } = useFileStore();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Upload Your File
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />

          <button
            onClick={processFile}
            disabled={uploading || !file}
            className={`w-full px-4 py-2 text-white font-medium rounded-xl shadow-md ${
              uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Processing..." : "Upload and Process"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
