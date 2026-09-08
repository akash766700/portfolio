"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Colors } from "@/utils/enum";

interface LiquidButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
}

export default function LiquidButton({
  label = "Explore Works",
  onClick,
  href = "#projects",
}: LiquidButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <Box
      component="a"
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.8,
        px: { xs: 3.2, sm: 4 },
        py: { xs: 1.4, sm: 1.65 },
        borderRadius: "999px",
        textDecoration: "none",
        cursor: "pointer",
        userSelect: "none",
        overflow: "hidden",
        isolation: "isolate",
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 255, 255, 0.01) 100%), rgba(16, 18, 20, 0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: isHovered
          ? "0 12px 36px rgba(0, 0, 0, 0.6), 0 0 24px rgba(97, 218, 251, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
          : "0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isHovered ? "scale(1.03) translateY(-2px)" : "scale(1)",
        "&:active": {
          transform: "scale(0.98)",
        },
      }}
    >
      {/* Liquid fluid dispersion glow follow */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: "inherit",
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(97, 218, 251, 0.3) 0%, rgba(225, 220, 201, 0.15) 35%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Top specular highlight rim */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)",
          opacity: isHovered ? 1 : 0.4,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Icon */}
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{
          width: 18,
          height: 18,
          fill: "none",
          stroke: isHovered ? "#61DAFB" : Colors.WHITE,
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transition: "transform 0.3s ease, stroke 0.3s ease",
          transform: isHovered ? "translateX(2px)" : "none",
        }}
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </Box>

      {/* Button label */}
      <Typography
        sx={{
          fontFamily: "var(--font-titillium-web), sans-serif",
          fontSize: { xs: "0.85rem", sm: "0.92rem" },
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: Colors.WHITE,
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
