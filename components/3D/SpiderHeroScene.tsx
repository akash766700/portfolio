"use client";

import React, { Suspense, useRef, useMemo, useEffect, useState } from "react";
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

export type SpiderStage = "loader" | "huge" | "hero";

const topAnchorVec = new THREE.Vector3(0, 10.0, -0.26);
const bottomSpinneretVec = new THREE.Vector3(0, 0, -0.26);
const threadDirVec = new THREE.Vector3();
const threadMidVec = new THREE.Vector3();
const yAxisUnit = new THREE.Vector3(0, 1, 0);
const threadQuat = new THREE.Quaternion();

function CyberSilkThread({
  yRef,
  xSwayRef,
  landedRef,
  active,
}: {
  yRef: React.MutableRefObject<number>;
  xSwayRef: React.MutableRefObject<number>;
  landedRef: React.MutableRefObject<boolean>;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (!active || yRef.current <= 0.06 || landedRef.current) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;
    const y = yRef.current;
    const swayX = xSwayRef.current || 0;

    bottomSpinneretVec.set(swayX, y + 0.46, -0.26);

    threadDirVec.subVectors(bottomSpinneretVec, topAnchorVec);
    const height = Math.max(0.01, threadDirVec.length());
    threadMidVec
      .addVectors(topAnchorVec, bottomSpinneretVec)
      .multiplyScalar(0.5);

    threadDirVec.normalize();
    threadQuat.setFromUnitVectors(yAxisUnit, threadDirVec);

    const alpha = Math.max(0, Math.min(1.0, (y - 0.06) / 0.45));

    const shimmer =
      0.85 +
      Math.sin(state.clock.elapsedTime * 22.0) * 0.15 +
      Math.cos(state.clock.elapsedTime * 38.0) * 0.1;

    groupRef.current.position.copy(threadMidVec);
    groupRef.current.quaternion.copy(threadQuat);

    if (coreRef.current) {
      coreRef.current.scale.set(1, height, 1);
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = alpha * Math.min(1, shimmer);
    }

    if (glowRef.current) {
      glowRef.current.scale.set(1, height, 1);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = alpha * 0.8 * Math.min(1, shimmer);
    }
  });

  return (
    <group ref={groupRef} frustumCulled={false}>
      {/* Delicate Neon Cyan Glow Sheath */}
      <mesh ref={glowRef} frustumCulled={false}>
        <cylinderGeometry args={[0.0065, 0.0065, 1, 8]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Razor-Thin Laser White Core */}
      <mesh ref={coreRef} frustumCulled={false}>
        <cylinderGeometry args={[0.0028, 0.0028, 1, 8]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── Multi-Tier Landing Floor Shockwave & Energy Pulse ──
function LandingShockwave({
  triggeredRef,
}: {
  triggeredRef: React.MutableRefObject<boolean>;
}) {
  const primaryRingRef = useRef<THREE.Mesh>(null);
  const secondaryRingRef = useRef<THREE.Mesh>(null);
  const flashDiscRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const started = useRef(false);

  useFrame((_, delta) => {
    if (triggeredRef.current && !started.current) {
      started.current = true;
    }
    if (started.current && progress.current < 1.4) {
      progress.current += delta * 1.5;
      const t1 = Math.min(1, progress.current);
      const t2 = Math.max(0, Math.min(1, progress.current - 0.16));

      // Primary cyan shockwave ring
      if (primaryRingRef.current) {
        const scale1 = 0.1 + t1 * 5.4;
        primaryRingRef.current.scale.set(scale1, scale1, 1);
        const mat = primaryRingRef.current.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = (1 - t1) * 0.95;
      }

      // Secondary lime echo shockwave ring
      if (secondaryRingRef.current && t2 > 0) {
        const scale2 = 0.1 + t2 * 4.6;
        secondaryRingRef.current.scale.set(scale2, scale2, 1);
        const mat = secondaryRingRef.current
          .material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = (1 - t2) * 0.75;
      }

      // Ground impact flash disc
      if (flashDiscRef.current) {
        const discAlpha = Math.max(0, 1 - t1 * 2.2);
        const mat = flashDiscRef.current.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = discAlpha * 0.75;
      }
    } else if (started.current && progress.current >= 1.4) {
      if (primaryRingRef.current) primaryRingRef.current.visible = false;
      if (secondaryRingRef.current) secondaryRingRef.current.visible = false;
      if (flashDiscRef.current) flashDiscRef.current.visible = false;
    }
  });

  return (
    <group position={[0, -1.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Ground flash disc */}
      <mesh ref={flashDiscRef} scale={[1.8, 1.8, 1]}>
        <circleGeometry args={[0.65, 32]} />
        <meshBasicMaterial
          color="#61DAFB"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Primary cyan ring */}
      <mesh ref={primaryRingRef} scale={[0.01, 0.01, 1]}>
        <ringGeometry args={[0.22, 0.38, 64]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary electric lime ring */}
      <mesh ref={secondaryRingRef} scale={[0.01, 0.01, 1]}>
        <ringGeometry args={[0.18, 0.32, 64]} />
        <meshBasicMaterial
          color="#CEF2A8"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ── Interactive Click Shockwave Ripple from Spider ──
function SpiderClickRipple({
  clickPulseRef,
}: {
  clickPulseRef: React.MutableRefObject<number>;
}) {
  const rippleRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!rippleRef.current) return;
    if (clickPulseRef.current > 0.01) {
      rippleRef.current.visible = true;
      const p = 1.0 - clickPulseRef.current; // 0 to 1
      const scale = 0.4 + p * 3.8;
      rippleRef.current.scale.set(scale, scale, scale);
      const mat = rippleRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = clickPulseRef.current * 0.85;
    } else {
      rippleRef.current.visible = false;
    }
  });

  return (
    <mesh ref={rippleRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.3, 0.45, 48]} />
      <meshBasicMaterial
        color="#00F0FF"
        transparent
        opacity={0}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Dynamic Orbiting Prism Light (Glints across Crystal Facets) ──
function DynamicPrismLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.elapsedTime * 1.5;
    lightRef.current.position.x = Math.cos(t) * 3.6;
    lightRef.current.position.z = Math.sin(t) * 3.6;
    lightRef.current.position.y = 1.6 + Math.sin(t * 1.2) * 1.2;
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={3.2}
      color="#00F0FF"
      distance={9.5}
      decay={2}
    />
  );
}

