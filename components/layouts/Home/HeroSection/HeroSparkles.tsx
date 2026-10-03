"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  vx: number;
  vy: number;
  color: string;
}

export default function HeroSparkles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.parentElement?.clientHeight || window.innerHeight);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);

    // Color palette: Cyan / Ice blue and subtle Lime Champagne
    const colors = [
      "97, 218, 251", // Cyan
      "97, 218, 251", // Cyan
      "206, 242, 168", // Lime
      "255, 255, 255", // Laser White
      "150, 235, 255", // Ice Blue
    ];

    const count = 45;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.8,
        baseAlpha: Math.random() * 0.4 + 0.35,
        twinkleSpeed: Math.random() * 1.4 + 0.7,
        twinkleOffset: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -(Math.random() * 0.24 + 0.1), // Gently floating upward
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const t = time * 0.001;

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        p.x += p.vx + Math.sin(t * 0.7 + p.twinkleOffset) * 0.1;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Twinkle pulse
        const twinkle = Math.sin(t * p.twinkleSpeed + p.twinkleOffset);
        const currentAlpha = Math.max(0.12, Math.min(0.95, p.baseAlpha + twinkle * 0.32));

        // Outer soft glow halo (fast & hardware accelerated, avoids expensive shadowBlur)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha * 0.22})`;
        ctx.fill();

        // Inner bright spark core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
