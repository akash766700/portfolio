"use client";

import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

export interface ReactAtomCanvasProps {
  size?: number;
  isExiting?: boolean;
}

// ── Compact, Instant & Continuous Delta-Time Orbiting React Atom Canvas (Zero-GC, 60fps Locked) ──
export default function ReactAtomCanvas({
  size = 145,
  isExiting = false,
}: ReactAtomCanvasProps) {
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

export { ReactAtomCanvas };
