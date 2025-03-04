import React, { useEffect, useState } from "react";
import useFileStore from "../../stores/fileStore";

const SrtEditor = () => {
  const { currentSubtitle, updateSubtitleText, setSubtitlesEdited, videoIsPlaying } = useFileStore();
  const [editableText, setEditableText] = useState("");

  useEffect(() => {
    if (currentSubtitle) {
      setEditableText(currentSubtitle.text);
    }
  }, [currentSubtitle]);

  const handleTextChange = (e) => {
    setEditableText(e.target.value);
  };

  const handleClick = () => {
    updateSubtitleText(currentSubtitle.start, editableText);
    setSubtitlesEdited(true);
  };

  if (!currentSubtitle) {
    return <p className="text-center text-gray-600">No active subtitle.</p>;
  }

  return (
    <div>
      <p className="text-gray-700 mb-2">
        Editando subtitulos en {currentSubtitle.start}s → {currentSubtitle.end}s
      </p>
      <textarea
        rows="3"
        value={editableText}
        onChange={handleTextChange}
        disabled={videoIsPlaying}
        className={`w-full p-2 border rounded-md ${videoIsPlaying ? "bg-gray-200 cursor-not-allowed" : ""}`}
      />
      <button
        onClick={handleClick}
        disabled={videoIsPlaying}
        className={`w-full px-4 py-2 font-medium rounded-xl shadow-md ${
          videoIsPlaying ? "bg-gray-400 cursor-not-allowed text-gray-700" : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        Actualizar subtítulos
      </button>
    </div>
  );
};

export default SrtEditor;
