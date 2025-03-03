import React from 'react'
import useFileStore from '../../stores/fileStore';
import DownloadButton from './DownloadButton';
import SrtEditor from './SrtEditor';

const SelectSubtitlesStyle = () => {
  const {uploading, videoUrl, subtitlesEdited, uploadSrt ,setVideoSubtitledUrl} = useFileStore()
  const handleClick = async () =>{
    if (subtitlesEdited) {
      await uploadSrt()
    }
    await setVideoSubtitledUrl()
  }
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
        <div className="flex flex-col gap-y-2 bg-white p-6 rounded-2xl shadow-lg max-w-md w-full ">
            <SrtEditor/>
            <button
                    onClick={handleClick}
                    disabled={uploading}
                    className={`w-full px-4 py-2 text-white font-medium rounded-xl shadow-md ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {uploading ? "Processing..." : "Generate subtitled video"}
                </button>
            {videoUrl && <DownloadButton/>}
        </div>
    </div>
  )
}

export default SelectSubtitlesStyle;
