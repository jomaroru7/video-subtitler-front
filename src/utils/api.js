const ENV = import.meta.env;

export const getS3UploadUrl = async (uid, file) => {
  const response = await fetch(ENV.VITE_GET_S3_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file_name: "video/" + uid + "/" + file.name,
      file_type: file.type,
    }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return await response.json();
};

export const uploadFileToS3 = async (uploadUrl, file) => {
  try {
    const response = await fetch(uploadUrl, {
      mode: "cors",
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

export const extractAudioFromVideo = async (uid, filename, bucket = ENV.VITE_S3_DEFAULT_BUCKET) => {
  const response = await fetch(ENV.VITE_EXTRACT_AUDIO_FROM_VIDEO_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: uid,
      key: "video/" + uid + "/" + filename,
      bucket: bucket,
    }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return await response.json();
};

export const getSubtitles = async (uid, filename, bucket = ENV.VITE_S3_DEFAULT_BUCKET) => {
  const response = await fetch(ENV.VITE_GET_SUBTITLES_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      IID: uid,
      audio: filename,
      bucket: bucket,
    }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }


  return await response.json();
};

export const getVideoSubtitled = async (uid, filename, srtName, bucket = ENV.VITE_S3_DEFAULT_BUCKET) => {
  const response = await fetch(ENV.VITE_GET_SUBTITLED_VIDEO_URL, {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      video: {
        key: "video/" + uid + "/" + filename,
      },
      "srt": {
        key: srtName
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return await response.json();
};

