import React, { useState } from "react";


const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const ENV = import.meta.env;

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadFile = async () => {
        if (!file) return alert("Please select a file!");

        setUploading(true);
        
        try {
            const response = await fetch(
                ENV.VITE_GET_S3_URL,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        file_name: "video/" + (file.name || ""),
                        file_type: file.type || ""
                    }),
                }
            );
            console.log("Server response:", response);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Server response:", data);

            const putResponse = await fetch(
                data.url,
                {
                    mode:"cors",
                    method: "put",
                    headers: { "Content-Type": file.type },
                    body: file
                }
            );

            console.log(putResponse)

        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setUploading(false);
        }

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
                        onClick={uploadFile}
                        disabled={uploading}
                        className={`w-full px-4 py-2 text-white font-medium rounded-xl shadow-md ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>

                {file && (
                    <div className="mt-4 text-center ">
                        <p className="text-sm text-gray-600 font-bold">Selected File:</p>
                        <p className="text-sm font-medium text-gray-800">{file.name}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadFile;
