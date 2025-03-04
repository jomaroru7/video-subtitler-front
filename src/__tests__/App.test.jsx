import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, beforeEach, vi, expect } from "vitest";
import App from "../App";

// --- Mock child components ---
vi.mock("../components/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock("../components/guide/Guide", () => ({
  default: () => <div data-testid="guide">Guide</div>,
}));

vi.mock("../components/Spinner", () => ({
  default: () => <div data-testid="spinner">Spinner</div>,
}));

vi.mock("../components/videoPlayer/VideoPlayer", () => ({
  default: () => <div data-testid="video-player">VideoPlayerComponent</div>,
}));

vi.mock("../components/subtitleVideoForm/SelectSubtitlesStyle", () => ({
  default: () => <div data-testid="select-subtitles-style">SelectSubtitlesStyle</div>,
}));

vi.mock("../components/uploadVideoForm/UploadVideoForm", () => ({
  default: () => <div data-testid="upload-video-form">UploadVideoForm</div>,
}));

// --- Mock the file store ---
vi.mock("../stores/fileStore", () => {
  return {
    default: vi.fn(),
  };
});

import useFileStore from "../stores/fileStore";

describe("App Component", () => {
  beforeEach(() => {
    // Default state: no file, no subtitles, not uploading
    useFileStore.mockReturnValue({
      file: null,
      subtitles: null,
      uploading: false,
    });
  });

  test("renders Header and Guide regardless of store state", () => {
    render(<App />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("guide")).toBeInTheDocument();
  });

  test("renders UploadVideoForm when player is not ready", () => {
    render(<App />);
    expect(screen.getByTestId("upload-video-form")).toBeInTheDocument();
    // Video player and subtitle selection should not be rendered.
    expect(screen.queryByTestId("video-player")).toBeNull();
    expect(screen.queryByTestId("select-subtitles-style")).toBeNull();
  });

  test("renders Spinner when uploading", () => {
    // Set uploading state to true
    useFileStore.mockReturnValue({
      file: null,
      subtitles: null,
      uploading: true,
    });
    render(<App />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("renders VideoPlayerComponent and SelectSubtitlesStyle when file and subtitles exist", () => {
    // Set player-ready state: file and subtitles exist, not uploading
    useFileStore.mockReturnValue({
      file: { name: "video.mp4" },
      subtitles: [{ id: 1, text: "Subtitle text" }],
      uploading: false,
    });
    render(<App />);
    expect(screen.getByTestId("video-player")).toBeInTheDocument();
    expect(screen.getByTestId("select-subtitles-style")).toBeInTheDocument();
    // UploadVideoForm should not render when player is ready.
    expect(screen.queryByTestId("upload-video-form")).toBeNull();
  });
});
