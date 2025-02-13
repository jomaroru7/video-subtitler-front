import { create } from "zustand";
import { getS3UploadUrl, uploadFileToS3 } from "../utils/api";

const useFileStore = create((set) => ({
  file: null,
  uploading: false,

  setFile: (file) => set({ file }),

  uploadFile: async () => {
    const { file } = useFileStore.getState();
    if (!file) return alert("Please select a file!");

    set({ uploading: true });

    try {
      const data = await getS3UploadUrl(file); 
      await uploadFileToS3(data.url, file);
      alert("File uploaded successfully!");
      set({ file: null });
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed!");
    } finally {
      set({ uploading: false });
    }
  },
}));

export default useFileStore;
