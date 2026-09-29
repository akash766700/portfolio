"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import {
  ArrowOutward as ArrowOutwardIcon,
  GitHub as GitHubIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import { Colors } from "@/utils/enum";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  accentColor: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "1",
    title: "HireLynx Enterprise Platform",
    category: "Fullstack SaaS & ATS",
    description:
      "Enterprise recruitment and applicant tracking ecosystem with real-time analytics, automated candidate pipelines, and custom billing management.",
    tags: ["Next.js 15", "TypeScript", "Node.js", "PostgreSQL", "MUI"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: true,
    accentColor: "#61DAFB",
  },
  {
    id: "2",
    title: "Sylva Procedural World",
    category: "Interactive 3D / WebGL",
    description:
      "A real-time procedural living world with custom GLSL shaders, dynamic moss growth, interactive flora, and reactive pointer illumination.",
    tags: ["Three.js", "GLSL Shaders", "React Three Fiber", "WebAudio"],
    liveUrl: "https://threeui.com",
    githubUrl: "https://github.com",
    featured: true,
    accentColor: "#CEF2A8",
  },
  {
    id: "3",
    title: "Quantum Commerce Suite",
    category: "High-Conversion E-commerce",
    description:
      "Headless e-commerce storefront delivering sub-second page transitions, dynamic cart drawers, and custom checkout flows.",
    tags: ["Next.js", "Shopify Storefront API", "TailwindCSS", "Stripe"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: false,
    accentColor: "#E1DCC9",
  },
  {
    id: "4",
    title: "Aura Creative Studio",
    category: "Design System & Web Experience",
    description:
      "Award-winning agency website with kinetic typography, smooth momentum scrolling, and custom fluid SVG cursor interactions.",
    tags: ["React", "GSAP ScrollTrigger", "Lenis", "Framer Motion"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    featured: false,
    accentColor: "#9E9EA7",
  },
];

export default function WorksSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Box
      component="section"
      id="works"
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: Colors.BACKGROUND,
        color: Colors.WHITE,
        py: { xs: 12, md: 16 },
        overflow: "hidden",
      }}
    >
      {/* ── Ambient Studio Glows ── */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(97, 218, 251, 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(206, 242, 168, 0.05) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        {/* ── Header Title & Lede ── */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.2,
              px: 2,
              py: 0.6,
              borderRadius: "999px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#61DAFB",
                boxShadow: "0 0 10px #61DAFB",
              }}
            />
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: Colors.HEADING,
              }}
            >
              Selected Portfolio
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.2rem" },
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-titillium-web), sans-serif",
              maxWidth: 800,
            }}
          >
            Featured Engineering &amp;{" "}
            <Box
              component="span"
              sx={{
                color: "#61DAFB",
                textShadow: "0 0 40px rgba(97, 218, 251, 0.3)",
              }}
            >
              Creative Works.
            </Box>
          </Typography>
          <Typography
            sx={{
              mt: 2,
              fontSize: "1.05rem",
              color: Colors.GREY,
              maxWidth: 580,
              lineHeight: 1.6,
            }}
          >
            A curated collection of web applications, custom interactive
            architectures, and high-performance digital products engineered for
            production.
          </Typography>
        </Box>

        {/* ── Project Showcase Grid ── */}
        <Grid container spacing={4}>
          {PROJECTS.map((project, idx) => {
            const isHovered = hoveredId === project.id;
            return (
              <Grid size={{ xs: 12, md: 6 }} key={project.id}>
                <Box
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  sx={{
                    position: "relative",
                    borderRadius: "24px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: isHovered
                      ? `1px solid ${project.accentColor}55`
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    p: { xs: 3.5, md: 5 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backdropFilter: "blur(14px)",
                    transition:
                      "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease",
                    transform: isHovered ? "translateY(-6px)" : "none",
                    boxShadow: isHovered
                      ? `0 20px 40px -15px ${project.accentColor}22`
                      : "0 10px 30px -10px rgba(0,0,0,0.5)",
                  }}
                >
                  <Box>
                    {/* Top Row: Category + Index */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: project.accentColor,
                        }}
                      >
                        {project.category}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: "rgba(255, 255, 255, 0.3)",
                          fontFamily: "monospace",
                        }}
                      >
                        0{idx + 1}
                      </Typography>
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { xs: "1.5rem", md: "1.9rem" },
                        fontWeight: 600,
                        color: Colors.WHITE,
                        mb: 1.8,
                        lineHeight: 1.2,
                        transition: "color 0.3s ease",
                      }}
                    >
                      {project.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      sx={{
                        fontSize: "0.95rem",
                        color: Colors.GREY,
                        lineHeight: 1.65,
                        mb: 3,
                      }}
                    >
                      {project.description}
                    </Typography>
                  </Box>

                  <Box>
                    {/* Tech Stack Tags */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 3.5,
                      }}
                    >
                      {project.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            color: Colors.SILVER,
                            fontSize: "0.75rem",
                            borderRadius: "8px",
                          }}
                        />
                      ))}
                    </Box>

                    {/* Actions */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pt: 2,
                        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <Button
                        component="a"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        endIcon={<ArrowOutwardIcon />}
                        sx={{
                          color: Colors.WHITE,
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          px: 0,
                          "&:hover": {
                            color: project.accentColor,
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        View Project
                      </Button>

                      {project.githubUrl && (
                        <IconButton
                          component="a"
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          size="small"
                          sx={{
                            color: Colors.GREY,
                            "&:hover": {
                              color: Colors.WHITE,
                            },
                          }}
                        >
                          <GitHubIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
