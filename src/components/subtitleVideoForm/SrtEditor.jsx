import React, { useEffect, useState } from "react";
import useFileStore from "../../stores/fileStore";

const SrtEditor = () => {
  const { currentSubtitle, updateSubtitleText, setSubtitlesEdited } = useFileStore();
  const [editableText, setEditableText] = useState("");

  useEffect(() => {
    if (currentSubtitle) {
      setEditableText(currentSubtitle.text);
    }
  }, [currentSubtitle]);

  const handleTextChange = (e) => {
    setEditableText(e.target.value);
  };

  const handleClick = () =>{
    updateSubtitleText( currentSubtitle.start, editableText);
    setSubtitlesEdited(true);
  }

  if (!currentSubtitle) {
    return <p className="text-center text-gray-600">No active subtitle.</p>;
  }

  return (
    <div className="">
      <p className="text-gray-700 mb-2">
        Editing subtitle at {currentSubtitle.start}s → {currentSubtitle.end}s
      </p>
      <textarea
        rows="3"
        value={editableText}
        onChange={handleTextChange}
        className="w-full p-2 border rounded-md"
      />
      <button 
        onClick={handleClick}
        className="w-full px-4 py-2 text-white font-medium rounded-xl shadow-md bg-blue-600 hover:bg-blue-700"
        >
        Update subtitles
      </button>
    </div>
  );
};

export default SrtEditor;
