import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import useFileStore from "../../stores/fileStore";

const parseSRT = (srtText) => {
    const subtitleRegex = /(\d+)\n(\d{2}:\d{2}:\d{2}),(\d{1,3}) --> (\d{2}:\d{2}:\d{2}),(\d{1,3})\n([\s\S]*?)(?=\n\n|\n*$)/g;
    let subtitles = [];

    let match;
    while ((match = subtitleRegex.exec(srtText)) !== null) {
        const start = timeToSeconds(match[2], match[3]);
        const end = timeToSeconds(match[4], match[5]);
        const text = match[6].replace(/\r/g, "").trim();
        subtitles.push({ start, end, text });
    }

    return subtitles;
};

const timeToSeconds = (hhmmss, ms) => {
    const [hh, mm, ss] = hhmmss.split(":").map(Number);
    return hh * 3600 + mm * 60 + ss + Number(ms) / 1000;
};

const VideoPlayer = () => {
    const { file, videoUrl, subtitles } = useFileStore();
    const [videoSrc, setVideoSrc] = useState(null);
    const [subtitlesText, setSubtitlesText] = useState([]);
    const [currentSubtitle, setCurrentSubtitle] = useState("");
    const playerRef = useRef(null);

    useEffect(() => {
        if (file) {
            const blobUrl = URL.createObjectURL(file);
            setVideoSrc(blobUrl);

            return () => {
                URL.revokeObjectURL(blobUrl);
            };
        } else if (videoUrl) {
            setVideoSrc(videoUrl);
        }
    }, [file, videoUrl]);

    useEffect(() => {
        const loadSubtitles = () => {
            const srtText = subtitles;
            const parsedSubtitles = parseSRT(srtText);
            setSubtitlesText(parsedSubtitles);
        };

        loadSubtitles();
    }, []);

    const handleProgress = ({ playedSeconds }) => {
        if (!subtitlesText.length) return;

        const activeSubtitle = subtitlesText.find(
            (sub) => playedSeconds >= sub.start && playedSeconds <= sub.end
        );

        setCurrentSubtitle(activeSubtitle ? activeSubtitle.text : "");
    };

    if (!videoSrc) {
        return <p className="text-center text-gray-600">No video selected.</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center relative">
            <div className="w-full max-w-xl shadow-lg rounded-lg overflow-hidden relative">
                <ReactPlayer
                    ref={playerRef}
                    url={videoSrc}
                    controls
                    width="100%"
                    height="auto"
                    playing={false}
                    onProgress={handleProgress}
                />

                {currentSubtitle && (
                    <div className="absolute bottom-20 w-full text-center bg-black/60 text-white text-lg px-4 py-2 rounded-md">
                        {currentSubtitle}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
