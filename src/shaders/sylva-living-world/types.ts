import type { CSSProperties } from "react";

export const SYLVA_LIVING_WORLD_VARIANTS = [
  "living-green",
  "sakura-sunset",
  "maple-autumn",
  "sequoia-mist",
] as const;

export type SylvaLivingWorldVariant =
  (typeof SYLVA_LIVING_WORLD_VARIANTS)[number];

export type SylvaLivingWorldSceneProps = {
  variant?: SylvaLivingWorldVariant;
  className?: string;
  style?: CSSProperties;
  startScan?: boolean;
};
