import { render, screen } from "@testing-library/react";
import UploadVideoForm from "../../../components/uploadVideoForm/UploadVideoForm";
import UploadFile from "../../../components/uploadVideoForm/UploadFile";

// Mock the UploadFile component
vi.mock("../../../components/uploadVideoForm/UploadFile", () => ({
  default: () => <div data-testid="upload-file-mock" />,
}));

test("renders UploadVideoForm with UploadFile component", () => {
  render(<UploadVideoForm />);
  
  expect(screen.getByTestId("upload-file-mock")).toBeInTheDocument();
});
