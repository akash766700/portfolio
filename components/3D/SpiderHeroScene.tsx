"use client";

import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  Float,
  Environment,
  ContactShadows,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

export type SpiderStage = "hidden" | "emerging" | "huge" | "hero";

interface SpiderProps {
  stage?: SpiderStage;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

const SPIDER_MODEL_PATH = "/models/crystal_spider.glb";

function SpiderModel({ stage = "hero", mousePos }: SpiderProps) {
  const { scene } = useGLTF(SPIDER_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const currentScale = useRef(0.01);
  const currentRotationY = useRef(0);
  const currentRotationX = useRef(0);

  const { clonedScene, baseScale } = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // Scale spider nicely to stand out as a luxury centerpiece
    const computedScale = 2.45 / maxDim;

    cloned.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Enhance crystal translucency & refraction
        if (child.material.transparent) {
          child.material.depthWrite = true;
        }
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return { clonedScene: cloned, baseScale: computedScale };
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Target scale based on dramatic animation stage
    let targetScale = baseScale;
    let lerpSpeed = 3.0;

    if (stage === "hidden") {
      targetScale = 0.001;
      lerpSpeed = 5.0;
    } else if (stage === "emerging") {
      targetScale = baseScale * 0.35;
      lerpSpeed = 4.0;
    } else if (stage === "huge") {
      // Spider zooms HUGE towards camera
      targetScale = baseScale * 2.85;
      lerpSpeed = 3.8;
    } else if (stage === "hero") {
      // Settles gracefully to hero size
      targetScale = baseScale;
      lerpSpeed = 2.6;
    }

    currentScale.current = THREE.MathUtils.lerp(
      currentScale.current,
      targetScale,
      delta * lerpSpeed
    );
    groupRef.current.scale.setScalar(currentScale.current);

    // Subtle pointer parallax tilt
    const targetRotY = mousePos.current.x * 0.45;
    const targetRotX = -mousePos.current.y * 0.35;

    currentRotationY.current = THREE.MathUtils.lerp(
      currentRotationY.current,
      targetRotY,
      delta * 2.5
    );
    currentRotationX.current = THREE.MathUtils.lerp(
      currentRotationX.current,
      targetRotX,
      delta * 2.5
    );

    groupRef.current.rotation.y = currentRotationY.current;
    groupRef.current.rotation.x = currentRotationX.current;
  });


  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

interface SpiderHeroSceneProps {
  stage?: SpiderStage;
  className?: string;
  style?: React.CSSProperties;
}

export default function SpiderHeroScene({
  stage = "hero",
  className,
  style,
}: SpiderHeroSceneProps) {
  const mousePos = useRef({ x: 0, y: 0 });


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize from -1 to 1
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        pointerEvents: "auto",
        ...style,
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 1.4, 4.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.25 }}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Ambient & Studio lighting for crystal reflections */}
          <ambientLight intensity={1.5} />
          {/* Top key light */}
          <directionalLight position={[4, 8, 4]} intensity={2.8} />
          {/* Cyan / ice blue rim light to catch crystal facets */}
          <pointLight position={[-4, 3, -3]} intensity={2.5} color="#61DAFB" />
          {/* Warm gold / champagne accent light */}
          <pointLight position={[3, -2, 2]} intensity={1.8} color="#E1DCC9" />
          <pointLight position={[0, 4, 3]} intensity={1.2} color="#FFFFFF" />

          {/* Gentle floating movement */}
          <Float
            speed={1.6}
            rotationIntensity={0.35}
            floatIntensity={0.5}
            floatingRange={[-0.08, 0.08]}
          >
            <SpiderModel stage={stage} mousePos={mousePos} />
          </Float>

          {/* Luxury crystal sparkles */}
          <Sparkles
            count={36}
            scale={4.5}
            size={1.8}
            speed={0.4}
            opacity={0.65}
            color="#61DAFB"
          />

          {/* Soft grounding shadow */}
          <ContactShadows
            position={[0, -1.05, 0]}
            opacity={0.6}
            scale={6.5}
            blur={2.4}
            far={3.8}
            color="#050508"
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 3}
            rotateSpeed={0.7}
          />
          <Environment preset="night" />
        </Canvas>
      </Suspense>
    </div>
  );
}

if (typeof window !== "undefined") {
  useGLTF.preload(SPIDER_MODEL_PATH);
}

