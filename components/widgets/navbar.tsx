"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import {
  Close as CloseIcon,
  ArrowOutward as ArrowOutwardIcon,
} from "@mui/icons-material";
import { PORTFOLIO_DATA } from "@/assets/generic-data";
import { gsap } from "@/utils/gsap";

const MENU_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "Portfolio", href: "#works" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "About me", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Cinematic Entrance & Exit Timeline
  useEffect(() => {
    if (!drawerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(drawerRef.current, { visibility: "hidden" });
        },
      });

      // Set initial hidden visibility
      gsap.set(drawerRef.current, { visibility: "hidden", opacity: 0 });
      gsap.set(".nav-grid-line", { scaleY: 0, transformOrigin: "top" });
      gsap.set(".nav-menu-item", { opacity: 0, x: 30 });
      gsap.set(".nav-image-card", { opacity: 0, x: -70 });
      gsap.set(".nav-image-inner", { scale: 1.2, x: -30 });
      gsap.set(".nav-name-char", { opacity: 0, x: -20 });
      gsap.set(".nav-close-btn", { opacity: 0, rotate: -90, scale: 0.6 });

      // 0. Drawer background fades in quickly (0.2s)
      tl.to(drawerRef.current, {
        visibility: "visible",
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      })
        // 1. Hamburger open karne par PEHLE lines aayengi (top to bottom wipe)
        .to(".nav-grid-line", {
          scaleY: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.inOut",
        })
        // 2. Fir nav link (cascade dominoes from right)
        .to(
          ".nav-menu-item",
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: "power3.out",
          },
          "+=0.05",
        )
        // 3. Fir image (slides in from left to right, inner image settles)
        .to(
          ".nav-image-card",
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "+=0.05",
        )
        .to(
          ".nav-image-inner",
          {
            scale: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "<",
        )
        // 4. Fir mera name (Typewriter slide effect: A -> K -> A -> S -> H -> G -> U -> P -> T -> A -> .)
        .to(
          ".nav-name-char",
          {
            opacity: 1,
            x: 0,
            duration: 0.2,
            stagger: 0.055,
            ease: "power2.out",
          },
          "+=0.08",
        )
        // 5. Fir cross (Close button rotates & scales in)
        .to(
          ".nav-close-btn",
          {
            opacity: 1,
            rotate: 0,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "+=0.05",
        );

      tlRef.current = tl;
    }, drawerRef);

    return () => ctx.revert();
  }, []);

  // Trigger GSAP timeline on state change
  useEffect(() => {
    if (tlRef.current) {
      if (menuOpen) {
        document.body.style.overflow = "hidden";
        tlRef.current.play();
      } else {
        document.body.style.overflow = "";
        tlRef.current.reverse();
      }
    }
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 350);
    }
  };

  return (
    <>
      {/* Floating Bottom Capsule Dock Navbar */}
      <Box
        component="header"
        sx={{
          position: "fixed",
          bottom: { xs: 20, md: 32 },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1200,
          width: "auto",
          minWidth: { xs: "220px", sm: "260px" },
          height: { xs: 56, md: 64 },
          px: { xs: 2, sm: 2.5 },
          borderRadius: "100px",
          backgroundColor: "rgba(20, 20, 24, 0.78)",
          backgroundImage:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          boxShadow:
            "0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            borderColor: "rgba(255, 255, 255, 0.28)",
            boxShadow:
              "0 25px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
          },
        }}
      >
        {/* Left: Logo */}
        <Box
          component="a"
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#hero");
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            pl: 0.5,
            transition: "transform 0.25s ease, opacity 0.25s ease",
            "&:hover": {
              opacity: 0.9,
              transform: "scale(1.04)",
            },
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt={PORTFOLIO_DATA.personal.name}
            sx={{
              height: { xs: 28, md: 34 },
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>

        {/* Right: Option 1 - Kinetic Asymmetric Dual-Lines with Glowing Accent Dot Below */}
        <Box
          component="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          sx={{
            background: "none",
            border: "none",
            outline: "none",
            cursor: "pointer",
            p: 1.2,
            mr: -0.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            position: "relative",
            transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            "&:hover": {
              transform: "scale(1.08)",
              "& .line-top": {
                transform: "translateX(4px)",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 0 10px rgba(255, 255, 255, 0.85)",
              },
              "& .line-bottom": {
                transform: "translateX(-2px)",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 0 10px rgba(226, 199, 153, 0.7)",
              },
              "& .accent-dot": {
                transform: "scale(1.5)",
                backgroundColor: "#E2C799",
                boxShadow: "0 0 10px #E2C799, 0 0 20px #E2C799",
              },
            },
          }}
        >
          {/* Top Line (18px) */}
          <Box
            className="line-top"
            sx={{
              width: 18,
              height: 2,
              borderRadius: "2px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              mb: "6px",
            }}
          />

          {/* Bottom Line (26px) */}
          <Box
            className="line-bottom"
            sx={{
              width: 26,
              height: 2,
              borderRadius: "2px",
              backgroundColor: "#E2C799",
              transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              mb: "5px",
            }}
          />

          {/* Accent Dot Below (Aligned under right edge of bottom line) */}
          <Box
            sx={{
              width: 26,
              display: "flex",
              justifyContent: "flex-end",
              pr: "1px",
            }}
          >
            <Box
              className="accent-dot"
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                backgroundColor: "#E2C799",
                boxShadow: "0 0 7px rgba(226, 199, 153, 0.9)",
                transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Opened State: Fullscreen Drawer */}
      <Box
        ref={drawerRef}
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1400,
          backgroundColor: "#0A0A0C",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        {/* Centered Luxury Container */}
        <Box
          sx={{
            maxWidth: "1440px",
            mx: "auto",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            px: { xs: 3, sm: 5, md: 8 },
            position: "relative",
          }}
        >
          {/* Top Right Floating Close Button */}
          <IconButton
            onClick={() => setMenuOpen(false)}
            className="nav-close-btn"
            aria-label="Close menu"
            disableRipple
            sx={{
              position: "absolute",
              top: { xs: 24, md: 36 },
              right: { xs: 24, sm: 36, md: 56 },
              zIndex: 30,
              p: 0.5,
              color: "#FFFFFF",
              backgroundColor: "transparent",
              opacity: 0,
              transform: "rotate(-90deg) scale(0.6)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              "&:hover": {
                color: "#E2C799",
                transform: "rotate(90deg) scale(1.1)",
                backgroundColor: "transparent",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 34, md: 40 } }} />
          </IconButton>

          {/* Main Body Grid - Full Height */}
          <Box
            sx={{
              flex: 1,
              height: "100%",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.55fr 0.25fr" },
              overflow: "hidden",
            }}
          >
            {/* Left Column: Landscape Card + Giant Headline */}
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                pt: { xs: 5, md: 6 },
                pb: { xs: 4, md: 6 },
                pr: { md: 6 },
              }}
            >
              {/* Landscape Card with Left-to-Right Slide Reveal Animation */}
              <Box
                className="nav-image-card"
                sx={{
                  width: "100%",
                  maxWidth: "500px",
                  height: { xs: "170px", sm: "210px", md: "240px" },
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
                  position: "relative",
                  mt: { xs: 1, md: 2 },
                  opacity: 0,
                  transform: "translateX(-70px)",
                  willChange: "transform, opacity",
                }}
              >
                <Box
                  className="nav-image-inner"
                  component="img"
                  src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80"
                  alt="Portfolio preview"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "grayscale(20%) contrast(105%)",
                    transition: "transform 0.6s ease",
                    transform: "scale(1.2) translateX(-30px)",
                    willChange: "transform",
                    "&:hover": { transform: "scale(1.04)" },
                  }}
                />
              </Box>

              {/* Massive 2-line bottom typography with typewriter slide effect */}
              <Box sx={{ mt: "auto", pt: 4, overflow: "hidden" }}>
                <Typography
                  className="nav-giant-title"
                  sx={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontWeight: 900,
                    fontSize: {
                      xs: "3.2rem",
                      sm: "4.8rem",
                      md: "5.8rem",
                      lg: "7rem",
                    },
                    lineHeight: 0.9,
                    letterSpacing: "-0.03em",
                    textTransform: "uppercase",
                    color: "#FFFFFF",
                    userSelect: "none",
                  }}
                >
                  <Box component="span" sx={{ display: "block" }}>
                    {Array.from("AKASH").map((char, i) => (
                      <Box
                        key={`l1-${i}`}
                        component="span"
                        className="nav-name-char"
                        sx={{
                          display: "inline-block",
                          opacity: 0,
                          transform: "translateX(-20px)",
                          willChange: "transform, opacity",
                        }}
                      >
                        {char}
                      </Box>
                    ))}
                  </Box>
                  <Box component="span" sx={{ display: "block" }}>
                    {Array.from("GUPTA.").map((char, i) => (
                      <Box
                        key={`l2-${i}`}
                        component="span"
                        className="nav-name-char"
                        sx={{
                          display: "inline-block",
                          opacity: 0,
                          transform: "translateX(-20px)",
                          willChange: "transform, opacity",
                        }}
                      >
                        {char}
                      </Box>
                    ))}
                  </Box>
                </Typography>
              </Box>
            </Box>

            {/* Menu Column: Clean Vertical Navigation Links */}
            <Box
              sx={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                pl: { xs: 4, md: 6, lg: 8 },
                pr: { xs: 4, md: 6, lg: 8 },
                py: { xs: 3, md: 0 },
              }}
            >
              {/* Line 1: Left Vertical Line (Full Height with Sliding Highlight Beam) */}
              <Box
                className="nav-grid-line"
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: "1.5px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 100%)",
                  transform: "scaleY(0)",
                  transformOrigin: "top",
                  overflow: "hidden",
                }}
              >
                {/* Continuous Sliding Highlight Beam (niche-uppar smooth slide) */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "-0.75px",
                    width: "3px",
                    height: "160px",
                    borderRadius: "4px",
                    background:
                      "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.6) 50%, rgba(226, 199, 153, 0.6) 80%, transparent 100%)",
                    boxShadow:
                      "0 0 8px 1px rgba(255, 255, 255, 0.45), 0 0 16px 2px rgba(226, 199, 153, 0.3)",
                    animation: "slideGlow1 7s ease-in-out infinite",
                    willChange: "transform",
                    "@keyframes slideGlow1": {
                      "0%": { transform: "translateY(-190px)" },
                      "50%": { transform: "translateY(calc(100vh - 40px))" },
                      "100%": { transform: "translateY(-190px)" },
                    },
                  }}
                />
              </Box>

              {/* Line 2: Right Vertical Line (Full Height with Sliding Highlight Beam) */}
              <Box
                className="nav-grid-line"
                sx={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: "1.5px",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 100%)",
                  transform: "scaleY(0)",
                  transformOrigin: "top",
                  overflow: "hidden",
                }}
              >
                {/* Continuous Sliding Highlight Beam (niche-uppar smooth slide, staggered) */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "-0.75px",
                    width: "3px",
                    height: "160px",
                    borderRadius: "4px",
                    background:
                      "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.6) 50%, rgba(226, 199, 153, 0.6) 80%, transparent 100%)",
                    boxShadow:
                      "0 0 8px 1px rgba(255, 255, 255, 0.45), 0 0 16px 2px rgba(226, 199, 153, 0.3)",
                    animation: "slideGlow2 7s ease-in-out 1.5s infinite",
                    willChange: "transform",
                    "@keyframes slideGlow2": {
                      "0%": { transform: "translateY(-190px)" },
                      "50%": { transform: "translateY(calc(100vh - 40px))" },
                      "100%": { transform: "translateY(-190px)" },
                    },
                  }}
                />
              </Box>

              <Stack spacing={{ xs: 2, md: 2.8 }}>
                {MENU_ITEMS.map((item) => (
                  <Box key={item.label} sx={{ overflow: "hidden" }}>
                    <Typography
                      className="nav-menu-item"
                      component="a"
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      sx={{
                        display: "block",
                        color: "#FFFFFF",
                        opacity: 0,
                        transform: "translateX(30px)",
                        fontSize: {
                          xs: "1.35rem",
                          sm: "1.5rem",
                          md: "1.7rem",
                          lg: "1.9rem",
                        },
                        fontWeight: 500,
                        letterSpacing: "-0.01em",
                        textDecoration: "none",
                        cursor: "pointer",
                        width: "fit-content",
                        transition: "color 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                        willChange: "transform, opacity",
                        "&:hover": {
                          color: "#E2C799",
                          transform: "translateX(8px)",
                        },
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Right Spacer Column (shifts second line leftwards) */}
            <Box sx={{ display: { xs: "none", md: "block" } }} />
          </Box>
        </Box>
      </Box>
    </>
  );
};
