"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Colors } from "@/utils/enum";

interface BrandOrbLoaderProps {
  onComplete?: () => void;
  isExiting?: boolean;
}

interface DecryptedTextProps {
  text: string;
  revealDuration?: number;
  characters?: string;
  sx?: any;
  hoverEffect?: boolean;
}

// ── Ultra-Smooth Decrypted Text (Direct DOM Mutation, Throttled Hacker Rhythm, 60fps) ──
function DecryptedText({
  text,
  revealDuration = 1400,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>~",
  sx,
  hoverEffect = true,
}: DecryptedTextProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const startDecryption = () => {
    if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    if (!elRef.current) return;

    const el = elRef.current;
    const totalChars = text.length;
    let startTime: number | null = null;
    let lastShuffle = 0;
    let cachedRandom = "";

    const frame = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / revealDuration);
      const revealedLength = Math.floor(progress * totalChars);

      // Throttle random glyph update to every 38ms for distinct, clean cyber rhythm
      if (now - lastShuffle > 38 || !cachedRandom) {
        lastShuffle = now;
        let rand = "";
        for (let j = 0; j < totalChars; j++) {
          rand += characters[Math.floor(Math.random() * characters.length)];
        }
        cachedRandom = rand;
      }

      let output = "";
      for (let i = 0; i < totalChars; i++) {
        if (text[i] === " ") {
          output += " ";
        } else if (i < revealedLength) {
          output += text[i];
        } else {
          output += cachedRandom[i] || characters[0];
        }
      }

      el.textContent = output;

      if (progress < 1) {
        animFrameId.current = requestAnimationFrame(frame);
      } else {
        el.textContent = text;
      }
    };

    animFrameId.current = requestAnimationFrame(frame);
  };

  useEffect(() => {
    startDecryption();
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [text]);

  return (
    <Box
      ref={elRef}
      onMouseEnter={() => {
        if (hoverEffect) {
          setIsHovered(true);
          startDecryption();
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        cursor: hoverEffect ? "pointer" : "default",
        userSelect: "none",
        transition: "transform 0.3s ease, filter 0.3s ease",
        display: "inline-block",
        ...sx,
        ...(isHovered && {
          filter:
            "brightness(1.35) drop-shadow(0 0 16px rgba(97, 218, 251, 0.75))",
          transform: "scale(1.035)",
        }),
      }}
    >
      {text}
    </Box>
  );
}

// ── Compact, Instant & Continuous Delta-Time Orbiting React Atom Canvas (Zero-GC, 60fps Locked) ──
function ReactAtomCanvas({ size = 145, isExiting = false }: { size?: number; isExiting?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isExiting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr =
      typeof window !== "undefined"
        ? Math.min(window.devicePixelRatio || 1, 2)
        : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const rx = size * 0.38;
    const ry = size * 0.14;

    // ── Pre-render static ambient glow offscreen (Zero GC per frame) ──
    const ambientCanvas = document.createElement("canvas");
    ambientCanvas.width = size * dpr;
    ambientCanvas.height = size * dpr;
    const ambCtx = ambientCanvas.getContext("2d");
    if (ambCtx) {
      ambCtx.scale(dpr, dpr);
      const ambient = ambCtx.createRadialGradient(
        cx,
        cy,
        4,
        cx,
        cy,
        size * 0.44
      );
      ambient.addColorStop(0, "rgba(97, 218, 251, 0.45)");
      ambient.addColorStop(0.4, "rgba(97, 218, 251, 0.12)");
      ambient.addColorStop(1, "rgba(10, 10, 12, 0)");
      ambCtx.fillStyle = ambient;
      ambCtx.beginPath();
      ambCtx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
      ambCtx.fill();
    }

    // ── Pre-render electron ball sprite offscreen (Zero GC per frame) ──
    const eSize = 24;
    const electronCanvas = document.createElement("canvas");
    electronCanvas.width = eSize * dpr;
    electronCanvas.height = eSize * dpr;
    const eCtx = electronCanvas.getContext("2d");
    if (eCtx) {
      eCtx.scale(dpr, dpr);
      const ecx = eSize / 2;
      const ecy = eSize / 2;
      const eGlow = eCtx.createRadialGradient(ecx, ecy, 0, ecx, ecy, 8);
      eGlow.addColorStop(0, "#FFFFFF");
      eGlow.addColorStop(0.5, "#61DAFB");
      eGlow.addColorStop(1, "rgba(97, 218, 251, 0)");
      eCtx.fillStyle = eGlow;
      eCtx.beginPath();
      eCtx.arc(ecx, ecy, 8, 0, Math.PI * 2);
      eCtx.fill();

      // Sharp white nucleus core of electron
      eCtx.fillStyle = "#FFFFFF";
      eCtx.beginPath();
      eCtx.arc(ecx, ecy, 2.2, 0, Math.PI * 2);
      eCtx.fill();
    }

    // ── Pre-create static nucleus radial gradient ──
    const nucleusGrad = ctx.createRadialGradient(
      cx,
      cy,
      0,
      cx,
      cy,
      size * 0.08
    );
    nucleusGrad.addColorStop(0, "#FFFFFF");
    nucleusGrad.addColorStop(0.45, "#61DAFB");
    nucleusGrad.addColorStop(1, "rgba(97, 218, 251, 0)");

    let time = 0;
    let animId: number;
    let lastTime = performance.now();
    const angles = [0, Math.PI / 3, (2 * Math.PI) / 3];

    const render = (now: number) => {
      const delta = Math.min(32, now - lastTime);
      lastTime = now;
      time += delta * 0.0012;

      ctx.clearRect(0, 0, size, size);

      // 1. Draw cached ambient glow (0 allocations)
      ctx.drawImage(ambientCanvas, 0, 0, size, size);

      // 2. Nucleus core with breathing pulse (0 allocations)
      const coreR = size * 0.068 + Math.sin(time * 2.2) * 1.2;
      ctx.fillStyle = nucleusGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      // Sharp white center spark
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();

      // 3. Three React atom orbital rings with cached orbiting electron sprites
      angles.forEach((angle, idx) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle + Math.sin(time * 0.35 + idx) * 0.035);

        // Ellipse ring
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(97, 218, 251, 0.55)";
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Inner rim
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // ── ORBITING BALL (ELECTRON) ──
        // Graceful, calm orbital speed (0.95) & zero allocations
        const electronT = time * 0.95 + idx * ((Math.PI * 2) / 3);
        const ex = rx * Math.cos(electronT);
        const ey = ry * Math.sin(electronT);

        ctx.drawImage(electronCanvas, ex - 12, ey - 12, 24, 24);

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [size, isExiting]);

  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        filter: "drop-shadow(0 0 25px rgba(97, 218, 251, 0.5))",
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: "block",
        }}
      />
    </Box>
  );
}

