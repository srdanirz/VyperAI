import * as React from "react";
import Dialog from "@mui/material/Dialog";
import { twMerge } from "tailwind-merge";

export default function CustomisedDialog({
  children,
  icon,
  title,
  className,
  buttonText,
  leftBtnStyle,
  rightBtnStyle,
  rightBtnText = "Create",
  leftBtnText = "Cancel",
  open = false,
  handleClose,
  handleSubmit,
  openModal,
}) {
  return (
    <React.Fragment>
      {(icon || buttonText) && (
        <button
          name="delete"
          className={`p-2 flex justify-center items-center ${className}`}
          onClick={openModal}
        >
          <img src={icon} alt="" />
          {buttonText}
        </button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        style={{ backdropFilter: "blur(2px)" }}
        PaperProps={{ style: { backgroundColor: "transparent" } }}
      >
        <div className="inset-0 overflow-hidden bg-gradient-to-r from-white via-[#38ff9b] to-[#38ff9b] p-[1px] rounded-[9px] flex w-full">
          <div className="bg-[#14141F] pt-10 px-7 rounded-[9px] w-[1005px] h-[589px]">
            <span className="text-white font-medium ml-5 text-[28px]">
              {title || "Specify Modal Title"}
            </span>

            {children}

            <div className="w-full justify-between -mt-7 flex px-7">
              <button
                onClick={handleClose}
                autoFocus
                className={twMerge(
                  "inset-0 bg-gradient-to-r h-9 from-white via-teal-400 to-emerald-600 p-[1px] rounded-[9px]",
                )}
              >
                <div
                  className={twMerge(
                    "bg-[#14141F] rounded-[9px] px-9 h-full text-white flex items-center",
                    leftBtnStyle,
                  )}
                >
                  {leftBtnText}
                </div>
              </button>

              <button
                onClick={handleSubmit}
                autoFocus
                className={twMerge(
                  "bg-green text-white px-10 py-2 mt-1 rounded-[9px]",
                  rightBtnStyle,
                )}
              >
                {rightBtnText}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
}
