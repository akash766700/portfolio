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
    let frameId: number | null = null;
    let pendingX = 0;
    let pendingY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;
      const rect = iframe.getBoundingClientRect();
      pendingX = e.clientX - rect.left;
      pendingY = e.clientY - rect.top;

      if (frameId === null) {
        frameId = requestAnimationFrame(() => {
          frameId = null;
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              {
                type: "SYLVA_POINTER_MOVE",
                clientX: pendingX,
                clientY: pendingY,
              },
              "*"
            );
          }
        });
      }
    };

    const handlePointerLeave = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;
      iframe.contentWindow.postMessage({ type: "SYLVA_POINTER_LEAVE" }, "*");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
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
        src="/sylva/sylva-scene.html?v=v5"
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
