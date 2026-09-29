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
}: SylvaLivingWorldSceneProps) {
  const safeVariant = SYLVA_LIVING_WORLD_VARIANTS.includes(variant)
    ? variant
    : "living-green";
  const hostRef = useRef<HTMLDivElement>(null);
  const [hostVisible, setHostVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) =>
      setHostVisible(entry?.isIntersecting ?? true),
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const source = useMemo(
    () => buildSceneDocument(reducedMotion, safeVariant),
    [reducedMotion, safeVariant],
  );
  const mounted = hostVisible && documentVisible;
  const label = VARIANT_LABELS[safeVariant];
  const background = VARIANT_BACKGROUNDS[safeVariant];

  useEffect(() => {
    setReady(false);
  }, [mounted, reducedMotion, safeVariant]);

  return (
    <div
      ref={hostRef}
      className={`threeui-background sylva-living-world-scene${className ? ` ${className}` : ""}`}
      role="img"
      aria-label={`${label} with ferns, flowers, pollen, and a butterfly`}
      data-variant={safeVariant}
      data-state={ready ? "ready" : "loading"}
      style={{ background, pointerEvents: "auto", ...style }}
    >
      {mounted ? (
        <iframe
          key={`${safeVariant}-${reducedMotion ? "reduced" : "motion"}`}
          title={label}
          srcDoc={source}
          sandbox="allow-scripts"
          loading="eager"
          onLoad={() => setReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            width: "100%",
            height: "100%",
            border: 0,
            background,
          }}
        />
      ) : null}
    </div>
  );
}
