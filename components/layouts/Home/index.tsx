"use client";

import React from "react";
import HeroSection, { IntroStage } from "./HeroSection";

export interface HomeLayoutProps {
  onStageChange?: (stage: IntroStage) => void;
}

export default function HomeLayout({ onStageChange }: HomeLayoutProps) {
  return (
    <>
      <HeroSection onStageChange={onStageChange} />
    </>
  );
}

export { HomeLayout, HeroSection };
export type { IntroStage };
