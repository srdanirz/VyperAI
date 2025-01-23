import Modal from "react-modal";
import { twMerge } from "tailwind-merge";

const customStyles = {
  backdropFilter: "blur(10px)",
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    background: 'rgba(0, 0, 0, 0.008)',
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0px",
    border: "0.5px solid #41494F",
    width: "fit-content",
    background: "",
    zIndex: "1000",
  },
};

Modal.setAppElement("#root");

const ModalContainer = ({
  children,
  title,
  leftBtnStyle,
  rightBtnStyle = "Delete",
  rightBtnText = "Create",
  leftBtnText = "Cancel",
  description,
  open = false,
  handleClose,
  handleSubmit,
}) => {
  return (
    <Modal isOpen={open} onRequestClose={handleClose} style={customStyles}>
        <div style={{background: 'red !important'}} className="bg-[#14141F] h-full min-w-[550px] px-10  p-6 rounded-[9px]">
          <div className="text-white font-medium text-[28px]">{title}</div>
          <div className="w-[500px] text-white pt-2">{description}</div>
          <div className="custom-dashboard-chard-gradient mt-5">{children}</div>
          <div className="flex justify-between items-center ">
            <button
              onClick={handleClose}
              autoFocus
              className={twMerge(
                "inset-0 border-gray-400 border-[1px] w-[100px] text-white h-9 from-white via-teal-400 to-emerald-600 p-[.9px] rounded-[9px]",
              )}
            >
              {leftBtnText}

            </button>

            <button
              onClick={handleSubmit}
              autoFocus
              className={twMerge(
                " text-[#FFFFFF] px-10 py-2 mt-1 rounded-[9px]",
                rightBtnStyle === "Delete"
                  ? "bg-[#E74C3C] text-white"
                  : "bg-[#38ff9b] text-white",
              )}
            >
              {rightBtnText}
            </button>
          </div>
      </div>
    </Modal>
  );
};

export default ModalContainer;
