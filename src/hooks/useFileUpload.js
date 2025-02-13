import { useState } from "react";
import { getS3UploadUrl } from "../utils/api";

const useFileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    if (!file) return alert("Please select a file!");

    setUploading(true);

    try {
      const data = await getS3UploadUrl(file);
      await fetch(data.url, {
        mode: "cors",
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return {
    file,
    uploading,
    setFile,
    uploadFile,
  };
};

export default useFileUpload;
