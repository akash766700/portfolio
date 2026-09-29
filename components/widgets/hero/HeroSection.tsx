"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Container } from "@mui/material";
import { Colors } from "@/utils/enum";
import { SpiderHeroScene } from "@/components/3D";
import BrandOrbLoader from "@/components/widgets/BrandOrbLoader";
import HeroSparkles from "./HeroSparkles";
import { SylvaLivingWorldScene } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import { gsap, ScrollTrigger } from "@/utils/gsap";

export type IntroStage =
  | "loader"
  | "spider-zoom"
  | "spider-drop"
  | "hero-settle";

interface HeroSectionProps {
  onStageChange?: (stage: IntroStage) => void;
}

export default function HeroSection({ onStageChange }: HeroSectionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sequence: "loader" -> "spider-zoom" (1.55s) -> "spider-drop" (1.8s) -> "hero-settle"
  const [stage, setStage] = useState<IntroStage>("loader");
  const [loaderMounted, setLoaderMounted] = useState(true);
  const [quantumFlash, setQuantumFlash] = useState(false);

  const [sylvaVisible, setSylvaVisible] = useState(false);

  // Animation and ScrollTrigger DOM refs
  const heroRef = useRef<HTMLDivElement>(null);
  const sylvaWrapRef = useRef<HTMLDivElement>(null);
  const contentWrapRef = useRef<HTMLDivElement>(null);
  const spiderWrapRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Notify parent of stage changes
  useEffect(() => {
    onStageChange?.(stage);
  }, [stage, onStageChange]);

  // Lock body scroll during intro sequence until hero is fully settled
  useEffect(() => {
    if (stage !== "hero-settle") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [stage]);

  // ── Cinematic Stage Sequence: Shutter opens -> Spider Rotates & Shrinks into Cosmos -> Drops from Top ──
  useEffect(() => {
    if (stage === "spider-zoom") {
      // 1. Spider rotates 360 and falls backward deep into cosmos over 7.0s
      const flashTimer = setTimeout(() => {
        setQuantumFlash(true);
      }, 6400);
      const flashOffTimer = setTimeout(() => {
        setQuantumFlash(false);
      }, 6900);

      // 2. Full 7.0s rotation complete -> Transition to spider dropping from ceiling on silk thread
      const zoomTimer = setTimeout(() => {
        setStage("spider-drop");
      }, 7000);
      return () => {
        clearTimeout(flashTimer);
        clearTimeout(flashOffTimer);
        clearTimeout(zoomTimer);
      };
    }

    if (stage === "spider-drop") {
      // 3. Spider drops gracefully from top on silk thread and touches down in hero position
      const dropTimer = setTimeout(() => {
        setStage("hero-settle");
      }, 1800);
      return () => clearTimeout(dropTimer);
    }
  }, [stage]);

  // Eagerly preload spider 3D model on initial mount while brand loader is running
  useEffect(() => {
    import("@/components/3D/SpiderHeroScene").then((mod) => {
      mod.preloadSpiderModel?.();
    });
  }, []);

  const handleLoaderComplete = () => {
    setStage("spider-zoom");
    setTimeout(() => {
      setLoaderMounted(false);
    }, 400);
  };

  const isLoader = stage === "loader";
  const isIntroPhase = isLoader || stage === "spider-zoom";
  const isHeroVisible = stage === "spider-drop" || stage === "hero-settle";
  const isHeroSettle = stage === "hero-settle";

  // ── 1. Reveal Sylva and trigger scan entrance animation when Hero arrives ──
  useEffect(() => {
    if (stage === "hero-settle") {
      const timer = setTimeout(() => {
        setSylvaVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setSylvaVisible(false);
    }
  }, [stage]);



  if (!isMounted) {
    return (
      <Box
        component="section"
        id="hero"
        sx={{
          minHeight: "100vh",
          width: "100%",
          backgroundColor: "#070709",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BrandOrbLoader isExiting={false} />
      </Box>
    );
  }

  return (
    <Box
      ref={heroRef}
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
        pt: 0,
        pb: 0,
        isolation: "isolate",
      }}
    >
      {/* ── 1. Fullscreen Split-Curtain Awwwards Loader ── */}
      {loaderMounted && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            pointerEvents: isLoader ? "auto" : "none",
          }}
        >
          <BrandOrbLoader
            onComplete={handleLoaderComplete}
            isExiting={!isLoader}
          />
        </Box>
      )}

      {/* ── 0. Sylva Living World Procedural Three.js Scene ── */}
      <Box
        ref={sylvaWrapRef}
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          opacity: (stage === "hero-settle" && sylvaVisible) ? 1 : 0,
          visibility: (stage === "hero-settle" && sylvaVisible) ? "visible" : "hidden",
          pointerEvents: (stage === "hero-settle" && sylvaVisible) ? "auto" : "none",
          transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s ease",
        }}
      >
        <div className="shader-frame" style={{ width: "100%", height: "100%", position: "relative" }}>
          <SylvaLivingWorldScene
            variant="living-green"
            startScan={stage === "hero-settle" && sylvaVisible}
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          />
        </div>

        {/* ── Cinematic Depth Scrim (Darkens background to make Spider pop like a centerpiece) ── */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundColor: "rgba(4, 5, 8, 0.44)",
            background: `
              /* Deep shadow pocket directly behind spider to maximize foreground separation */
              radial-gradient(60% 55% at 74% 48%, rgba(4, 5, 8, 0.56) 0%, rgba(4, 5, 8, 0.25) 60%, transparent 85%),
              /* Top navbar fade */
              linear-gradient(180deg, rgba(7, 8, 10, 0.85) 0%, transparent 28%),
              /* Bottom transition */
              linear-gradient(0deg, #07080A 0%, rgba(7, 8, 10, 0.72) 15%, transparent 35%)
            `,
          }}
        />
      </Box>

      {/* ── Ambient Lighting Floor & Atmospheric Dual Spotlights ── */}
      <Box
        ref={spotlightRef}
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background: `
            /* Subtle Deep Cyber Glow behind spider */
            radial-gradient(60% 55% at 74% 50%, rgba(97, 218, 251, 0.04) 0%, transparent 65%),
            /* Secondary Ambient Studio Fill behind left text */
            radial-gradient(55% 50% at 26% 48%, rgba(97, 218, 251, 0.08) 0%, rgba(206, 242, 168, 0.03) 40%, transparent 70%),
            /* Continuous Luxury Platform Glow along bottom floor */
            radial-gradient(80% 35% at 50% 96%, rgba(97, 218, 251, 0.06) 0%, rgba(206, 242, 168, 0.04) 50%, transparent 80%),
            /* Corner obsidian vignettes */
            radial-gradient(circle at 10% 15%, rgba(255, 255, 255, 0.015) 0%, transparent 40%),
            radial-gradient(circle at 90% 15%, rgba(97, 218, 251, 0.02) 0%, transparent 40%)
          `,
          opacity: isHeroVisible ? 1 : 0.4,
          transition: "opacity 1.2s ease",
        }}
      />

      {/* ── Full-Hero Floating Cyber Dust Sparkles (Mesmerizing Ambient Stardust) ── */}
      {isHeroVisible && <HeroSparkles />}

      {/* ── Architectural Grid Line Guides (Subtle) ── */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-around",
          opacity: isHeroVisible ? 0.045 : 0,
          transition: "opacity 1.4s ease 0.4s",
        }}
      >
        <Box sx={{ width: "1px", height: "100%", background: "#FFFFFF" }} />
        <Box sx={{ width: "1px", height: "100%", background: "#FFFFFF" }} />
        <Box sx={{ width: "1px", height: "100%", background: "#FFFFFF" }} />
        <Box sx={{ width: "1px", height: "100%", background: "#FFFFFF" }} />
      </Box>


      {/* ── CINEMATIC FULLSCREEN SPIDER INTRO (Immediate Slow-Mo Fall & Recede into Cosmos) ── */}
      {stage === "spider-zoom" && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fadeInSpiderScene 0.4s ease-out forwards",
            "@keyframes fadeInSpiderScene": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          {/* Ambient Center Glow (Zero-Blur GPU-Friendly Radial Falloff) */}
          <Box
            sx={{
              position: "absolute",
              width: "85vw",
              height: "85vh",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(97, 218, 251, 0.24) 0%, rgba(97, 218, 251, 0.08) 35%, rgba(206, 242, 168, 0.03) 55%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Anamorphic Cyan Prism Lens Flare Streak */}
          <Box
            sx={{
              position: "absolute",
              width: "140vw",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(97, 218, 251, 0.1) 20%, rgba(255, 255, 255, 0.8) 50%, rgba(97, 218, 251, 0.1) 80%, transparent 100%)",
              transform: "rotate(-12deg)",
              pointerEvents: "none",
              opacity: stage === "spider-zoom" ? 0.85 : 0.2,
              transition: "opacity 1.2s ease",
              animation: "flareBreathe 3.5s ease-in-out infinite alternate",
              "@keyframes flareBreathe": {
                from: { transform: "rotate(-12deg) scaleX(0.85)" },
                to: { transform: "rotate(-12deg) scaleX(1.1)" },
              },
            }}
          />

          {/* Concentric Quantum Portal Rings (Clean hardware-accelerated borders) */}
          <Box
            sx={{
              position: "absolute",
              width: { xs: 320, md: 540 },
              height: { xs: 320, md: 540 },
              borderRadius: "50%",
              border: "1px dashed rgba(97, 218, 251, 0.35)",
              animation: "portalRingRotate 22s linear infinite",
              pointerEvents: "none",
              opacity: stage === "spider-zoom" ? 0.75 : 0.15,
              transition: "opacity 1s ease",
              "@keyframes portalRingRotate": {
                from: { transform: "rotate(0deg) scale(0.92)" },
                "50%": { transform: "rotate(180deg) scale(1.08)" },
                to: { transform: "rotate(360deg) scale(0.92)" },
              },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: { xs: 440, md: 720 },
              height: { xs: 440, md: 720 },
              borderRadius: "50%",
              border: "1px solid rgba(206, 242, 168, 0.18)",
              animation: "portalRingRotateReverse 28s linear infinite",
              pointerEvents: "none",
              opacity: stage === "spider-zoom" ? 0.55 : 0.1,
              transition: "opacity 1s ease",
              "@keyframes portalRingRotateReverse": {
                from: { transform: "rotate(360deg) scale(1.05)" },
                "50%": { transform: "rotate(180deg) scale(0.95)" },
                to: { transform: "rotate(0deg) scale(1.05)" },
              },
            }}
          />

          {/* Gravitational Shockwave Ripple */}
          <Box
            sx={{
              position: "absolute",
              width: { xs: 240, md: 420 },
              height: { xs: 240, md: 420 },
              borderRadius: "50%",
              border: "1.5px solid rgba(97, 218, 251, 0.4)",
              pointerEvents: "none",
              animation:
                stage === "spider-zoom"
                  ? "warpExpand 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite"
                  : "warpContract 1.3s cubic-bezier(0.7, 0, 0.84, 0) infinite",
              "@keyframes warpExpand": {
                "0%": { transform: "scale(0.35)", opacity: 0.9 },
                "100%": { transform: "scale(1.85)", opacity: 0 },
              },
              "@keyframes warpContract": {
                "0%": { transform: "scale(1.9)", opacity: 0 },
                "50%": { opacity: 0.8 },
                "100%": { transform: "scale(0.05)", opacity: 0 },
              },
            }}
          />
        </Box>
      )}

      {/* ── Singularity Implosion Quantum Flash Burst ── */}
      {quantumFlash && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(97, 218, 251, 0.65) 20%, rgba(97, 218, 251, 0.15) 50%, transparent 75%)",
            animation: "quantumFlashAnim 0.42s cubic-bezier(0.12, 0.8, 0.32, 1) forwards",
            "@keyframes quantumFlashAnim": {
              "0%": { opacity: 0, transform: "scale(0.85)" },
              "35%": { opacity: 1, transform: "scale(1.08)" },
              "100%": { opacity: 0, transform: "scale(1.3)" },
            },
          }}
        />
      )}

      {/* ── MAIN CONTAINER (Hero Content & Dropping Spider) ── */}
      <Container
        ref={contentWrapRef}
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 4,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pt: { xs: 10, md: 0 },
          pb: { xs: 6, md: 0 },
          opacity: isHeroSettle ? 1 : 0,
          transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            alignItems: "center",
            gap: { xs: 4, md: 6 },
            width: "100%",
            minHeight: { xs: "auto", md: "85vh" },
          }}
        >
          {/* ════════════ LEFT COLUMN: Copy & CTA ════════════ */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.4,
              zIndex: 4,
              gridColumn: { xs: "1", md: "1" },
              maxWidth: { xs: "100%", md: 540, lg: 620 },
              opacity: isHeroSettle ? 1 : 0,
              transform: isHeroSettle ? "none" : "translateY(24px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              pointerEvents: isHeroSettle ? "auto" : "none",
            }}
          >
            {/* ════ Elegant Calligraphy Greeting & Minimal Modern Typography ════ */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {/* Handwritten Greeting in Waterfall */}
              <Typography
                component="span"
                sx={{
                  fontFamily: "var(--font-waterfall), cursive",
                  fontSize: { xs: "3.2rem", sm: "4.2rem", md: "5rem" },
                  fontWeight: 400,
                  color: "#CEF2A8",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                  textShadow: "0 0 30px rgba(206, 242, 168, 0.4)",
                  transform: "rotate(-2deg)",
                  transformOrigin: "left bottom",
                  mb: { xs: -0.5, md: -1 },
                  userSelect: "none",
                }}
              >
                Hey, I&apos;m
              </Typography>

              {/* Bold Futuristic Name in Titillium Web */}
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "var(--font-titillium-web), sans-serif",
                  fontSize: { xs: "3.2rem", sm: "4.4rem", md: "5.4rem" },
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #FFFFFF 40%, #61DAFB 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 35px rgba(97, 218, 251, 0.3))",
                }}
              >
                Akash Gupta
              </Typography>
            </Box>

            {/* Subtle Live Badge & Role */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.4,
                px: 1.8,
                py: 0.7,
                width: "fit-content",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#61DAFB",
                  boxShadow: "0 0 10px #61DAFB",
                  animation: "pulseAura 2s ease-in-out infinite",
                  "@keyframes pulseAura": {
                    "0%, 100%": { transform: "scale(1)", opacity: 1 },
                    "50%": { transform: "scale(1.25)", opacity: 0.6 },
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: "0.78rem", sm: "0.85rem" },
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.85)",
                  fontFamily: "var(--font-titillium-web), sans-serif",
                }}
              >
                Frontend Developer &amp; Creative Engineer
              </Typography>
            </Box>

            {/* Minimal Clean Bio */}
            <Typography
              sx={{
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                lineHeight: 1.65,
                color: "rgba(255, 255, 255, 0.62)",
                maxWidth: 440,
                fontWeight: 300,
                fontFamily: "var(--font-geist-sans), sans-serif",
              }}
            >
              Crafting fast, living, and interactive 3D web experiences with modern React &amp; Next.js architecture.
            </Typography>
            </Box>

          {/* ════════════ RIGHT COLUMN SPACER ON DESKTOP ════════════ */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              minHeight: { md: 540, lg: 640 },
              pointerEvents: "none",
            }}
          />
        </Box>
      </Container>

      {/* ════════════ PERSISTENT 3D CRYSTAL SPIDER CANVAS (Zero WebGL Recreations, Locked 60/120fps) ════════════ */}
      <Box
        ref={spiderWrapRef}
        sx={{
          position: isIntroPhase ? "fixed" : "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: isIntroPhase ? 0 : { xs: 0, md: "50%" },
          width: isIntroPhase ? "100%" : { xs: "100%", md: "50%" },
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: isIntroPhase ? (isLoader ? 10 : 80) : 5,
          pointerEvents: isHeroSettle ? "auto" : "none",
          transition: "left 0.6s cubic-bezier(0.16, 1, 0.3, 1), width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Ambient Radial Spotlight behind settled spider */}
        {!isIntroPhase && (
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
        )}

        {/* Persistent 3D Spider Canvas */}
        <SpiderHeroScene
          stage={
            isLoader
              ? "loader"
              : stage === "spider-zoom"
              ? "huge"
              : "hero"
          }
          dropFromTop={stage === "spider-drop" || stage === "hero-settle"}
        />
      </Box>
    </Box>
  );
}
