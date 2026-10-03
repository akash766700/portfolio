"use client";

import dynamic from "next/dynamic";

export const ModelViewer = dynamic(() => import("./scenes/ModelViewer"), {
  ssr: false,
});

export const SpiderHeroScene = dynamic(() => import("./scenes/SpiderHeroScene"), {
  ssr: false,
});

export const ThreeDPaper = dynamic(() => import("./scenes/ThreeDPaper"), {
  ssr: false,
});

export const MODELS = {
  SPIDER: "/models/crystal_spider.glb",
  GROGU: "/models/mandalorian_grogu.glb",
} as const;