interface SpiderProps {
  stage?: SpiderStage;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  yRef: React.MutableRefObject<number>;
  xSwayRef: React.MutableRefObject<number>;
  landedRef: React.MutableRefObject<boolean>;
  clickPulseRef: React.MutableRefObject<number>;
}

const SPIDER_MODEL_PATH = "/models/crystal_spider.glb";

const BASE_SPIDER_SCALE = 0.248;

function SpiderModel({
  stage = "hero",
  mousePos,
  yRef,
  xSwayRef,
  landedRef,
  clickPulseRef,
}: SpiderProps) {
  const { scene } = useGLTF(SPIDER_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const recedeProgress = useRef(0);
  const spinAngle = useRef(0);
  const heroScale = useRef(BASE_SPIDER_SCALE);

  const clonedScene = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (child.material.transparent) {
          child.material.depthWrite = true;
        }
      }
    });
    return c;
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Decay interactive click pulse
    if (clickPulseRef.current > 0.01) {
      clickPulseRef.current = THREE.MathUtils.damp(
        clickPulseRef.current,
        0,
        4.2,
        delta,
      );
    }

    if (stage === "loader") {
      // Primed and pre-warmed behind curtain: large, front-facing, stationary
      recedeProgress.current = 0;
      spinAngle.current = 0;
      groupRef.current.position.set(0, 0.1, 0);
      groupRef.current.rotation.set(0, 0, 0);
      groupRef.current.scale.setScalar(BASE_SPIDER_SCALE * 2.5);
      return;
    }

    if (stage === "huge") {
      // Advance normalized progress over 3.6s
      recedeProgress.current = Math.min(1, recedeProgress.current + delta / 3.6);
      const p = recedeProgress.current;

      // ── Exponential Ease-In Curve (p^2.8): Starts VERY SLOW, accelerates as spider gets smaller ──
      const ease = Math.pow(p, 2.8);

      // 1. Scale: starts huge (BASE_SPIDER_SCALE * 2.5), barely changes at first, then rapidly collapses to 0.0008
      const startScale = BASE_SPIDER_SCALE * 2.5;
      const currentScale = THREE.MathUtils.lerp(startScale, 0.0008, ease);

      // 2. Position Z: starts at 0, drifts backward very slowly, then accelerates deep into cosmic space (-7.5)
      const currentPosZ = THREE.MathUtils.lerp(0, -7.5, ease);

      // 3. Position Y (girte hue): gently drifts downward as it recedes
      const currentPosY = THREE.MathUtils.lerp(0.1, -1.05, ease);

      // 4. Spin (rotation): starts majestic and slow, accelerates as scale shrinks (cosmic suction spin)
      const spinSpeed = 0.85 + ease * 3.6;
      spinAngle.current += delta * spinSpeed;
      groupRef.current.rotation.y = spinAngle.current;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.35, ease);
      groupRef.current.rotation.z = Math.sin(p * Math.PI) * 0.12;

      groupRef.current.position.set(0, currentPosY, currentPosZ);
      groupRef.current.scale.setScalar(currentScale);
    } else if (stage === "hero") {
      recedeProgress.current = 0;
      // 3. Drop from ceiling slowly on silk thread facing FRONT (rotation.y = 0)
      heroScale.current = THREE.MathUtils.lerp(
        heroScale.current,
        BASE_SPIDER_SCALE,
        delta * 2.5
      );
      groupRef.current.position.z = 0;

      // Descend gracefully from ceiling (y: 4.8 -> 0)
      if (yRef.current > 0.02) {
        yRef.current = THREE.MathUtils.damp(yRef.current, 0, 1.12, delta);

        // Natural elastic spider sway as it hangs from the silk thread
        const swayAmp = Math.min(0.24, yRef.current * 0.06);
        const currentSway = Math.sin(state.clock.elapsedTime * 3.6) * swayAmp;
        xSwayRef.current = currentSway;
        groupRef.current.position.x = currentSway;
        groupRef.current.rotation.z = -currentSway * 0.5;
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0;

        if (yRef.current < 0.35 && !landedRef.current) {
          landedRef.current = true;
        }
      } else {
        yRef.current = 0;
        xSwayRef.current = THREE.MathUtils.lerp(xSwayRef.current, 0, delta * 8);
        groupRef.current.position.x = xSwayRef.current;
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.z = 0;
      }

      // Interactive Click spring bounce
      let clickJump = 0;
      if (clickPulseRef.current > 0.01) {
        clickJump = Math.sin(clickPulseRef.current * Math.PI) * 0.25;
      }

      // Organic subtle breathing hover oscillation
      const breathingHover =
        yRef.current <= 0.02
          ? Math.sin(state.clock.elapsedTime * 2.2) * 0.025
          : 0;
      groupRef.current.position.y = yRef.current + clickJump + breathingHover;
      groupRef.current.scale.setScalar(heroScale.current);
    }
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
  dropFromTop?: boolean;
}

