"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Container } from "@mui/material";
import { Colors } from "@/utils/enum";
import { SpiderHeroScene } from "@/components/3D";
import LiquidButton from "./LiquidButton";
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
  // Sequence: "loader" -> "spider-zoom" (immediate slow-mo fall & recede, 3.8s) -> "spider-drop" (2.6s) -> "hero-settle"
  const [stage, setStage] = useState<IntroStage>("loader");
  const [loaderMounted, setLoaderMounted] = useState(true);
  const [quantumFlash, setQuantumFlash] = useState(false);

  // Animation and ScrollTrigger DOM refs
  const heroRef = useRef<HTMLDivElement>(null);
  const portalCurtainRef = useRef<HTMLDivElement>(null);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const contentWrapRef = useRef<HTMLDivElement>(null);
  const spiderWrapRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Notify parent of stage changes
  useEffect(() => {
    onStageChange?.(stage);
  }, [stage, onStageChange]);

  // ── Cinematic Stage Sequence: Shutter opens -> Spider Rotates & Shrinks into Cosmos -> Drops from Top ──
  useEffect(() => {
    if (stage === "spider-zoom") {
      // 1. Spider rotates 360 and falls backward deep into cosmos, shrinking to a point
      const flashTimer = setTimeout(() => {
        setQuantumFlash(true);
      }, 2450);
      const flashOffTimer = setTimeout(() => {
        setQuantumFlash(false);
      }, 2850);

      // 2. Implosion complete -> Transition to spider dropping from ceiling on silk thread
      const zoomTimer = setTimeout(() => {
        setStage("spider-drop");
      }, 2950);
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
      }, 2200);
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

  // ── 1. ThreeUI Style Circular Aperture Entrance Reveal (100% GPU Hardware Accelerated) ──
  useEffect(() => {
    if (!isHeroVisible) return;
    const curtain = portalCurtainRef.current;
    if (!curtain) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        curtain,
        { scale: 0 },
        { scale: 1.25, duration: 1.2, ease: "power2.out" }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [isHeroVisible]);

  // ── 2. Scroll-Pinned Exact Reverse Collapse & Transition to Next Section (120fps GPU) ──
  useEffect(() => {
    if (stage !== "hero-settle") return;
    const section = heroRef.current;
    const curtain = portalCurtainRef.current;
    const content = contentWrapRef.current;
    const spider = spiderWrapRef.current;
    const spotlight = spotlightRef.current;

    if (!section || !curtain) return;

    const ctx = gsap.context(() => {
      const scrubTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=100%", // 100vh clean scroll scrub
          pin: true,
          scrub: 0.35, // Snappy & ultra-responsive!
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // EXACT REVERSE EXIT:
      // As user scrolls down, contract the circular aperture back into center singularity
      scrubTl
        // 1. Shutter hole scales down from 1.25 to 0 at center (GPU Matrix Transform!)
        .fromTo(
          curtain,
          { scale: 1.25 },
          { scale: 0, ease: "power1.inOut" },
          0
        )
        // 1b. Solid Blackout Layer seals 100% into background as iris closes
        .fromTo(
          blackoutRef.current,
          { opacity: 0 },
          { opacity: 1, ease: "power2.in" },
          0.6
        )
        // 2. Spider scales down and recedes toward center singularity
        .fromTo(
          spider,
          { scale: 1, opacity: 1, x: 0 },
          { scale: 0.14, opacity: 0, x: -100, ease: "power1.in" },
          0
        )
        // 3. Headline, buttons, and metrics fade and contract toward center
        .fromTo(
          content,
          { opacity: 1, scale: 1, x: 0 },
          { opacity: 0, scale: 0.85, x: 100, ease: "power1.in" },
          0
        )
        // 4. Spotlights and floor light dim down
        .fromTo(
          spotlight,
          { opacity: 1 },
          { opacity: 0, ease: "power1.inOut" },
          0
        );

      ScrollTrigger.refresh();
    }, heroRef);

    return () => ctx.revert();
  }, [stage]);

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
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          opacity: isHeroVisible ? 1 : 0,
          pointerEvents: "auto",
          transition: "opacity 0.6s ease",
        }}
      >
        <div className="shader-frame" style={{ width: "100%", height: "100%", position: "relative" }}>
          <SylvaLivingWorldScene
            variant="living-green"
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          />
        </div>

        {/* ── Subtle Edge Blending (Smooth transition without obscuring moss roots) ── */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `
              /* Top navbar gentle fade */
              linear-gradient(180deg, rgba(10, 10, 12, 0.7) 0%, transparent 22%),
              /* Bottom transition */
              linear-gradient(0deg, #0A0A0C 0%, rgba(10, 10, 12, 0.5) 10%, transparent 25%)
            `,
          }}
        />
      </Box>

      {/* ── 1. Hardware-Accelerated Iris Portal Shutter Curtain (120fps GPU Compositor) ── */}
      <Box
        ref={portalCurtainRef}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "135vmax",
          height: "135vmax",
          borderRadius: "50%",
          transform: "translate(-50%, -50%) scale(0)",
          boxShadow: "0 0 0 99999px #0A0A0C",
          pointerEvents: "none",
          zIndex: 1,
          willChange: "transform",
        }}
      >
        {/* Luminous Neon Cyan/Lime Scan Ring attached to Shutter Lip */}
        <Box
          sx={{
            position: "absolute",
            inset: -1,
            borderRadius: "50%",
            border: "2px solid #61DAFB",
            boxShadow:
              "0 0 25px rgba(97, 218, 251, 0.7), inset 0 0 25px rgba(206, 242, 168, 0.5)",
            pointerEvents: "none",
          }}
        />
      </Box>

      {/* ── Solid Blackout Layer (Seals hero 100% into background as iris closes) ── */}
      <Box
        ref={blackoutRef}
        sx={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0A0A0C",
          zIndex: 2,
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── Ambient Lighting Floor & Atmospheric Dual Spotlights ── */}
      <Box
        ref={spotlightRef}
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          background: `
            /* Primary Cyber Spotlight behind spider & right side */
            radial-gradient(60% 55% at 74% 50%, rgba(97, 218, 251, 0.20) 0%, rgba(97, 218, 251, 0.06) 45%, transparent 75%),
            /* Secondary Ambient Studio Fill behind left text */
            radial-gradient(55% 50% at 26% 48%, rgba(97, 218, 251, 0.13) 0%, rgba(206, 242, 168, 0.06) 40%, transparent 70%),
            /* Continuous Luxury Platform Glow along bottom floor */
            radial-gradient(80% 35% at 50% 96%, rgba(97, 218, 251, 0.12) 0%, rgba(206, 242, 168, 0.08) 50%, transparent 80%),
            /* Corner obsidian vignettes */
            radial-gradient(circle at 10% 15%, rgba(255, 255, 255, 0.02) 0%, transparent 40%),
            radial-gradient(circle at 90% 15%, rgba(97, 218, 251, 0.04) 0%, transparent 40%)
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
          color: "rgba(255, 255, 255, 0.025)",
          whiteSpace: "nowrap",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 1,
          fontFamily: "var(--font-science-gothic), var(--font-titillium-web), sans-serif",
          transition: "opacity 1.4s ease, transform 1.4s ease",
          opacity: isHeroVisible ? 1 : 0,
        }}
      >
        AKASH GUPTA
      </Typography>

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
          opacity: isHeroVisible ? 1 : 0,
          transition: "opacity 0.5s ease",
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
              opacity: isHeroVisible ? 1 : 0,
              transform: isHeroVisible ? "none" : "translateY(24px)",
              transition:
                "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              pointerEvents: isHeroVisible ? "auto" : "none",
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
                <LiquidButton label="Explore The Work" href="#works" />
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
          zIndex: isIntroPhase ? (isLoader ? 10 : 80) : 3,
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
