"use client";

import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { Colors } from "@/utils/enum";
import DecryptedText from "./DecryptedText";
import ReactAtomCanvas from "./ReactAtomCanvas";

export interface BrandOrbLoaderProps {
  onComplete?: () => void;
  isExiting?: boolean;
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

  // ── Extended 4.8s Progress Loop (Liquid smooth progress) ──
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 4800; // ms
    let frameId: number;
    let lastIntVal = -1;

    const triggerComplete = () => {
      if (completedFired.current) return;
      completedFired.current = true;
      if (lineRef.current) lineRef.current.style.width = "100%";
      if (counterRef.current) counterRef.current.textContent = "100";
      setTimeout(() => {
        onCompleteRef.current?.();
      }, 80);
    };

    const step = (now: number) => {
      if (completedFired.current) return;
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);

      // Liquid smooth sine easing
      const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
      const continuousPercent = Math.min(100, ease * 100);

      if (lineRef.current) {
        lineRef.current.style.width = `${continuousPercent.toFixed(2)}%`;
      }

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
        triggerComplete();
      }
    };

    frameId = requestAnimationFrame(step);

    // Safe interaction skip (armed after 3500ms so browser reload keys/clicks don't abort immediately)
    const handleFastForward = () => triggerComplete();
    const armTimer = setTimeout(() => {
      window.addEventListener("click", handleFastForward, { once: true });
      window.addEventListener("keydown", handleFastForward, { once: true });
      window.addEventListener("wheel", handleFastForward, { once: true, passive: true });
      window.addEventListener("touchstart", handleFastForward, { once: true, passive: true });
    }, 3500);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(armTimer);
      window.removeEventListener("click", handleFastForward);
      window.removeEventListener("keydown", handleFastForward);
      window.removeEventListener("wheel", handleFastForward);
      window.removeEventListener("touchstart", handleFastForward);
    };
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
        backgroundColor: isExiting ? "transparent" : "#070709",
        transition: "background-color 0.4s ease",
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

export { BrandOrbLoader };
