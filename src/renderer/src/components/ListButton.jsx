import {
  Badge,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Tooltip from "./CustomizedTooltips.jsx";

function ListButton({
  to,
  inactiveIcon,
  activeIcon,
  open,
  location,
  primaryItemText,
  secondaryItemText,
  notification,
  onClick,
}) {
  const isSelected = location.pathname === to;

  return (
    <NavLink to={to} onClick={onClick}>
      <Tooltip
        title={primaryItemText}
        placement="right"
        arrow
        sx={{
          display: open ? "block" : "none",
        }}
      >
        <ListItemButton
          sx={{
            p: 1.5,
            borderRadius: 2,
            marginBottom: 0.5,
            alignItems: "center",
            justifyContent: "center",
            transition: 'all 0.2s ease',
            backgroundColor: 'transparent',
            "&.Mui-selected": {
              backgroundColor: "#1B1B26",
              color: "#ffffff",
              "& img": {
                filter: "brightness(1)",
              }
            },
            "&:hover": {
              backgroundColor: "#2A2A40",
              color: "#ffffff",
              "& img": {
                filter: "brightness(1)",
              }
            },
            "& img": {
              filter: "brightness(0.7)",
              transition: 'all 0.2s ease'
            }
          }}
          selected={isSelected}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              color: 'inherit'
            }}
          >
            <Badge
              badgeContent={notification}
              color="warning"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '10px',
                  minWidth: '18px',
                  height: '18px',
                }
              }}
            >
              {typeof activeIcon === 'object' ? 
                activeIcon : 
                <img src={isSelected ? activeIcon : inactiveIcon} alt="" />
              }
            </Badge>
          </ListItemIcon>
          <div className="lg:hidden md:hidden flex text-white">
            <ListItemText
              primary={primaryItemText}
              secondary={secondaryItemText}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </div>
        </ListItemButton>
      </Tooltip>
    </NavLink>
  );
}

export default ListButton;