import { create } from "zustand";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { getS3UploadUrl, uploadFileToS3, extractAudioFromVideo, getSubtitles, getVideoSubtitled } from "../utils/api";

/**
 * @typedef {Object} FileStore
 * @property {File | null} file
 * @property {string | null} uid
 * @property {boolean} uploading
 * @property {string | null} audioName
 * @property {string | null} subtitlesName
 * @property {string | null} subtitles
 * @property {string | null} videoUrl
 * @property {string | null} subtitlesUrl
 * @property {(file: File) => void} setFile
 * @property {(uid: string) => void} setUid
 * @property {(audioName: string) => void} setAudioName
 * @property {(subtitles: string) => void} setSubtitles
 * @property {(videoUrl: string) => void} setVideoUrl
 * @property {(subtitlesUrl: string) => void} setSubtitlesUrl
 * @property {() => Promise<boolean>} uploadFile
 * @property {() => Promise<boolean>} extractAudio
 * @property {() => Promise<boolean>} getSubtitles
 * @property {() => Promise<boolean>} setVideoSubtitledUrl
 * @property {() => Promise<void>} processFile
 */

/** @type {import("zustand").UseBoundStore<import("zustand").StoreApi<FileStore>>} */
const useFileStore = create((set) => ({
  file: null,
  uid: null,
  uploading: false,
  audioName: null,
  subtitlesName: null,
  subtitles: null,
  videoUrl: null,
  subtitlesUrl: null,

  setFile: (file) => set({ file }),
  setUid: (uid) => set({ uid }),
  setAudioName: (audioName) => set({ audioName }),
  setSubtitlesName: (subtitlesName) => set({ subtitlesName }),
  setSubtitles: (subtitles) => set({ subtitles }),
  setVideoUrl: (videoUrl) => set({ videoUrl }),
  setSubtitlesUrl: (subtitlesUrl) => set({ subtitlesUrl }),

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

      const subtitlesFileName = data.body.subtitles.key;
      set({subtitlesName: subtitlesFileName})

      const subtitlesURL = data.body.subtitles.url;
      set({ subtitlesUrl: subtitlesURL });

      const response = await fetch(subtitlesURL);
      if (!response.ok) throw new Error("Failed to fetch subtitles");

      const text = await response.text();
      set({subtitles: text});

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
    const { uid, file, subtitlesName } = useFileStore.getState();

    if (!uid || !file) {
      toast.error("Cannot get video. UID or file is missing!");
      return false;
    }

    set({ uploading: true });

    try {
      const data = await getVideoSubtitled(uid, file.name, subtitlesName );
      set({ videoUrl: data.url });

      toast.success("Video URL obtained successfully!");
      return true;
    } catch (error) {
      console.error("Video URL error:", error);
      toast.error("Video URL could not be obtained!");
      return false;
    } finally {
      set({ uploading: false });
    }
  },

  processFile: async () => {
    const { uploadFile, extractAudio, getSubtitles, setVideoSubtitledUrl } = useFileStore.getState();

    set({ uploading: true });

    try {
      const uploadSuccess = await uploadFile();
      if (!uploadSuccess) return;

      const audioSuccess = await extractAudio();
      if (!audioSuccess) return;

      const subtitlesSuccess = await getSubtitles();
      if (!subtitlesSuccess) return;

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
