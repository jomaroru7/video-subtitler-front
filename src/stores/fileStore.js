import { create } from "zustand";
import { toast } from "react-toastify";
import { getS3UploadUrl, uploadFileToS3 } from "../utils/api";

const useFileStore = create((set) => ({
  file: null,
  uploading: false,

  setFile: (file) => set({ file }),

  uploadFile: async () => {
    const { file } = useFileStore.getState();
    if (!file) {
      toast.error("Please select a file!");
      return;
    }

    set({ uploading: true });

    try {
      const data = await getS3UploadUrl(file);
      await uploadFileToS3(data.url, file);
      toast.success("File uploaded successfully!");
      set({ file: null });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("File upload failed!");
    } finally {
      set({ uploading: false });
    }
  },
}));

export default useFileStore;
