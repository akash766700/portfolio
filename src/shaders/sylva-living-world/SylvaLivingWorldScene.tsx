"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  SylvaLivingWorldVariant,
  SylvaLivingWorldSceneProps,
} from "./types";
import {
  SYLVA_LIVING_WORLD_VARIANTS,
} from "./types";
import {
  VARIANT_LABELS,
  VARIANT_BACKGROUNDS,
} from "./styles";
import { buildSceneDocument } from "./builder";

export * from "./types";
export * from "./styles";
export * from "./variants";
export * from "./builder";

export function SylvaLivingWorldScene({
  variant = "living-green",
  className = "",
  style,
  startScan,
}: SylvaLivingWorldSceneProps) {
  const safeVariant = SYLVA_LIVING_WORLD_VARIANTS.includes(variant)
    ? variant
    : "living-green";
  const [ready, setReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (startScan) {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "SYLVA_START_SCAN" }, "*");
      }
    }
  }, [startScan, ready]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;
      const rect = iframe.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      iframe.contentWindow.postMessage(
        {
          type: "SYLVA_POINTER_MOVE",
          clientX,
          clientY,
        },
        "*"
      );
    };

    const handlePointerLeave = () => {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;
      iframe.contentWindow.postMessage({ type: "SYLVA_POINTER_LEAVE" }, "*");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const label = VARIANT_LABELS[safeVariant];

  return (
    <div
      className={`threeui-background sylva-living-world-scene ${className}`}
      role="img"
      aria-label={`${label} with ferns, flowers, pollen, and a butterfly`}
      data-variant={safeVariant}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "transparent",
        backgroundColor: "transparent",
        pointerEvents: "auto",
        ...style,
      }}
    >
      <iframe
        ref={iframeRef}
        title={label}
        src="/sylva/sylva-scene.html?v=v3"
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
          opacity: ready ? 1 : 0,
          transition: "opacity 400ms ease-out",
        }}
      />
    </div>
  );
}
