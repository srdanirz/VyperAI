import * as React from "react";
import TextField from "@mui/material/TextField";
import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/system";

export default function Input({
  inputType,
  icon,
  name,
  value,
  onChange,
  label,
  helperText,
  error,
  touched,
  onBlur,
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const outerTheme = useTheme();

  const borderColor = error && touched ? "#CB4335" : "#E0E3E7";
  const backgroundColor = "transparent";

  const customTheme = (outerTheme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": borderColor,
              "--TextField-brandBorderHoverColor":
                error && touched ? "#922B21" : "#B2BAC2",
              "--TextField-brandBorderFocusedColor":
                error && touched ? "#A93226" : "#6F7E8C",
              backgroundColor: backgroundColor, // Add background color
              "& label.Mui-focused": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: "var(--TextField-brandBorderColor)",
            },
            root: {
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderHoverColor)",
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
      },
    });

  return (
    <ThemeProvider theme={customTheme(outerTheme)}>
      <TextField
        label={label}
        name={name}
        type={
          inputType === "password"
            ? showPassword
              ? "text"
              : "password"
            : inputType
        }
        value={value}
        onChange={onChange}
        autoComplete="on"
        fullWidth
        error={touched && error}
        onBlur={onBlur}
        helperText={error && touched && helperText}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">{icon}</InputAdornment>
          ) : null,
          endAdornment: inputType === "password" && (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </ThemeProvider>
  );
}
