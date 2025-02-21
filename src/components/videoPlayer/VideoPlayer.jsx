import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import useFileStore from "../../stores/fileStore";

const VideoPlayer = () => {
    const { file, videoUrl } = useFileStore();
    const [videoSrc, setVideoSrc] = useState(null);
    const [vttSubtitles, setVttSubtitles] = useState(null);

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
        const loadSubtitles = async () => {
            
            try {
                const response = await fetch("/media/cajon_de_sastre.srt");

                if (!response.ok) {
                    throw new Error(`Failed to load subtitles: ${response.statusText}`);
                }

                const srtText = await response.text();

                const vttText = "WEBVTT\n\n" + srtText.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");

                const vttBlob = new Blob([vttText], { type: "text/vtt" });
                const vttBlobUrl = URL.createObjectURL(vttBlob);
                setVttSubtitles(vttBlobUrl);

            } catch (error) {
                console.error("[ERROR] Subtitles loading failed:", error);
            }
        };

        loadSubtitles();
    }, []);

    if (!videoSrc) {
        return <p className="text-center text-gray-600">No video selected.</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl shadow-lg rounded-lg overflow-hidden">
                <ReactPlayer
                    url={videoSrc}
                    controls
                    width="100%"
                    height="auto"
                    playing={false}
                    config={{
                        file: {
                            attributes: { crossOrigin: "anonymous" },
                            tracks: vttSubtitles
                                ? [
                                      {
                                          kind: "subtitles",
                                          src: vttSubtitles,
                                          srcLang: "en",
                                          label: "English",
                                          default: true,
                                      },
                                  ]
                                : [],
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default VideoPlayer;
