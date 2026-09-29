"use client";

import React from "react";
import { Box, Container, Typography, IconButton } from "@mui/material";
import {
  KeyboardArrowUp as ArrowUpIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import { Colors } from "@/utils/enum";
import { PORTFOLIO_DATA } from "@/assets/generic-data";

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#070709",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        py: { xs: 5, md: 6 },
        position: "relative",
        zIndex: 2,
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          {/* Brand & Status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.1rem",
                letterSpacing: "0.08em",
                color: Colors.WHITE,
                fontFamily: "var(--font-titillium-web), sans-serif",
              }}
            >
              AKASH GUPTA
            </Typography>
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              }}
            />
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.8,
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: "#CEF2A8",
                  boxShadow: "0 0 8px #CEF2A8",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: Colors.GREY,
                  letterSpacing: "0.02em",
                }}
              >
                Available for New Projects
              </Typography>
            </Box>
          </Box>

          {/* Socials & Copyright */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.78rem",
                color: "rgba(255, 255, 255, 0.4)",
              }}
            >
              © {new Date().getFullYear()} All rights reserved. Crafted with Three.js & Next.js.
            </Typography>

            <IconButton
              onClick={scrollToTop}
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: Colors.WHITE,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "rgba(97, 218, 251, 0.15)",
                  color: "#61DAFB",
                  borderColor: "#61DAFB",
                },
              }}
            >
              <ArrowUpIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
