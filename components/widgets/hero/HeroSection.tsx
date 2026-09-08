"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Container } from "@mui/material";
import { Colors } from "@/utils/enum";
import { SpiderHeroScene } from "@/components/3D";
import PaperCard from "./PaperCard";
import LiquidButton from "./LiquidButton";
import BrandOrbLoader from "@/components/widgets/BrandOrbLoader";

export type IntroStage = "loader" | "two-cards" | "spider-huge" | "hero-settle";

interface HeroSectionProps {
  onStageChange?: (stage: IntroStage) => void;
}

export default function HeroSection({ onStageChange }: HeroSectionProps) {
  // Sequence: "loader" -> "two-cards" -> "spider-huge" -> "hero-settle"
  const [stage, setStage] = useState<IntroStage>("loader");
  const [loaderMounted, setLoaderMounted] = useState(true);

  // Notify parent of stage changes
  useEffect(() => {
    onStageChange?.(stage);
  }, [stage, onStageChange]);

  // Handle stage transitions
  useEffect(() => {
    if (stage === "two-cards") {
      // Unmount loader after fade out
      const unmountTimer = setTimeout(() => {
        setLoaderMounted(false);
      }, 700);

      // Show the 2 cards for ~1.4s, then spider emerges and zooms HUGE
      const hugeTimer = setTimeout(() => {
        setStage("spider-huge");
      }, 1500);

      return () => {
        clearTimeout(unmountTimer);
        clearTimeout(hugeTimer);
      };
    }

    if (stage === "spider-huge") {
      // Spider stays huge for ~1.5s, then scales down and settles into hero
      const settleTimer = setTimeout(() => {
        setStage("hero-settle");
      }, 1500);

      return () => clearTimeout(settleTimer);
    }
  }, [stage]);

  const handleLoaderComplete = () => {
    setStage("two-cards");
  };

  const isLoader = stage === "loader";
  const isTwoCards = stage === "two-cards";
  const isSpiderHuge = stage === "spider-huge";
  const isHeroSettle = stage === "hero-settle";

  return (
    <Box
      component="section"
      id="hero"
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        backgroundColor: Colors.BACKGROUND,
        color: Colors.WHITE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pt: { xs: 8, md: 10 },
        pb: { xs: 6, md: 8 },
        isolation: "isolate",
      }}
    >
      {/* ── 1. Fullscreen React Orb Loader with Percentage Counter ── */}
      {loaderMounted && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            opacity: isLoader ? 1 : 0,
            pointerEvents: isLoader ? "auto" : "none",
            transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <BrandOrbLoader
            onComplete={handleLoaderComplete}
            isExiting={!isLoader}
          />
        </Box>
      )}

      {/* ── Ambient Lighting Floor ── */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background: `
            radial-gradient(55% 45% at 50% 55%, rgba(97, 218, 251, 0.09) 0%, rgba(97, 218, 251, 0) 70%),
            radial-gradient(60% 40% at 50% 95%, rgba(206, 242, 168, 0.08) 0%, rgba(206, 242, 168, 0) 65%),
            radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 40%)
          `,
          opacity: isHeroSettle ? 1 : 0.4,
          transition: "opacity 1.2s ease",
        }}
      />

      {/* ── Architectural Grid Line Guides (Subtle) ── */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-around",
          opacity: isHeroSettle ? 0.035 : 0,
          transition: "opacity 1.4s ease 0.4s",
        }}
      >
        <Box sx={{ width: "1px", height: "100%", background: "#FFFFFF" }} />
        <Box sx={{ width: "1px", height: "100%", background: "#FFFFFF" }} />
        <Box sx={{ width: "1px", height: "100%", background: "#FFFFFF" }} />
        <Box sx={{ width: "1px", height: "100%", background: "#FFFFFF" }} />
      </Box>

      {/* ── Giant Ghost Typography Watermark ── */}
      <Typography
        variant="h1"
        sx={{
          position: "absolute",
          bottom: { xs: "4%", md: "2%" },
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: { xs: "16vw", md: "18vw" },
          fontWeight: 800,
          lineHeight: 0.8,
          letterSpacing: "0.08em",
          color: "rgba(255, 255, 255, 0.022)",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 1,
          fontFamily: "var(--font-titillium-web), sans-serif",
          transition: "opacity 1.4s ease, transform 1.4s ease",
          opacity: isHeroSettle ? 1 : 0,
        }}
      >
        AKASH GUPTA
      </Typography>

      {/* ── FULLSCREEN SPIDER OVERLAY DURING HUGE ZOOM ── */}
      {isSpiderHuge && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeInSpider 0.4s ease-out forwards",
            "@keyframes fadeInSpider": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          {/* Ambient center flare */}
          <Box
            sx={{
              position: "absolute",
              width: "70vw",
              height: "70vh",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(97, 218, 251, 0.22) 0%, rgba(206, 242, 168, 0.1) 40%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <SpiderHeroScene stage="huge" />
        </Box>
      )}

      {/* ── MAIN CONTAINER (Holds 2 Cards & Center Settle Grid) ── */}
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: isLoader ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.1fr 1.2fr 1fr" },
            alignItems: "center",
            gap: { xs: 4, md: 3, lg: 3 },
            minHeight: { xs: "auto", md: "82vh" },
          }}
        >
          {/* ════════════ LEFT COLUMN: Copy & Left 3D Paper ════════════ */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              zIndex: 4,
              order: { xs: 2, lg: 1 },
              // Choreography transform:
              // - In two-cards: Sits shifted towards center
              // - In spider-huge: Slides far left off-screen & disappears
              // - In hero-settle: Settles into normal position
              transform: isTwoCards
                ? { xs: "none", lg: "translateX(80px) scale(1.02)" }
                : isSpiderHuge
                  ? "translateX(-150vw) scale(0.65)"
                  : "none",
              opacity: isSpiderHuge ? 0 : 1,
              transition:
                "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Headline, Subtitle, CTA & Stats (Reveals ONLY when Hero Settles) */}
            <Box
              sx={{
                display: isHeroSettle ? "flex" : "none",
                flexDirection: "column",
                gap: 2.4,
                opacity: isHeroSettle ? 1 : 0,
                transform: isHeroSettle ? "none" : "translateY(-30px)",
                transition:
                  "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                pointerEvents: isHeroSettle ? "auto" : "none",
              }}
            >
              {/* Status Live Tag */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.2,
                  px: 1.8,
                  py: 0.6,
                  width: "fit-content",
                  borderRadius: "999px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(10px)",
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
                  Frontend Developer
                </Typography>
              </Box>

              {/* Main Headline */}
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2.3rem", sm: "3rem", md: "3.5rem" },
                    fontWeight: 300,
                    lineHeight: 1.08,
                    letterSpacing: "-0.03em",
                    color: Colors.WHITE,
                    fontFamily: "var(--font-titillium-web), sans-serif",
                  }}
                >
                  Crafting Living
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2.3rem", sm: "3rem", md: "3.5rem" },
                    fontWeight: 700,
                    lineHeight: 1.08,
                    letterSpacing: "-0.02em",
                    color: "#61DAFB",
                    textShadow: "0 0 35px rgba(97, 218, 251, 0.35)",
                    fontFamily: "var(--font-titillium-web), sans-serif",
                  }}
                >
                  Web Experiences.
                </Typography>
              </Box>

              {/* Intro Lede */}
              <Typography
                sx={{
                  fontSize: { xs: "0.92rem", md: "1.02rem" },
                  lineHeight: 1.65,
                  color: Colors.GREY,
                  maxWidth: 440,
                  fontWeight: 300,
                }}
              >
                Specializing in modern web applications with{" "}
                <strong>React</strong> &amp; <strong>Next.js</strong>,
                interactive 3D architectures, and high-conversion frontend
                solutions.
              </Typography>

              {/* CTA Button */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2.2,
                  pt: 0.5,
                }}
              >
                <LiquidButton label="Explore The Work" href="#projects" />
              </Box>

              {/* Compact Metrics Pills */}
              <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      fontWeight: 500,
                      color: Colors.GREY,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Experience
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: Colors.WHITE,
                    }}
                  >
                    5+ Years
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: "14px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      fontWeight: 500,
                      color: Colors.GREY,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Shipped
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "#CEF2A8",
                    }}
                  >
                    50+ Codebases
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Left 3D Paper (Shown ONLY during two-cards stage) */}
            {isTwoCards && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <PaperCard variant="site-of-the-year" />
              </Box>
            )}
          </Box>

          {/* ════════════ CENTER COLUMN: Crystal Spider (Empty in Two-Cards Stage) ════════════ */}
          <Box
            sx={{
              position: "relative",
              height: { xs: 380, sm: 460, md: 540, lg: 620 },
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3,
              order: { xs: 1, lg: 2 },
              // In two-cards: Center is completely empty!
              opacity: isHeroSettle ? 1 : 0,
              pointerEvents: isHeroSettle ? "auto" : "none",
              transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Ambient Radial Spotlight behind settled spider */}
            <Box
              sx={{
                position: "absolute",
                width: { xs: 260, md: 460 },
                height: { xs: 260, md: 460 },
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(97, 218, 251, 0.18) 0%, rgba(206, 242, 168, 0.06) 45%, transparent 75%)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />

            {/* 3D Spider Canvas (Settled in Hero Stage) */}
            {isHeroSettle && <SpiderHeroScene stage="hero" />}
          </Box>

          {/* ════════════ RIGHT COLUMN: Pure 3D Paper (Image 2) ════════════ */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              zIndex: 4,
              order: { xs: 3, lg: 3 },
              alignItems: { xs: "center", lg: "flex-end" },
              // Choreography transform:
              // - In two-cards: Sits shifted towards center
              // - In spider-huge: Slides far right off-screen & disappears
              // - In hero-settle: Settles into normal position
              transform: isTwoCards
                ? { xs: "none", lg: "translateX(-80px) scale(1.02)" }
                : isSpiderHuge
                  ? "translateX(150vw) scale(0.65)"
                  : "none",
              opacity: isSpiderHuge ? 0 : 1,
              transition:
                "transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Pure 3D Paper Sheet (Shown during both two-cards & hero-settle) */}
            <PaperCard variant="site-of-the-year" />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
