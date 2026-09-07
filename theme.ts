"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  palette: {
    mode: "dark",
    background: {
      default: "#0A0A0C",
      paper: "#121216",
    },
    primary: {
      main: "#FFFFFF",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#9E9EA7",
    },
  },
});

export default theme;
