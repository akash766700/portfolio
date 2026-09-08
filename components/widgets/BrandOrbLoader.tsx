"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Colors } from "@/utils/enum";

interface BrandOrbLoaderProps {
  onComplete?: () => void;
  isExiting?: boolean;
}

export default function BrandOrbLoader({
  onComplete,
  isExiting = false,
}: BrandOrbLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const animFrameId = useRef<number | null>(null);
  const completedCalled = useRef(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Counter animation - runs smoothly on mount
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Smooth increment towards 100
      const increment = Math.max(1, Math.floor((100 - current) * 0.14));
      current += increment;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        if (!completedCalled.current) {
          completedCalled.current = true;
          setTimeout(() => {
            onCompleteRef.current?.();
          }, 350);
        }
      } else {
        setProgress(current);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);


  // Canvas 2D React Atom Orb Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = 360);
    let height = (canvas.height = 360);

    let time = 0;

    const render = () => {
      time += 0.035;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const rx = 105;
      const ry = 36;

      // Outer ambient core glow
      const radialGlow = ctx.createRadialGradient(cx, cy, 5, cx, cy, 140);
      radialGlow.addColorStop(0, "rgba(97, 218, 251, 0.45)");
      radialGlow.addColorStop(0.3, "rgba(97, 218, 251, 0.15)");
      radialGlow.addColorStop(0.7, "rgba(225, 220, 201, 0.05)");
      radialGlow.addColorStop(1, "rgba(10, 10, 12, 0)");
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.fill();

      // Core nucleus sphere
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18);
      coreGlow.addColorStop(0, "#FFFFFF");
      coreGlow.addColorStop(0.4, "#61DAFB");
      coreGlow.addColorStop(1, "rgba(97, 218, 251, 0)");
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 18 + Math.sin(time * 3) * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 3 React Atom Ellipses (0°, 60°, 120°)
      const angles = [0, Math.PI / 3, (2 * Math.PI) / 3];

      angles.forEach((angle, idx) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + Math.sin(time * 0.4 + idx) * 0.05);

        // Ellipse path
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(97, 218, 251, 0.38)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // High-energy rim shimmer
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
        ctx.lineWidth = 0.75;
        ctx.stroke();

        // Orbiting electron beads
        const electronT = time * 1.8 + idx * ((Math.PI * 2) / 3);
        const ex = rx * Math.cos(electronT);
        const ey = ry * Math.sin(electronT);

        // Electron glow
        const eGlow = ctx.createRadialGradient(ex, ey, 0, ex, ey, 10);
        eGlow.addColorStop(0, "#FFFFFF");
        eGlow.addColorStop(0.4, "#61DAFB");
        eGlow.addColorStop(1, "rgba(97, 218, 251, 0)");
        ctx.fillStyle = eGlow;
        ctx.beginPath();
        ctx.arc(ex, ey, 10, 0, Math.PI * 2);
        ctx.fill();

        // Electron sharp core
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return (
    <Box
      id="brand-orb-loader"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: Colors.BACKGROUND,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: isExiting ? "none" : "auto",
        transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.08)" : "scale(1)",
      }}
    >
      {/* Background subtle radial gradient */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(97, 218, 251, 0.06) 0%, rgba(10, 10, 12, 0) 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Center 2D React Atom Canvas */}
      <Box
        id="orb-canvas-container"
        sx={{
          position: "relative",
          width: 280,
          height: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: isExiting ? "scale(0.85)" : "scale(1)",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            filter: "drop-shadow(0 0 24px rgba(97, 218, 251, 0.35))",
          }}
        />
      </Box>

      {/* Typography & Counter */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.2,
          mt: 2,
          zIndex: 2,
        }}
      >
        {/* Name */}
        <Typography
          variant="h6"
          sx={{
            color: Colors.WHITE,
            fontSize: { xs: "0.95rem", sm: "1.1rem" },
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontFamily: "var(--font-titillium-web), sans-serif",
          }}
        >
          Akash Gupta
        </Typography>

        {/* Role: strictly Frontend Developer */}
        <Typography
          variant="caption"
          sx={{
            color: Colors.HEADING,
            fontSize: "0.75rem",
            fontWeight: 500,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          Frontend Developer
        </Typography>

        {/* Counter */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            mt: 1.5,
            px: 2,
            py: 0.6,
            borderRadius: "999px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#61DAFB",
              boxShadow: "0 0 8px #61DAFB",
              animation: "pulse 1.4s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 0.4, transform: "scale(0.8)" },
                "50%": { opacity: 1, transform: "scale(1.2)" },
              },
            }}
          />
          <Typography
            sx={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: Colors.HEADING,
              letterSpacing: "0.15em",
            }}
          >
            {progress.toString().padStart(3, "0")}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
