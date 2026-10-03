"use client";

import React from "react";
import {
  SylvaLivingWorldScene,
  SylvaLivingWorldSceneProps,
} from "./sylva-living-world/SylvaLivingWorldScene";

export default function ShadersLayout(props: SylvaLivingWorldSceneProps) {
  return <SylvaLivingWorldScene {...props} />;
}

export { SylvaLivingWorldScene };
export type { SylvaLivingWorldSceneProps };
