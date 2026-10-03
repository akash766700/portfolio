"use client";

import React from "react";
import HeroSection, { IntroStage } from "./HeroSection";

interface HeroSectionProps {
  onStageChange?: (stage: IntroStage) => void;
}

const HeroSectionLayout = ({ onStageChange }: HeroSectionProps) => {
  return <HeroSection onStageChange={onStageChange} />;
};

export default HeroSectionLayout;
export { HeroSectionLayout as HeroSection };
export type { IntroStage };
