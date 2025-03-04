import { render, screen } from "@testing-library/react";
import VideoPlayer from "../../../components/videoPlayer/VideoPlayer";
import useFileStore from "../../../stores/fileStore";

// Mock Zustand store
vi.mock("../../../stores/fileStore", () => ({
  default: vi.fn(() => ({
    file: null,
    videoUrl: "https://example.com/video.mp4", // Provide a mock video URL
    subtitles: "",
    subtitlesArray: [],
    currentSubtitle: null,
    videoIsPlaying: false,
    setSubtitlesArray: vi.fn(),
    setCurrentSubtitle: vi.fn(),
    setVideoIsPlaying: vi.fn(),
  })),
}));

test("renders the video player when a video URL is provided", () => {
  render(<VideoPlayer />);
  expect(screen.getByTestId("video-player")).toBeInTheDocument();
});

test("renders message when no video is selected", () => {
  // Mock Zustand store to return null file and null videoUrl
  useFileStore.mockReturnValue({
    file: null,
    videoUrl: null, // No video URL
    subtitles: "",
    subtitlesArray: [],
    currentSubtitle: null,
    videoIsPlaying: false,
    setSubtitlesArray: vi.fn(),
    setCurrentSubtitle: vi.fn(),
    setVideoIsPlaying: vi.fn(),
  });

  render(<VideoPlayer />);
  expect(screen.getByText("Video no seleccionado.")).toBeInTheDocument();
});
