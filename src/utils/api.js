const ENV = import.meta.env;

export const getS3UploadUrl = async (file) => {
  const response = await fetch(ENV.VITE_GET_S3_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file_name: "video/" + (file.name || ""),
      file_type: file.type || "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }

  return await response.json();
};
