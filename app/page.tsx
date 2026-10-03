"use client";

import React, { useState, useCallback } from "react";
import { Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Navbar } from "@/components/widgets/Navbar";

import { HeroSection, IntroStage } from "@/components/layouts/Home/HeroSection";
import { Colors } from "@/utils/enum";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  palette: {
    mode: "dark",
    background: {
      default: Colors.BACKGROUND,
      paper: Colors.PAPER,
    },
    primary: {
      main: Colors.WHITE,
    },
    text: {
      primary: Colors.WHITE,
      secondary: Colors.GREY,
    },
  },
});

export default function Home() {
  const [isNavVisible, setIsNavVisible] = useState(false);

  const handleStageChange = useCallback((stage: IntroStage) => {
    if (stage === "hero-settle") {
      setIsNavVisible(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: Colors.BACKGROUND,
          color: Colors.WHITE,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            opacity: isNavVisible ? 1 : 0,
            transform: isNavVisible ? "none" : "translateY(-20px)",
            transition:
              "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: isNavVisible ? "auto" : "none",
          }}
        >
          <Navbar />
        </Box>

        <HeroSection onStageChange={handleStageChange} />
      </Box>
    </ThemeProvider>
  );
}
