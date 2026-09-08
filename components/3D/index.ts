"use client";

import dynamic from "next/dynamic";

export const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
});

export const SpiderHeroScene = dynamic(() => import("./SpiderHeroScene"), {
  ssr: false,
});

export const ThreeDPaper = dynamic(() => import("./ThreeDPaper"), {
  ssr: false,
});

export const MODELS = {

  SPIDER: "/models/crystal_spider.glb",
  GROGU: "/models/mandalorian_grogu.glb",
} as const;

