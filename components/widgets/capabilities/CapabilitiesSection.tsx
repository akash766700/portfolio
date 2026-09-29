"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
} from "@mui/material";
import {
  Code as CodeIcon,
  Storage as StorageIcon,
  ShoppingBag as ShoppingBagIcon,
  Terminal as TerminalIcon,
} from "@mui/icons-material";
import { Colors } from "@/utils/enum";
import { PORTFOLIO_DATA } from "@/assets/generic-data";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Frontend & Frameworks": <CodeIcon sx={{ fontSize: 24, color: "#61DAFB" }} />,
  "API & Backend Integration": <StorageIcon sx={{ fontSize: 24, color: "#CEF2A8" }} />,
  "CMS & E-commerce": <ShoppingBagIcon sx={{ fontSize: 24, color: "#61DAFB" }} />,
  "Workflow & Deployment": <TerminalIcon sx={{ fontSize: 24, color: "#CEF2A8" }} />,
};

export default function CapabilitiesSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const categories = PORTFOLIO_DATA.skillCategories || [];

  return (
    <Box
      component="section"
      id="capabilities"
      sx={{
        position: "relative",
        minHeight: "80vh",
        backgroundColor: Colors.BACKGROUND,
        color: Colors.WHITE,
        py: { xs: 12, md: 16 },
        overflow: "hidden",
      }}
    >
      {/* ── Background Glow ── */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: 320, md: 680 },
          height: { xs: 320, md: 680 },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(97, 218, 251, 0.05) 0%, rgba(206, 242, 168, 0.03) 40%, transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <Box sx={{ maxWidth: 720, mb: { xs: 6, md: 9 } }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.2,
              px: 2,
              py: 0.6,
              borderRadius: "20px",
              backgroundColor: "rgba(97, 218, 251, 0.06)",
              border: "1px solid rgba(97, 218, 251, 0.2)",
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#61DAFB",
                boxShadow: "0 0 8px #61DAFB",
              }}
            />
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "#61DAFB",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              TECHNICAL CAPABILITIES
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
              mb: 2,
            }}
          >
            Full-Spectrum{" "}
            <Box
              component="span"
              sx={{
                color: "#CEF2A8",
                textShadow: "0 0 35px rgba(206, 242, 168, 0.3)",
              }}
            >
              Engineering
            </Box>
            .
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              color: Colors.GREY,
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            A cohesive stack engineered for speed, high-conversion visual design,
            robust state orchestration, and production stability.
          </Typography>
        </Box>

        {/* ── Category Cards Grid ── */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3.5,
          }}
        >
          {categories.map((cat, idx) => {
            const isHovered = hoveredIdx === idx;
            const accent = idx % 2 === 0 ? "#61DAFB" : "#CEF2A8";

            return (
              <Box key={cat.category}>
                <Box
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  sx={{
                    height: "100%",
                    p: { xs: 3, md: 3.8 },
                    borderRadius: "20px",
                    backgroundColor: "rgba(18, 18, 22, 0.65)",
                    backdropFilter: "blur(16px)",
                    border: `1px solid ${
                      isHovered ? accent : "rgba(255, 255, 255, 0.07)"
                    }`,
                    boxShadow: isHovered
                      ? `0 12px 35px -8px ${accent}25`
                      : "0 8px 24px -10px rgba(0,0,0,0.5)",
                    transform: isHovered ? "translateY(-4px)" : "none",
                    transition:
                      "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Category Header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        backgroundColor: `${accent}12`,
                        border: `1px solid ${accent}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {CATEGORY_ICONS[cat.category] || (
                        <CodeIcon sx={{ fontSize: 22, color: accent }} />
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: Colors.GREY,
                        fontFamily: "monospace",
                      }}
                    >
                      0{idx + 1}
                    </Typography>
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: "1.18rem",
                      fontWeight: 700,
                      color: Colors.WHITE,
                      mb: 2.2,
                      fontFamily: "var(--font-titillium-web), sans-serif",
                    }}
                  >
                    {cat.category}
                  </Typography>

                  {/* Skills Chips */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      mt: "auto",
                    }}
                  >
                    {cat.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          color: isHovered ? Colors.WHITE : "rgba(255,255,255,0.75)",
                          backgroundColor: isHovered
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(255, 255, 255, 0.03)",
                          border: `1px solid ${
                            isHovered ? `${accent}40` : "rgba(255, 255, 255, 0.08)"
                          }`,
                          borderRadius: "8px",
                          transition: "all 0.25s ease",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
