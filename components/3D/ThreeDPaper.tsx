"use client";

import React, { useState, useEffect, CSSProperties } from "react";

export type ThreeDPaperVariant =
  | "original"
  | "site-of-the-year"
  | "japanese"
  | "certificate";

export interface ThreeDPaperProps {
  variant?: ThreeDPaperVariant;
  className?: string;
  style?: CSSProperties;
}

const URLS: Record<ThreeDPaperVariant, string> = {
  original: "/3d-paper/3d-paper.html",
  "site-of-the-year": "/3d-paper/3d-paper-site-of-the-year.html",
  japanese: "/3d-paper/3d-paper-japanese.html",
  certificate: "/3d-paper/3d-paper-certificate.html",
};

const TITLES: Record<ThreeDPaperVariant, string> = {
  original: "3D Paper",
  "site-of-the-year": "3D Paper — Site of the Year",
  japanese: "3D Paper — 認定証",
  certificate: "3D Paper — Certificate",
};

export function ThreeDPaper({
  variant = "site-of-the-year",
  className = "",
  style,
}: ThreeDPaperProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    // Fetch fresh HTML content with cache-buster to completely bypass browser disk cache
    fetch(`${URLS[variant]}?t=${Date.now()}`)
      .then((res) => res.text())
      .then((html) => {
        if (active) {
          setHtmlContent(html);
        }
      })
      .catch((err) => console.error("Failed to load 3d paper source:", err));

    return () => {
      active = false;
    };
  }, [variant]);

  return (
    <div
      className={`threeui-background three-d-paper ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "visible",
        background: "transparent",
        backgroundColor: "transparent",
        pointerEvents: "auto",
        colorScheme: "dark",
        ...style,
      }}
    >
      {htmlContent ? (
        <iframe
          title={TITLES[variant]}
          srcDoc={htmlContent}
          sandbox="allow-scripts allow-same-origin"
          loading="eager"
          onLoad={() => setReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            width: "100%",
            height: "100%",
            border: 0,
            background: "transparent",
            backgroundColor: "transparent",
            colorScheme: "dark",
            opacity: ready ? 1 : 0,
            pointerEvents: "auto",
            transition: "opacity 300ms ease-out",
          }}
        />
      ) : null}
    </div>
  );
}

export default ThreeDPaper;
