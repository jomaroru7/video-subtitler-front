import { render, screen, fireEvent } from "@testing-library/react";
import FileInput from "../../../components/uploadVideoForm/FileInput";
import useFileStore from "../../../stores/fileStore";

// Mock Zustand store
vi.mock("../../../stores/fileStore", () => ({
  default: vi.fn(() => ({
    setFile: vi.fn(),
  })),
}));

test("renders file input", () => {
  render(<FileInput />);
  
  const fileInput = screen.getByTestId("file-input");

  expect(fileInput).toBeInTheDocument();
});

test("calls setFile when a file is selected", () => {
  const setFileMock = vi.fn();
  useFileStore.mockReturnValue({ setFile: setFileMock });

  render(<FileInput />);
  
  const fileInput = screen.getByTestId("file-input");
  const testFile = new File(["content"], "test.mp4", { type: "video/mp4" });

  fireEvent.change(fileInput, { target: { files: [testFile] } });

  expect(setFileMock).toHaveBeenCalledWith(testFile);
});
