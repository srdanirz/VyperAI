import { FadeLoader } from "react-spinners";

const Loader = ({ isLoading }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "9999",
      }}
    >
      <FadeLoader loading={isLoading} color="#38ff9b" size={150} />
    </div>
  );
};

export default Loader;
