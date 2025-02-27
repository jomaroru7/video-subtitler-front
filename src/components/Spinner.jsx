import { ClipLoader } from "react-spinners";

const Spinner = ({ loading = true, size = 100, color = "#155dfc" }) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <ClipLoader color={color} loading={loading} size={size} />
    </div>
  );
};

export default Spinner;

