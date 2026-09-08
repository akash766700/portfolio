"use client";

import React from "react";
import { Box } from "@mui/material";
import ThreeDPaper, { ThreeDPaperVariant } from "@/components/3D/ThreeDPaper";

interface PaperCardProps {
  variant?: ThreeDPaperVariant;
  className?: string;
  side?: "left" | "right";
  edition?: string;
  volume?: string;
  tag?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  items?: string[];
  footerText?: string;
  onClick?: () => void;
}

export default function PaperCard({
  variant = "site-of-the-year",
  className,
  onClick,
}: PaperCardProps) {
  return (
    <Box
      className={className}
      onClick={onClick}
      sx={{
        position: "relative",
        width: { xs: 300, sm: 340, md: 380, lg: 430 },
        height: { xs: 460, sm: 520, md: 580, lg: 640 },
        overflow: "visible",
        pointerEvents: "auto",
        background: "transparent",
        border: "none",
        boxShadow: "none",
        filter: "drop-shadow(0 25px 40px rgba(0, 0, 0, 0.75)) drop-shadow(0 0 35px rgba(206, 242, 168, 0.12))",
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      <ThreeDPaper variant={variant} />
    </Box>
  );
}
