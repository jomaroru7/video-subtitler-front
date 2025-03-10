import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import useFileStore from "./stores/fileStore";
import VideoPlayerComponent from "./components/videoPlayer/VideoPlayer";
import SelectSubtitlesStyle from "./components/subtitleVideoForm/SelectSubtitlesStyle";
import UploadVideoForm from "./components/uploadVideoForm/UploadVideoForm";
import Spinner from "./components/Spinner";
import Guide from "./components/guide/Guide";
import Footer from "./components/Footer";
import BuyMeACoffe from "./components/BuyMeACoffe";

function App() {
    const { file, subtitles, uploading } = useFileStore()
    const isPlayerReady = Boolean(file) && Boolean(subtitles);

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-100 items-center">
            <div className="flex flex-col flex-1 justify-between items-center relative xl:w-6xl">
                <Header />
                <Guide />
                {uploading && <Spinner />}
                {isPlayerReady && <VideoPlayerComponent />}
                {isPlayerReady && <SelectSubtitlesStyle />}
                {!isPlayerReady && <UploadVideoForm />}
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
                <BuyMeACoffe />
            </div>
            <Footer />
        </div>
    );
}

export default App;
