"use client";

import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

export interface ReactAtomCanvasProps {
  size?: number;
  isExiting?: boolean;
}

// ── Ultra-HD, Crystal-Crisp Retina React Atom Canvas (Zero-GC, 60fps Locked, Pre-rendered Sprites) ──
export default function ReactAtomCanvas({
  size = 150,
  isExiting = false,
}: ReactAtomCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isExiting) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Crisp 2x Retina DPI (optimal sweet spot for performance and razor-sharp clarity)
    const dpr = typeof window !== "undefined"
      ? Math.min(window.devicePixelRatio || 1, 2)
      : 2;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cx = size / 2;
    const cy = size / 2;
    const rx = size * 0.39;
    const ry = size * 0.145;

    // ── 1. PRE-RENDER AMBIENT GLOW SPRITE (Zero allocations per frame) ──
    const ambCanvas = document.createElement("canvas");
    ambCanvas.width = size * dpr;
    ambCanvas.height = size * dpr;
    const ambCtx = ambCanvas.getContext("2d");
    if (ambCtx) {
      ambCtx.scale(dpr, dpr);
      const grad = ambCtx.createRadialGradient(cx, cy, 2, cx, cy, size * 0.46);
      grad.addColorStop(0, "rgba(97, 218, 251, 0.42)");
      grad.addColorStop(0.35, "rgba(97, 218, 251, 0.14)");
      grad.addColorStop(0.7, "rgba(97, 218, 251, 0.03)");
      grad.addColorStop(1, "rgba(7, 7, 9, 0)");
      ambCtx.fillStyle = grad;
      ambCtx.beginPath();
      ambCtx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
      ambCtx.fill();
    }

    // ── 2. PRE-RENDER HIGH-DEFINITION ELECTRON SPRITE (Zero allocations per frame) ──
    const eBaseSize = 36;
    const eCanvas = document.createElement("canvas");
    eCanvas.width = eBaseSize * dpr;
    eCanvas.height = eBaseSize * dpr;
    const eCtx = eCanvas.getContext("2d");
    if (eCtx) {
      eCtx.scale(dpr, dpr);
      const ec = eBaseSize / 2;
      // Photonic outer halo
      const bloom = eCtx.createRadialGradient(ec, ec, 0, ec, ec, ec);
      bloom.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      bloom.addColorStop(0.25, "rgba(97, 218, 251, 0.85)");
      bloom.addColorStop(0.65, "rgba(97, 218, 251, 0.22)");
      bloom.addColorStop(1, "rgba(97, 218, 251, 0)");
      eCtx.fillStyle = bloom;
      eCtx.beginPath();
      eCtx.arc(ec, ec, ec, 0, Math.PI * 2);
      eCtx.fill();

      // Electric cyan core
      const core = eCtx.createRadialGradient(ec - 0.8, ec - 0.8, 0, ec, ec, 4.0);
      core.addColorStop(0, "#FFFFFF");
      core.addColorStop(0.5, "#61DAFB");
      core.addColorStop(1, "#1FB6E5");
      eCtx.fillStyle = core;
      eCtx.beginPath();
      eCtx.arc(ec, ec, 4.0, 0, Math.PI * 2);
      eCtx.fill();

      // Sharp white center spark
      eCtx.fillStyle = "#FFFFFF";
      eCtx.beginPath();
      eCtx.arc(ec, ec, 1.8, 0, Math.PI * 2);
      eCtx.fill();
    }

    // ── 3. PRE-RENDER FUSION NUCLEUS SPRITE (Zero allocations per frame) ──
    const nucSize = 54;
    const nucCanvas = document.createElement("canvas");
    nucCanvas.width = nucSize * dpr;
    nucCanvas.height = nucSize * dpr;
    const nucCtx = nucCanvas.getContext("2d");
    if (nucCtx) {
      nucCtx.scale(dpr, dpr);
      const nc = nucSize / 2;
      // Outer aura
      const aura = nucCtx.createRadialGradient(nc, nc, 0, nc, nc, nc);
      aura.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      aura.addColorStop(0.28, "rgba(97, 218, 251, 0.85)");
      aura.addColorStop(0.65, "rgba(97, 218, 251, 0.22)");
      aura.addColorStop(1, "rgba(97, 218, 251, 0)");
      nucCtx.fillStyle = aura;
      nucCtx.beginPath();
      nucCtx.arc(nc, nc, nc, 0, Math.PI * 2);
      nucCtx.fill();

      // Core electric sphere
      const core = nucCtx.createRadialGradient(nc - 1.2, nc - 1.2, 0, nc, nc, 9.5);
      core.addColorStop(0, "#FFFFFF");
      core.addColorStop(0.45, "#61DAFB");
      core.addColorStop(1, "#1890B8");
      nucCtx.fillStyle = core;
      nucCtx.beginPath();
      nucCtx.arc(nc, nc, 9.5, 0, Math.PI * 2);
      nucCtx.fill();

      // Center spark
      nucCtx.fillStyle = "#FFFFFF";
      nucCtx.beginPath();
      nucCtx.arc(nc, nc, 2.5, 0, Math.PI * 2);
      nucCtx.fill();

      // Optical glint cross-hairs
      nucCtx.strokeStyle = "rgba(255, 255, 255, 0.75)";
      nucCtx.lineWidth = 0.9;
      nucCtx.beginPath();
      nucCtx.moveTo(nc - 8, nc);
      nucCtx.lineTo(nc + 8, nc);
      nucCtx.moveTo(nc, nc - 8);
      nucCtx.lineTo(nc, nc + 8);
      nucCtx.stroke();
    }

    let time = 0;
    let animId: number;
    let lastTime = performance.now();
    const ringAngles = [0, Math.PI / 3, (2 * Math.PI) / 3];

    // Pre-allocated coordinates to ensure 0 GC during render loop
    const electronState = [
      { sx: 0, sy: 0, depth: 0, t: 0, ringAngle: 0 },
      { sx: 0, sy: 0, depth: 0, t: 0, ringAngle: 0 },
      { sx: 0, sy: 0, depth: 0, t: 0, ringAngle: 0 },
    ];

    const render = (now: number) => {
      const delta = Math.min(32, now - lastTime);
      lastTime = now;
      time += delta * 0.0013;

      ctx.clearRect(0, 0, size, size);

      // 1. Ambient Glow (Blitted with zero allocations)
      ctx.drawImage(ambCanvas, 0, 0, size, size);

      // Calculate electron 3D positions
      for (let i = 0; i < 3; i++) {
        const ringAngle = ringAngles[i] + Math.sin(time * 0.4 + i) * 0.025;
        const t = time * 1.05 + i * ((Math.PI * 2) / 3);
        const cosT = Math.cos(t);
        const sinT = Math.sin(t);
        const lx = rx * cosT;
        const ly = ry * sinT;
        const cosR = Math.cos(ringAngle);
        const sinR = Math.sin(ringAngle);

        const st = electronState[i];
        st.sx = cx + (lx * cosR - ly * sinR);
        st.sy = cy + (lx * sinR + ly * cosR);
        st.depth = sinT;
        st.t = t;
        st.ringAngle = ringAngle;
      }

      // 2. Draw Orbital Rings
      for (let i = 0; i < 3; i++) {
        const st = electronState[i];
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(st.ringAngle);

        // Layer A: Outer Cyan Glow Rim
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(97, 218, 251, 0.20)";
        ctx.lineWidth = 3.0;
        ctx.stroke();

        // Layer B: Vivid High-Definition Cyan Ring
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(97, 218, 251, 0.78)";
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Layer C: Razor-Sharp White Specular Rim
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 0.65;
        ctx.stroke();

        // Layer D: Photon Comet Trail
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, st.t - 0.55, st.t);
        ctx.strokeStyle = "rgba(180, 245, 255, 0.82)";
        ctx.lineWidth = 1.9;
        ctx.stroke();

        ctx.restore();
      }

      // 3. Draw Back-Hemisphere Electrons (z < 0)
      const halfE = eBaseSize / 2;
      for (let i = 0; i < 3; i++) {
        const st = electronState[i];
        if (st.depth < 0) {
          const s = 0.85 + (st.depth + 1) * 0.15;
          const w = eBaseSize * s;
          const h = eBaseSize * s;
          ctx.globalAlpha = 0.78;
          ctx.drawImage(eCanvas, st.sx - w / 2, st.sy - h / 2, w, h);
        }
      }

      // 4. Draw Nucleus (Center Core)
      const halfNuc = nucSize / 2;
      const nucScale = 1 + Math.sin(time * 2.8) * 0.04;
      const nw = nucSize * nucScale;
      const nh = nucSize * nucScale;
      ctx.globalAlpha = 1.0;
      ctx.drawImage(nucCanvas, cx - nw / 2, cy - nh / 2, nw, nh);

      // 5. Draw Front-Hemisphere Electrons (z >= 0)
      for (let i = 0; i < 3; i++) {
        const st = electronState[i];
        if (st.depth >= 0) {
          const s = 1.0 + st.depth * 0.18;
          const w = eBaseSize * s;
          const h = eBaseSize * s;
          ctx.globalAlpha = 1.0;
          ctx.drawImage(eCanvas, st.sx - w / 2, st.sy - h / 2, w, h);
        }
      }

      ctx.globalAlpha = 1.0;
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
        willChange: "transform",
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
