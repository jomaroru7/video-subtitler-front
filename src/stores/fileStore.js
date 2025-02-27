import { create } from "zustand";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  getS3UploadUrl,
  uploadFileToS3,
  extractAudioFromVideo,
  getSubtitles,
  getVideoSubtitled
} from "../utils/api";

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
 * @property {Array<{ start: number, text: string }>} subtitlesArray 
 * @property {{ start: number, text: string } | null} currentSubtitle
 * @property {boolean} subtitlesEdited
 * @property {(file: File) => void} setFile
 * @property {(uid: string) => void} setUid
 * @property {(audioName: string) => void} setAudioName
 * @property {(subtitlesName: string) => void} setSubtitlesName
 * @property {(subtitles: string) => void} setSubtitles
 * @property {(videoUrl: string) => void} setVideoUrl
 * @property {(subtitlesArray: Array<{ start: number, text: string }>) => void} setSubtitlesArray
 * @property {(currentSubtitle: { start: number, text: string } | null) => void} setCurrentSubtitle
 * @property {(subtitlesUrl: string) => void} setSubtitlesUrl
 * @property {(subtitlesEdited: boolean) => void} setSubtitlesEdited
 * @property {() => Promise<boolean>} uploadFile
 * @property {() => Promise<boolean>} extractAudio
 * @property {() => Promise<boolean>} getSubtitles
 * @property {() => Promise<boolean>} setVideoSubtitledUrl 
 * @property {(startTime: number, newText: string) => void} updateSubtitleText
 */

/** @type {import("zustand").UseBoundStore<import("zustand").StoreApi<FileStore>>} */
const useFileStore = create((set) => ({
  // State Variables
  file: null,
  uid: null,
  uploading: false,
  audioName: null,
  subtitlesName: null,
  subtitles: null,
  videoUrl: null,
  subtitlesUrl: null,
  subtitlesArray: [],
  currentSubtitle: [],
  subtitlesEdited: false,


  // State Setters
  setFile: (file) => set({ file }),
  setUid: (uid) => set({ uid }),
  setAudioName: (audioName) => set({ audioName }),
  setSubtitlesName: (subtitlesName) => set({ subtitlesName }),
  setSubtitles: (subtitles) => set({ subtitles }),
  setVideoUrl: (videoUrl) => set({ videoUrl }),
  setSubtitlesUrl: (subtitlesUrl) => set({ subtitlesUrl }),
  setSubtitlesArray: (subtitlesArray) => set({ subtitlesArray }),
  setCurrentSubtitle: (currentSubtitle) => set({ currentSubtitle }),
  setSubtitlesEdited: (subtitlesEdited) => set({ subtitlesEdited }),


  /**
   * Upload file to S3
   * @returns {Promise<boolean>} Success or failure status
   */
  uploadFile: async () => {
    const { file } = useFileStore.getState();
    if (!file) return toast.error("Please select a file!"), false;

    return handleAsyncAction(set, async () => {
      const uid = uuidv4();
      set({ uid });

      const data = await getS3UploadUrl(uid, file);
      await uploadFileToS3(data.url, file);

      toast.success("File uploaded successfully!");
      return true;
    }, "File upload failed!");
  },

  /**
   * Extract audio from uploaded video
   * @returns {Promise<boolean>} Success or failure status
   */
  extractAudio: async () => {
    const { file, uid } = useFileStore.getState();
    if (!file || !uid) return toast.error("Cannot extract audio. File or UID is missing!"), false;

    return handleAsyncAction(set, async () => {
      const data = await extractAudioFromVideo(uid, file.name);
      set({ audioName: data.key });

      toast.success("Audio extracted successfully!");
      return true;
    }, "Audio extraction failed!");
  },

  /**
   * Generate subtitles for the extracted audio
   * @returns {Promise<boolean>} Success or failure status
   */
  getSubtitles: async () => {
    const { uid, audioName } = useFileStore.getState();
    if (!uid || !audioName) return toast.error("Cannot generate subtitles. UID or audio name is missing!"), false;

    return handleAsyncAction(set, async () => {
      const data = await getSubtitles(uid, audioName);

      const subtitlesFileName = data.body.subtitles.key;
      const subtitlesURL = data.body.subtitles.url;

      set({ subtitlesName: subtitlesFileName, subtitlesUrl: subtitlesURL });

      // Fetch subtitles content
      const response = await fetch(subtitlesURL);
      if (!response.ok) throw new Error("Failed to fetch subtitles");

      const text = await response.text();
      set({ subtitles: text });

      toast.success("Subtitles generated successfully!");
      return true;
    }, "Subtitles generation failed!");
  },

  /**
   * Generate a subtitled video URL
   * @returns {Promise<boolean>} Success or failure status
   */
  setVideoSubtitledUrl: async () => {
    const { uid, file, subtitlesName } = useFileStore.getState();
    if (!uid || !file) return toast.error("Cannot get video. UID or file is missing!"), false;

    return handleAsyncAction(set, async () => {
      const data = await getVideoSubtitled(uid, file.name, subtitlesName);
      set({ videoUrl: data.url });

      toast.success("Video URL obtained successfully!");
      return true;
    }, "Video URL could not be obtained!");
  },

  updateSubtitleText: (startTime, newText) => {
    set((state) => ({
      subtitlesArray: state.subtitlesArray.map((sub) =>
        sub.start === startTime ? { ...sub, text: newText } : sub
      ),
      currentSubtitle: { startTime:startTime, text: newText },
    }));
  },
}));

/**
 * Helper function for handling async actions
 * @param {() => Promise<any>} action The async function to execute
 * @param {string} errorMessage Error message to display on failure
 * @returns {Promise<boolean>} Success or failure status
 */
const handleAsyncAction = async (set, action, errorMessage) => {
  set({ uploading: true });
  try {
    return await action();
  } catch (error) {
    console.error(errorMessage, error);
    toast.error(errorMessage);
    return false;
  } finally {
    set({ uploading: false });
  }
};

export default useFileStore;