export default function SpiderHeroScene({
  stage = "hero",
  className,
  style,
  dropFromTop = false,
}: SpiderHeroSceneProps) {
  const mousePos = useRef({ x: 0, y: 0 });
  const yRef = useRef(dropFromTop ? 4.8 : 0);
  const xSwayRef = useRef(0);
  const landedRef = useRef(false);
  const clickPulseRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  // Transition handler: Reset yRef when transitioning into hero drop
  const prevStageRef = useRef(stage);
  useEffect(() => {
    if (stage === "hero" && prevStageRef.current !== "hero") {
      yRef.current = dropFromTop ? 4.8 : 0;
      landedRef.current = false;
    }
    prevStageRef.current = stage;
  }, [stage, dropFromTop]);

  const handleClick = () => {
    if (stage === "hero") {
      clickPulseRef.current = 1.0;
    }
  };

  return (
    <div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        pointerEvents: "auto",
        cursor: stage === "hero" ? (isHovered ? "grab" : "default") : "none",
        ...style,
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 1.05, 4.4], fov: 48 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Ambient & Studio lighting for crystal reflections */}
          <ambientLight intensity={1.6} />
          {/* Top key light */}
          <directionalLight position={[4, 8, 4]} intensity={2.6} />
          {/* Cyan / ice blue rim light to catch crystal facets */}
          <pointLight position={[-4, 3, -3]} intensity={2.2} color="#61DAFB" />
          {/* Warm gold / champagne accent light */}
          <pointLight position={[3, -2, 2]} intensity={1.6} color="#E1DCC9" />
          <pointLight position={[0, 4, 3]} intensity={1.0} color="#FFFFFF" />

          {/* Dynamic Orbiting Prism Light for Shimmering Crystal Glints */}
          <DynamicPrismLight />

          {/* Prominent Cyber Silk Web Thread while descending */}
          <CyberSilkThread
            yRef={yRef}
            xSwayRef={xSwayRef}
            landedRef={landedRef}
            active={stage === "hero" && dropFromTop}
          />

          {/* Landing Floor Shockwave Ring */}
          {stage === "hero" && dropFromTop && (
            <LandingShockwave triggeredRef={landedRef} />
          )}

          {/* Interactive Click Shockwave Ripple */}
          <SpiderClickRipple clickPulseRef={clickPulseRef} />

          {/* Unconditional Float wrapper: NEVER unmounts SpiderModel between stages */}
          <Float
            speed={1.4}
            rotationIntensity={stage === "hero" && landedRef.current ? 0.04 : 0}
            floatIntensity={stage === "hero" && landedRef.current ? 0.18 : 0}
            floatingRange={[-0.02, 0.02]}
          >
            <SpiderModel
              stage={stage}
              mousePos={mousePos}
              yRef={yRef}
              xSwayRef={xSwayRef}
              landedRef={landedRef}
              clickPulseRef={clickPulseRef}
            />
          </Float>

          {/* Luxury crystal sparkles / warp dust */}
          <Sparkles
            count={stage === "huge" ? 48 : 24}
            scale={stage === "huge" ? 6.0 : 4.2}
            size={stage === "huge" ? 2.2 : 1.6}
            speed={stage === "huge" ? 1.0 : 0.4}
            opacity={stage === "huge" ? 0.8 : 0.6}
            color="#61DAFB"
          />

          {/* Soft grounding shadow - only needed on floor in hero stage */}
          {stage === "hero" && (
            <ContactShadows
              position={[0, -1.05, 0]}
              opacity={0.62}
              scale={6.8}
              blur={2.4}
              far={3.8}
              frames={1}
              color="#050508"
            />
          )}

          {/* Free 360° Drag Rotation (Rotates only when clicked and dragged after touchdown) */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.07}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 3.2}
            rotateSpeed={0.95}
            enabled={stage === "hero" && landedRef.current}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

export function preloadSpiderModel() {
  if (typeof window !== "undefined") {
    try {
      useGLTF.preload(SPIDER_MODEL_PATH);
    } catch {
      // ignore
    }
  }
}

// Immediate eager preload as soon as module is imported
if (typeof window !== "undefined") {
  try {
    useGLTF.preload(SPIDER_MODEL_PATH);
  } catch {
    // ignore
  }
}
