"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
} from "@mui/material";
import {
  Download as DownloadIcon,
  CheckCircleOutlined as CheckIcon,
  Bolt as BoltIcon,
} from "@mui/icons-material";
import { Colors } from "@/utils/enum";
import { PORTFOLIO_DATA } from "@/assets/generic-data";

export default function AboutSection() {
  const { personal, contact } = PORTFOLIO_DATA;

  const HIGHLIGHTS = [
    "Production-grade Next.js & React Architectures",
    "Interactive 3D WebGL / Three.js & GLSL Shaders",
    "High-Performance 60/120fps Animations with GSAP",
    "Full-Stack API Integrations & State Management",
    "Custom CMS, WordPress, Shopify & Webflow Engineering",
    "Obsessive UI/UX Quality & Responsive Accessibility",
  ];

  return (
    <Box
      component="section"
      id="about"
      sx={{
        position: "relative",
        minHeight: "80vh",
        backgroundColor: Colors.BACKGROUND,
        color: Colors.WHITE,
        py: { xs: 12, md: 16 },
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.15fr 0.85fr" },
            gap: { xs: 6, lg: 10 },
            alignItems: "center",
          }}
        >
          {/* ── Left Column: Story & Philosophy ── */}
          <Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.2,
                px: 2,
                py: 0.6,
                borderRadius: "20px",
                backgroundColor: "rgba(206, 242, 168, 0.08)",
                border: "1px solid rgba(206, 242, 168, 0.25)",
                mb: 2.5,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#CEF2A8",
                  boxShadow: "0 0 8px #CEF2A8",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#CEF2A8",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                ABOUT THE DEVELOPER
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2.2rem", sm: "3rem", md: "3.6rem" },
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                fontFamily: "var(--font-titillium-web), sans-serif",
                mb: 3,
              }}
            >
              Transforming Ideas Into{" "}
              <Box
                component="span"
                sx={{
                  color: "#61DAFB",
                  textShadow: "0 0 35px rgba(97, 218, 251, 0.35)",
                }}
              >
                Living Software
              </Box>
              .
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "0.98rem", md: "1.08rem" },
                color: "rgba(255, 255, 255, 0.8)",
                lineHeight: 1.75,
                mb: 2.5,
                fontWeight: 300,
              }}
            >
              {personal.about}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "0.92rem", md: "1rem" },
                color: Colors.GREY,
                lineHeight: 1.7,
                mb: 4,
                fontWeight: 300,
              }}
            >
              {personal.tagline} With deep attention to micro-interactions, layout precision, and performance optimization, every codebase is treated like high-precision craftsmanship.
            </Typography>

            {/* Bullet Highlights */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 1.6,
                mb: 4.5,
              }}
            >
              {HIGHLIGHTS.map((item) => (
                <Box
                  key={item}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                  }}
                >
                  <CheckIcon sx={{ fontSize: 18, color: "#CEF2A8" }} />
                  <Typography
                    sx={{
                      fontSize: "0.88rem",
                      color: "rgba(255, 255, 255, 0.85)",
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Actions */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Button
                variant="contained"
                href={contact.resumeUrl || "#"}
                target="_blank"
                rel="noreferrer"
                startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
                sx={{
                  backgroundColor: "#61DAFB",
                  color: "#0A0A0C",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  letterSpacing: "0.04em",
                  px: 3,
                  py: 1.3,
                  borderRadius: "24px",
                  textTransform: "none",
                  boxShadow: "0 0 25px rgba(97, 218, 251, 0.3)",
                  "&:hover": {
                    backgroundColor: "#50c4e4",
                    boxShadow: "0 0 35px rgba(97, 218, 251, 0.5)",
                  },
                }}
              >
                Download Resume
              </Button>

              <Button
                variant="outlined"
                href="#contact"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: Colors.WHITE,
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  px: 3,
                  py: 1.3,
                  borderRadius: "24px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#CEF2A8",
                    color: "#CEF2A8",
                    backgroundColor: "rgba(206, 242, 168, 0.05)",
                  },
                }}
              >
                Get in Touch
              </Button>
            </Box>
          </Box>

          {/* ── Right Column: Interactive Stats Bento ── */}
          <Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2.5,
              }}
            >
              {[
                { number: "5+", label: "Years Experience", color: "#61DAFB" },
                { number: "50+", label: "Projects Shipped", color: "#CEF2A8" },
                { number: "100%", label: "Responsive & Tested", color: "#CEF2A8" },
                { number: "< 0.5s", label: "Optimized LCP / FCP", color: "#61DAFB" },
              ].map((stat, i) => (
                <Box
                  key={stat.label}
                  sx={{
                    p: { xs: 3, md: 3.5 },
                    borderRadius: "20px",
                    backgroundColor: "rgba(18, 18, 22, 0.65)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    transition: "transform 0.3s ease, border-color 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: stat.color,
                      boxShadow: `0 12px 30px -10px ${stat.color}25`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    <BoltIcon sx={{ fontSize: 18, color: stat.color }} />
                    <Typography
                      sx={{
                        fontSize: { xs: "2rem", md: "2.5rem" },
                        fontWeight: 800,
                        color: stat.color,
                        fontFamily: "var(--font-titillium-web), sans-serif",
                        lineHeight: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      color: Colors.GREY,
                      fontWeight: 400,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
