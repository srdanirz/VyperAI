import React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const CustomizedTooltips = ({ title, placement, children }) => {
  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip
      arrow
      placement={placement}
      {...props}
      classes={{ popper: className }}
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: title === "Logout" ? "red" : "#38ff9b",
      color: title === "Logout" ? "white" : "rgba(0, 0, 0, 0.87)",
      padding: "px",
      paddingLeft: "20px",
      paddingRight: "20px",
      borderRadius: "9px",
      fontSize: theme.typography.pxToRem(12),
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: title === "Logout" ? "red" : "#38ff9b",
    },
  }));

  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <Typography color="inherit">{title}</Typography>
        </React.Fragment>
      }
    >
      {children}
    </HtmlTooltip>
  );
};

export default CustomizedTooltips;
