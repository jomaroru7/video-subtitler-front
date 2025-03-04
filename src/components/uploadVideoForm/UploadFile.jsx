import React from "react";
import useFileStore from "../../stores/fileStore";
import FileInput from "./FileInput";

const UploadFile = () => {
    const { file, uploading, uploadFile, extractAudio, getSubtitles } = useFileStore();

    const handleClick = async() =>{
        await uploadFile()
        await extractAudio()
        await getSubtitles()
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Selecciona tu video
            </h1>

            <div className="flex flex-col items-center space-y-4">
                <FileInput/>
                <button
                    onClick={handleClick}
                    data-testid="upload-button"
                    disabled={uploading || !file}
                    className={`w-full px-4 py-2 text-white font-medium rounded-xl shadow-md ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {uploading ? "Procesando..." : "Subir Video"}
                </button>
            </div>
        </>
    );
};

export default UploadFile;
