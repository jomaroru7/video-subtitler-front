import { create } from "zustand";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  getS3UploadUrl,
  uploadFileToS3,
  extractAudioFromVideo,
  getSubtitles,
  getVideoSubtitled,
  generateSubtitles
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
 * @property {boolean} videoIsPlaying
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
 * @property {(videoIsPlaying: boolean) => void} setVideoIsPlaying
 * @property {() => Promise<boolean>} uploadFile
 * @property {() => Promise<boolean>} uploadSrt 
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
  videoIsPlaying: false,


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
  setVideoIsPlaying: (videoIsPlaying) => set({ videoIsPlaying }),


  /**
   * Upload file to S3
   * @returns {Promise<boolean>} Success or failure status
   */
  uploadFile: async () => {
    const { file } = useFileStore.getState();
    if (!file) return toast.error("Por favor, seleccione un archivo"), false;

    return handleAsyncAction(set, async () => {
      // const uid = uuidv4();
      const uid = generateUID();
      set({ uid });

      const data = await getS3UploadUrl("video/" + uid + "/" + file.name, file.type);
      await uploadFileToS3(data.url, file);

      toast.success("Archivo subido correctamente");
      return true;
    }, "Ha fallado la subida del fichero");
  },

  /**
   * Upload srt to S3
   * @returns {Promise<boolean>} Success or failure status
   */
  uploadSrt: async () => {
    const { subtitlesArray, uid } = useFileStore.getState();
    const subtitlesFile = getSrtFileFromArray(subtitlesArray);
    return handleAsyncAction(set, async () => {
      const srtFileName = "processed/srt/" + uid + ".srt";

      const data = await getS3UploadUrl(srtFileName, subtitlesFile.type);
      await uploadFileToS3(data.url, subtitlesFile);

      toast.success("Actualización de subtitulos correcta");
      return true;
    }, "La actualización de los subtítulos falló");
  },

  /**
   * Extract audio from uploaded video
   * @returns {Promise<boolean>} Success or failure status
   */
  extractAudio: async () => {
    const { file, uid } = useFileStore.getState();
    if (!file || !uid) return toast.error("No se ha podido extraer el audio"), false;

    return handleAsyncAction(set, async () => {
      const data = await extractAudioFromVideo(uid, file.name);
      set({ audioName: data.key });

      toast.success("Audio extraido correctamente");
      return true;
    }, "Fallo en la extracción del audio");
  },

  /**
   * Generate subtitles for the extracted audio
   * @returns {Promise<boolean>} Success or failure status
   */
  getSubtitles: async () => {
    const { uid, audioName } = useFileStore.getState();
    if (!uid || !audioName) return toast.error("No se han podido generar los subtítulos"), false;

    return handleAsyncAction(set, async () => {
      const generateResponse = await generateSubtitles(uid, audioName);

      if (generateResponse.status !== 200) {
        throw new Error("No se han podido generar los subtitulos");
      }

      const data = await pollGetSubtitles();

      const subtitlesFileName = data.subtitles.key;
      const subtitlesURL = data.subtitles.url;

      set({ subtitlesName: subtitlesFileName, subtitlesUrl: subtitlesURL });

      // Fetch subtitles content
      const response = await fetch(subtitlesURL);
      if (!response.ok) throw new Error("No se han encontrado los subtítulos");

      const text = await response.text();
      set({ subtitles: text });

      toast.success("Subtítulos generados correctamente");
      return true;
    }, "Ha fallado la generación de subtítulos");
  },

  /**
   * Generate a subtitled video URL
   * @returns {Promise<boolean>} Success or failure status
   */
  setVideoSubtitledUrl: async () => {
    const { uid, file, subtitlesName } = useFileStore.getState();
    if (!uid || !file) return toast.error("No se ha podido obtener el video"), false;

    return handleAsyncAction(set, async () => {
      const data = await getVideoSubtitled(uid, file.name, subtitlesName);
      set({ videoUrl: data.url });

      toast.success("Url del video obtenida");
      return true;
    }, "No se ha podido obtener la url del video");
  },

  updateSubtitleText: (startTime, newText) => {
    set((state) => ({
      subtitlesArray: state.subtitlesArray.map((sub) =>
        sub.start === startTime ? { ...sub, text: newText } : sub
      ),
      currentSubtitle: { startTime: startTime, text: newText },
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

/**
 * Converts an array of subtitle objects into an SRT file.
 *
 * @param {Array<{ start: number, end: number, text: string }>} subtitlesArray - The array of subtitles.
 * @returns {File} The generated SRT file.
 * @throws {Error} If the subtitles array is invalid.
 */
const getSrtFileFromArray = (subtitlesArray) => {
  if (!Array.isArray(subtitlesArray) || subtitlesArray.length === 0) {
    throw new Error("Invalid subtitles array");
  }

  const formatTime = (time) => {
    const date = new Date(time * 1000);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
    return `${hours}:${minutes}:${seconds},${milliseconds}`;
  };

  const srtContent = subtitlesArray
    .map((subtitle, index) => {
      return `${index + 1}\n${formatTime(subtitle.start)} --> ${formatTime(subtitle.end)}\n${subtitle.text}\n`;
    })
    .join("\n");

  const blob = new Blob([srtContent], { type: "text/plain" });
  return new File([blob], "subtitles.srt", { type: "text/plain" });
};

const generateUID = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  return `${year}${month}${day}-${hours}${minutes}${seconds}${milliseconds}`;
};

const pollGetSubtitles = async () => {
  const { uid, audioName } = useFileStore.getState();
  let attempt = 0;

  return new Promise((resolve, reject) => {
    const initalInterval = 10000;
    const defaultInterval = 5000;
    const maxAttempts = 60;
    const poll = async () => {
      attempt++;

      try {
        const result = await getSubtitles(uid, audioName);

        if (result.status === 200) {
          resolve(await result.json());
          return;
        }

      } catch (error) {
        reject(error);
        return;
      }

      // if (attempt >= maxAttempts) {
      //   reject(new Error("Polling stopped: Maximum attempts reached."));
      //   return;
      // }

      const delay = attempt < 2 ? initalInterval : defaultInterval;
      setTimeout(poll, delay);
    };

    poll();
  });
}


export default useFileStore;

