import React from "react";
import useFileStore from "../../stores/fileStore";

const DownloadButton = () => {

  const {videoUrl, file} = useFileStore();

  const handleDownload = async () => {

    try {
      const fileName = file.name;
      const response = await fetch(videoUrl);
  
      if (!response.ok) {
        throw new Error("Failed to fetch the video from S3.");
      }
  
      const blob = await response.blob();
  
      const blobUrl = window.URL.createObjectURL(blob);
      
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = "subtitled_"+fileName;
  
      document.body.appendChild(anchor);
      anchor.click();
  
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl); 
    } catch (error) {
      console.error("Error downloading the video:", error.message);
      alert("Failed to download the video from S3.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className={"w-full px-4 py-2 text-white font-medium rounded-xl shadow-md bg-blue-600 hover:bg-blue-700"}
    >
      Download
    </button>
  );
};

export default DownloadButton;
