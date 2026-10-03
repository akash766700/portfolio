"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

export interface DecryptedTextProps {
  text: string;
  revealDuration?: number;
  characters?: string;
  sx?: any;
  hoverEffect?: boolean;
}

// ── Ultra-Smooth Decrypted Text (Direct DOM Mutation, Throttled Hacker Rhythm, 60fps) ──
export default function DecryptedText({
  text,
  revealDuration = 2400,
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

export { DecryptedText };
