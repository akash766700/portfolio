"use client";

import React, { useState, useCallback } from "react";
import { Box } from "@mui/material";
import { Navbar } from "@/components/widgets/navbar";
import { HeroSection } from "@/components/widgets/hero";
import { Colors } from "@/utils/enum";
import { IntroStage } from "@/components/widgets/hero/HeroSection";

import { WorksSection } from "@/components/widgets/works";
import CapabilitiesSection from "@/components/widgets/capabilities/CapabilitiesSection";
import AboutSection from "@/components/widgets/about/AboutSection";
import ContactSection from "@/components/widgets/contact/ContactSection";
import { Footer } from "@/components/widgets/footer";

export default function Home() {
  const [isNavVisible, setIsNavVisible] = useState(false);

  const handleStageChange = useCallback((stage: IntroStage) => {
    if (stage === "hero-settle") {
      setIsNavVisible(true);
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: Colors.BACKGROUND,
        color: Colors.WHITE,
        position: "relative",
        overflowX: "clip",
      }}
    >
      {/* ── Fixed Floating Navbar (fades in gracefully after spider settles) ── */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          opacity: isNavVisible ? 1 : 0,
          transform: isNavVisible ? "none" : "translateY(-20px)",
          transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: isNavVisible ? "auto" : "none",
        }}
      >
        <Navbar />
      </Box>

      {/* ── Captured-style Hero Section with 4-Stage Cinematic Choreography ── */}
      <HeroSection onStageChange={handleStageChange} />

      {/* ── Works & Projects Section (Revealed when Hero collapses on scroll) ── */}
      <WorksSection />

      {/* ── Capabilities / Technical Stack Section ── */}
      <CapabilitiesSection />

      {/* ── About Me & Stats Section ── */}
      <AboutSection />

      {/* ── Direct Contact & Inquiries Section ── */}
      <ContactSection />

      {/* ── Luxury Minimal Footer ── */}
      <Footer />
    </Box>
  );
}
