"use client";

import React from "react";
import BrandOrbLoader, { BrandOrbLoaderProps } from "./BrandOrbLoader";

export default function BrandOrbLayout(props: BrandOrbLoaderProps) {
  return <BrandOrbLoader {...props} />;
}

export { BrandOrbLoader };
export { default as ReactAtomCanvas } from "./ReactAtomCanvas";
export { default as DecryptedText } from "./DecryptedText";
export type { BrandOrbLoaderProps };