export default function BrandOrbLoader({
  onComplete,
  isExiting = false,
}: BrandOrbLoaderProps) {
  const lineRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completedFired = useRef(false);

  // ── 5.4s Luxury Progress Loop (Continuous Subpixel Updates, Zero Hitching) ──
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 5400; // ms
    let frameId: number;
    let lastIntVal = -1;

    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);

      // Liquid smooth sine easing (starts like water, glides smoothly to 100)
      const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);

      // Continuous subpixel progress line (glides at 60fps/120fps without discrete percent jumping)
      const continuousPercent = Math.min(100, ease * 100);
      if (lineRef.current) {
        lineRef.current.style.width = `${continuousPercent.toFixed(2)}%`;
      }

      // Counter and phase updates throttled to integer transitions
      const current = Math.min(100, Math.floor(continuousPercent));
      if (current !== lastIntVal) {
        lastIntVal = current;
        const formatted =
          current < 10 ? `00${current}` : current < 100 ? `0${current}` : "100";

        if (counterRef.current) {
          counterRef.current.textContent = formatted;
        }
      }

      if (t < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        if (!completedFired.current) {
          completedFired.current = true;
          setTimeout(() => {
            onCompleteRef.current?.();
          }, 350);
        }
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <Box
      id="brand-curtain-loader"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: isExiting ? "none" : "auto",
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      {/* ════════ TOP CURTAIN PANEL ════════ */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          backgroundColor: "#070709",
          transform: isExiting ? "translateY(-101%)" : "translateY(0%)",
          transition: "transform 0.85s cubic-bezier(0.85, 0, 0.15, 1)",
          willChange: "transform",
        }}
      />

      {/* ════════ BOTTOM CURTAIN PANEL ════════ */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          backgroundColor: "#070709",
          transform: isExiting ? "translateY(101%)" : "translateY(0%)",
          transition: "transform 0.85s cubic-bezier(0.85, 0, 0.15, 1)",
          willChange: "transform",
        }}
      />

      {/* ════════ BOTTOM HORIZONTAL LASER PROGRESS LINE ════════ */}
      <Box
        ref={lineRef}
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "0%",
          height: "2.5px",
          zIndex: 10,
          background:
            "linear-gradient(90deg, rgba(97, 218, 251, 0.1) 0%, #61DAFB 60%, #CEF2A8 90%, #FFFFFF 100%)",
          boxShadow:
            "0 0 16px rgba(97, 218, 251, 0.9), 0 0 32px rgba(206, 242, 168, 0.5)",
          opacity: isExiting ? 0 : 1,
          transition: "opacity 0.25s ease",
          pointerEvents: "none",
          willChange: "width",
        }}
      >
        {/* Leading glowing laser head dot */}
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translate(50%, -50%)",
            width: 7,
            height: 7,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            boxShadow:
              "0 0 10px 2px rgba(97, 218, 251, 1), 0 0 20px 4px rgba(206, 242, 168, 0.6)",
          }}
        />
      </Box>

      {/* ════════ CONTENT LAYER ════════ */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: { xs: 3, sm: 4, md: 5 },
          opacity: isExiting ? 0 : 1,
          transition: "opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* Empty top spacer */}
        <Box />

        {/* ── CENTER: COMPACT REACT ATOM + SLEEK NAME + ROLE ── */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 5,
            pointerEvents: "auto",
            width: "max-content",
          }}
        >
          {/* Orbiting React Atom with continuously rotating electron balls */}
          <Box sx={{ mb: { xs: 1.5, md: 2 } }}>
            <ReactAtomCanvas size={145} isExiting={isExiting} />
          </Box>

          {/* User Name with Sleek Compact Typography (Science Gothic) */}
          <DecryptedText
            text="Akash Gupta"
            revealDuration={1300}
            sx={{
              fontFamily: "var(--font-science-gothic), sans-serif",
              fontSize: { xs: "1.125rem", sm: "1.375rem", md: "1.625rem" },
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: { xs: "0.2em", md: "0.24em" },
              textTransform: "uppercase",
              color: Colors.WHITE,
              textShadow: "0 0 25px rgba(97, 218, 251, 0.25)",
            }}
          />

          {/* Profile / Role (Waterfall font) */}
          <DecryptedText
            text="Frontend Developer"
            revealDuration={1500}
            characters="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~*&"
            sx={{
              fontFamily: "var(--font-waterfall), cursive",
              fontSize: { xs: "1.35rem", sm: "1.55rem", md: "1.8rem" },
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "0.03em",
              color: "#61DAFB",
              mt: 0.3,
              textShadow: "0 0 18px rgba(97, 218, 251, 0.45)",
            }}
          />
        </Box>

        {/* ── BOTTOM ROW: COMPACT REFINED PERCENTAGE COUNTER ── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            width: "100%",
            pb: 1.2,
          }}
        >
          {/* Compact Refined Percentage Counter */}
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              gap: 0.5,
              ml: "auto",
            }}
          >
            <Typography
              component="span"
              ref={counterRef}
              sx={{
                fontFamily: "var(--font-titillium-web), sans-serif",
                fontSize: { xs: "1.8rem", sm: "2.3rem", md: "2.8rem" },
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: Colors.WHITE,
                textShadow: "0 0 30px rgba(255, 255, 255, 0.15)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              000
            </Typography>
            <Typography
              component="span"
              sx={{
                fontFamily: "var(--font-geist-mono), monospace",
                fontSize: { xs: "0.85rem", sm: "1rem", md: "1.15rem" },
                fontWeight: 400,
                color: "#61DAFB",
                textShadow: "0 0 15px rgba(97, 218, 251, 0.4)",
                lineHeight: 1,
              }}
            >
              %
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
