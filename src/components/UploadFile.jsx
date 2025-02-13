import React from "react";
import FileInput from "./FileInput";
import UploadButton from "./UploadButton";
import useFileStore from "../stores/fileStore";

const UploadFile = () => {
  const { file, uploading, setFile, uploadFile } = useFileStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Upload Your File
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <FileInput onFileChange={setFile} />
          <UploadButton onClick={uploadFile} uploading={uploading} />
        </div>

        {file && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 font-bold">Selected File:</p>
            <p className="text-sm font-medium text-gray-800">{file.name}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
