import React from "react";
import useFileStore from "../../stores/fileStore";
import FileInput from "./FileInput";

const UploadFile = () => {
    const { file, uploading, processFile } = useFileStore();

    return (
        <>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Upload Your File
            </h1>

            <div className="flex flex-col items-center space-y-4">
                <FileInput/>
                <button
                    onClick={processFile}
                    disabled={uploading || !file}
                    className={`w-full px-4 py-2 text-white font-medium rounded-xl shadow-md ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {uploading ? "Processing..." : "Upload and Process"}
                </button>
            </div>
        </>
    );
};

export default UploadFile;
