import React, { CSSProperties } from "react";

export interface PersonalData {
  name: string;
  role: string;
  specialization: string;
  tagline: string;
  about: string;
}

export interface ContactData {
  email: string;
  resumeUrl: string;
  github: string;
  linkedin: string;
  phone?: string;
  twitter?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface PortfolioData {
  personal: PersonalData;
  contact: ContactData;
  skillsList: string[];
  skillCategories: SkillCategory[];
}

export type IntroStage =
  | "loader"
  | "spider-zoom"
  | "spider-drop"
  | "hero-settle";

export interface HeroSectionProps {
  onStageChange?: (stage: IntroStage) => void;
}

export interface LiquidButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
}

export interface PaperCardProps {
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

export interface SparkleParticle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  vx: number;
  vy: number;
  color: string;
}

export type SpiderStage = "loader" | "huge" | "hero";

export interface SpiderHeroSceneProps {
  stage?: SpiderStage;
  className?: string;
  style?: CSSProperties;
  dropFromTop?: boolean;
}

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

export interface ModelViewerProps {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  autoRotate?: boolean;
  className?: string;
  style?: CSSProperties;
}

export interface BrandOrbLoaderProps {
  onComplete?: () => void;
  isExiting?: boolean;
}

export interface DecryptedTextProps {
  text: string;
  revealDuration?: number;
  characters?: string;
  sx?: any;
  hoverEffect?: boolean;
}

export interface ReactAtomCanvasProps {
  size?: number;
  isExiting?: boolean;
}

export interface StrokeTextProps {
  text?: string;
  fontFamily?: string;
  strokeColor?: string;
  fillColor?: string;
  highlightWords?: Record<string, string>;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: "mount" | "scroll" | "hover" | "loop";
  play?: boolean;
  replayOnHover?: boolean;
  fillMode?: "wipe" | "fade" | "none";
  fontSize?: number;
  fontWeight?: number | string;
  letterSpacing?: number;
  reverse?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
  style?: CSSProperties;
}

export interface TechTextProps {
  text?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  fontSize?: number;
  letterSpacing?: number;
  color?: string;
  accentColor?: string;
  reach?: number;
  softness?: number;
  dashLength?: number;
  dashGap?: number;
  strokeWidth?: number;
  lineStyle?: "dashed" | "solid";
  reveal?: "letter" | "area" | "off";
  specks?: number;
  selection?: boolean;
  labels?: boolean;
  draggable?: boolean;
  sweep?: boolean;
  speed?: number;
  align?: "left" | "center";
  gradient?: boolean;
  animatedGradient?: boolean;
  decryptEntrance?: boolean;
  decryptSpeed?: number;
  play?: boolean;
  onDecryptComplete?: () => void;
  className?: string;
  style?: CSSProperties;
}

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

