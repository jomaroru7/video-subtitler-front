import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import useFileStore from "./stores/fileStore";
import VideoPlayerComponent from "./components/videoPlayer/VideoPlayer";
import SelectSubtitlesStyle from "./components/subtitleVideoForm/SelectSubtitlesStyle";
import UploadVideoForm from "./components/uploadVideoForm/UploadVideoForm";

function App() {
    const { file, subtitles } = useFileStore()
    const isPlayerReady = Boolean(file) && Boolean(subtitles);

    return (
        <div className="min-h-screen flex flex-col justify-between items-center bg-gray-100">
            <Header />
            {isPlayerReady && <VideoPlayerComponent />}
            {isPlayerReady && <SelectSubtitlesStyle/>}
            {!isPlayerReady &&<UploadVideoForm/>}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}

export default App;
