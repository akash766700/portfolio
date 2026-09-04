"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
    },
  },
});

export default theme;
