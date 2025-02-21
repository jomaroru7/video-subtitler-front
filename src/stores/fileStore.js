import { create } from "zustand";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { getS3UploadUrl, uploadFileToS3, extractAudioFromVideo, getSubtitles, getVideoSubtitled } from "../utils/api";

const useFileStore = create((set) => ({
  file: null,
  uid: null,
  uploading: false,
  audioName: null,
  subtitles: null,
  videoUrl: null,

  setFile: (file) => set({ file }),
  setUid: (uid) => set({ uid }),
  setAudioName: (audioName) => set({ audioName }),
  setSubtitles: (subtitles) => set({ subtitles }),
  setVideoUrl: (videoUrl) => set({ videoUrl }),

  uploadFile: async () => {
    const { file } = useFileStore.getState();
    if (!file) {
      toast.error("Please select a file!");
      return false;
    }

    set({ uploading: true });

    try {
      const uid = uuidv4();
      set({ uid });

      const data = await getS3UploadUrl(uid, file);

      await uploadFileToS3(data.url, file);

      toast.success("File uploaded successfully!");
      return true;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("File upload failed!");
      return false;
    } finally {
      set({ uploading: false });
    }
  },

  extractAudio: async () => {
    const { file, uid } = useFileStore.getState();

    if (!file || !uid) {
      toast.error("Cannot extract audio. File or UID is missing!");
      return false;
    }

    set({ uploading: true });

    try {
      const data = await extractAudioFromVideo(uid, file.name);
      set({ audioName: data.key });

      toast.success("Audio extracted successfully!");
      return true;
    } catch (error) {
      console.error("Audio extraction error:", error);
      toast.error("Audio extraction failed!");
      return false;
    } finally {
      set({ uploading: false });
    }
  },

  getSubtitles: async () => {
    const { uid, audioName } = useFileStore.getState();

    if (!uid || !audioName) {
      toast.error("Cannot generate subtitles. UID or audio name is missing!");
      return false;
    }

    set({ uploading: true });

    try {
      const data = await getSubtitles(uid, audioName);
      set({ subtitles: data.subtitles });

      toast.success("Subtitles generated successfully!");
      return true;
    } catch (error) {
      console.error("Subtitles generation error:", error);
      toast.error("Subtitles generation failed!");
      return false;
    } finally {
      set({ uploading: false });
    }
  },

  setVideoSubtitledUrl: async () => {
    const { uid, file, videoUrl } = useFileStore.getState();

    if (!uid || !file) {
      toast.error("Cannot get video. UID or file is missing!");
      return false;
    }

    set({ uploading: true });

    try {
      const data = await getVideoSubtitled(uid, file.name);
      set({videoUrl: data.url});

      toast.success("Video url obtained successfully!");
      return true;
    } catch (error) {
      console.error("Video url error:", error);
      toast.error("Video url could not be obtained!");
      return false;
    } finally {
      set({ uploading: false });
    }
  },

  processFile: async () => {
    const { uploadFile, extractAudio, getSubtitles, setVideoSubtitledUrl, file } = useFileStore.getState();

    set({ uploading: true });

    try {
      const uploadSuccess = await uploadFile();
      if (!uploadSuccess) return;

      const audioSuccess = await extractAudio();
      if (!audioSuccess) return;

      // const subtitlesSuccess = await getSubtitles();
      // if (!subtitlesSuccess) return;

      const videoUrlSuccess = await setVideoSubtitledUrl();
      if (!videoUrlSuccess) return;

      toast.success("All steps completed successfully!");
    } catch (error) {
      console.error("Process error:", error);
      toast.error("An error occurred during file processing!");
    } finally {
      set({ uploading: false });
    }
  },
}));

export default useFileStore;
