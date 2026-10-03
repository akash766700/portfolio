"use client";

import React, { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
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
  const ripplePulse = useRef(0);

  useFrame((_, delta) => {
    if (!rippleRef.current) return;
    if (clickPulseRef.current > 0.5) {
      ripplePulse.current = 1.0;
    }
    if (ripplePulse.current > 0.01) {
      rippleRef.current.visible = true;
      ripplePulse.current = THREE.MathUtils.damp(
        ripplePulse.current,
        0,
        2.8,
        delta
      );
      const p = 1.0 - ripplePulse.current; // 0 to 1
      const scale = 0.4 + p * 4.2;
      rippleRef.current.scale.set(scale, scale, 1);
      const mat = rippleRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = ripplePulse.current * 0.9;
    } else {
      rippleRef.current.visible = false;
    }
  });

  return (
    <mesh ref={rippleRef} position={[0, -1.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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

// ── Interactive 360 Spin Energy Shockwave (Dual Cyan + Solar Amber) ──
function SpiderSpinShockwave({
  spinPulseRef,
}: {
  spinPulseRef: React.MutableRefObject<number>;
}) {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (spinPulseRef.current > 0.01) {
      spinPulseRef.current = THREE.MathUtils.damp(
        spinPulseRef.current,
        0,
        2.4,
        delta
      );
      const p = 1.0 - spinPulseRef.current;

      if (outerRingRef.current) {
        outerRingRef.current.visible = true;
        const scale1 = 0.4 + p * 4.6;
        outerRingRef.current.scale.set(scale1, scale1, 1);
        const mat = outerRingRef.current.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = spinPulseRef.current * 0.92;
      }

      if (innerRingRef.current) {
        innerRingRef.current.visible = true;
        const scale2 = 0.2 + p * 3.6;
        innerRingRef.current.scale.set(scale2, scale2, 1);
        const mat = innerRingRef.current.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = spinPulseRef.current * 0.78;
      }
    } else {
      if (outerRingRef.current) outerRingRef.current.visible = false;
      if (innerRingRef.current) innerRingRef.current.visible = false;
    }
  });

  return (
    <group position={[0, -1.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Outer Glacial Cyan Ring */}
      <mesh ref={outerRingRef} scale={[0.1, 0.1, 1]}>
        <ringGeometry args={[0.36, 0.48, 48]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Inner Solar Amber Core Ring */}
      <mesh ref={innerRingRef} scale={[0.1, 0.1, 1]}>
        <ringGeometry args={[0.2, 0.28, 48]} />
        <meshBasicMaterial
          color="#FF9100"
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

// ── Smooth Orbiting Studio Accent Lights for Natural Specular Highlights ──
function DynamicPrismLight() {
  const primaryLightRef = useRef<THREE.PointLight>(null);
  const secondaryLightRef = useRef<THREE.PointLight>(null);
  const legRakeLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const t = time * 0.9;

    if (primaryLightRef.current) {
      primaryLightRef.current.position.x = Math.cos(t) * 3.8;
      primaryLightRef.current.position.z = Math.sin(t) * 3.8;
      primaryLightRef.current.position.y = 1.6 + Math.sin(t * 1.2) * 1.0;
    }

    if (secondaryLightRef.current) {
      secondaryLightRef.current.position.x = -Math.cos(t * 0.85) * 3.4;
      secondaryLightRef.current.position.z = -Math.sin(t * 0.85) * 3.4;
      secondaryLightRef.current.position.y = 2.0 + Math.cos(t * 1.1) * 0.8;
    }

    if (legRakeLightRef.current) {
      // Dynamic low-raking light positioned to sweep specifically across the legs and back crystals
      const tLeg = time * 1.35;
      legRakeLightRef.current.position.x = Math.sin(tLeg) * 3.5;
      legRakeLightRef.current.position.z = -0.8 + Math.cos(tLeg) * 2.5;
      legRakeLightRef.current.position.y = 0.45 + Math.sin(time * 1.8) * 0.3;
    }
  });

  return (
    <group>
      {/* Primary Ice Cyan studio light to gleam across Glacial Ice crystal crown */}
      <pointLight
        ref={primaryLightRef}
        intensity={2.8}
        color="#00E5FF"
        distance={12.0}
        decay={2}
      />
      {/* Secondary Solar Amber fill to warm up the Molten Core and brass legs */}
      <pointLight
        ref={secondaryLightRef}
        intensity={2.2}
        color="#FFA726"
        distance={10.0}
        decay={2}
      />
      {/* Dynamic Leg & Back Specular Raking Light */}
      <pointLight
        ref={legRakeLightRef}
        intensity={2.6}
        color="#FFFFFF"
        distance={9.0}
        decay={2}
      />
    </group>
  );
}

interface SpiderProps {
  stage?: SpiderStage;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
  yRef: React.MutableRefObject<number>;
  xSwayRef: React.MutableRefObject<number>;
  landedRef: React.MutableRefObject<boolean>;
  clickPulseRef: React.MutableRefObject<number>;
  spinTrickRef: React.MutableRefObject<number>;
  spinPulseRef: React.MutableRefObject<number>;
  idleTimerRef: React.MutableRefObject<number>;
  isDraggingRef: React.MutableRefObject<boolean>;
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
  spinTrickRef,
  spinPulseRef,
  idleTimerRef,
  isDraggingRef,
}: SpiderProps) {
  const { scene } = useGLTF(SPIDER_MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const recedeProgress = useRef(0);
  const spinAngle = useRef(0);
  const heroScale = useRef(BASE_SPIDER_SCALE);
  const legShineUniform = useRef({ value: 0 });
  const dropProgressRef = useRef(0);
  const prevModelStageRef = useRef(stage);
  const smoothTimeRef = useRef(0);

  const clonedScene = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (child.material.transparent) {
          child.material.depthWrite = true;
        }
        // Ultra-crisp 4x anisotropic filtering for crystal/metallic facets (zero bandwidth stalls)
        ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap"].forEach(
          (key) => {
            if (child.material[key]) {
              child.material[key].anisotropy = 4;
              child.material[key].minFilter = THREE.LinearMipmapLinearFilter;
              child.material[key].generateMipmaps = true;
              child.material[key].needsUpdate = true;
            }
          }
        );
        if (
          child.material.isMeshStandardMaterial ||
          child.material.isMeshPhysicalMaterial
        ) {
          child.material.envMapIntensity = 2.4;
          child.material.roughness = Math.min(child.material.roughness, 0.20);
          child.material.metalness = Math.max(child.material.metalness, 0.68);

          // Spatial Multi-Tone Luxury Shader:
          // 1. Front: Vivid Deep Dark Red Eyes
          // 2. Middle: Molten Orange Plasma Core
          // 3. Back: 2-Tone Duo (Deep Cobalt Sapphire Blue Base + Glacial Ice Diamond Crown)
          // 4. Legs: Dynamic Traveling Chromatic Shine (Silver, Dark Red & Gold glints)
          child.material.onBeforeCompile = (shader: any) => {
            shader.uniforms.uLegShineTime = legShineUniform.current;

            // Vertex shader: pass model position to fragment
            shader.vertexShader = shader.vertexShader.replace(
              "#include <common>",
              `
              #include <common>
              varying vec3 vSpiderModelPos;
              `
            );
            shader.vertexShader = shader.vertexShader.replace(
              "#include <begin_vertex>",
              `
              #include <begin_vertex>
              vSpiderModelPos = position;
              `
            );

            // Fragment shader: receive model position & time uniform
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <common>",
              `
              #include <common>
              varying vec3 vSpiderModelPos;
              uniform float uLegShineTime;
              `
            );

            // Diffuse facet transform
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <map_fragment>",
              `
              #include <map_fragment>
              // 1. Crystal Facet Tinting
              if (diffuseColor.g > diffuseColor.r * 1.05 && diffuseColor.g > diffuseColor.b * 0.82) {
                float luma = max(diffuseColor.g, max(diffuseColor.r, diffuseColor.b));
                
                // FRONT EYES: Pure Sleek Dark Red (Deep Garnet / Dark Glossy Wine)
                if (vSpiderModelPos.z > 0.72) {
                  vec3 deepDarkRed = vec3(0.38, 0.018, 0.035);
                  diffuseColor.rgb = mix(diffuseColor.rgb, deepDarkRed * (luma * 1.1 + 0.04), 0.99);
                }
                // MIDDLE CORE: Molten Orange Plasma (Thorax / Orb)
                else if (vSpiderModelPos.z >= -0.38) {
                  vec3 moltenCore = vec3(1.0, 0.45, 0.05);
                  diffuseColor.rgb = mix(diffuseColor.rgb, moltenCore * (luma * 1.85 + 0.12), 0.94);
                }
                // BACK ABDOMEN & CRYSTALS: Deep Dark Sapphire Obsidian (Muted, Non-white, No shine)
                else {
                  vec3 deepSapphire = vec3(0.04, 0.16, 0.40);
                  diffuseColor.rgb = mix(diffuseColor.rgb, deepSapphire * (luma * 1.15 + 0.04), 0.95);
                }
              }

              // 2. DYNAMIC SHINE: EXCLUSIVELY AND ONLY ON LEGS & CLAWS!
              // (Zero shine on the head, eyes, middle core, and back dome/abdomen!)
              bool isCentralBody = (abs(vSpiderModelPos.x) < 0.55);
              bool isLeg = !isCentralBody && (abs(vSpiderModelPos.x) > 0.58 || (abs(vSpiderModelPos.x) > 0.38 && vSpiderModelPos.z > 0.90));

              if (isLeg) {
                float legSpan = length(vSpiderModelPos.xz);
                float sweepPhase = legSpan * 2.8 - uLegShineTime * 1.85;
                float glintIntensity = pow(max(0.0, sin(sweepPhase)), 8.0);

                // Chromatic tones: Diamond Platinum Silver, Deep Dark Ruby Red, & Polished Gold
                vec3 silverShine = vec3(0.96, 0.98, 1.0) * 1.8;
                vec3 darkRedShine = vec3(0.78, 0.05, 0.10) * 1.5;
                vec3 goldShine = vec3(1.0, 0.85, 0.42) * 1.35;

                // Color morphs smoothly over time
                float colorCycle = sin(uLegShineTime * 0.85 + legSpan * 1.2) * 0.5 + 0.5;
                vec3 waveColor = mix(silverShine, darkRedShine, colorCycle);
                waveColor = mix(waveColor, goldShine, sin(uLegShineTime * 0.5) * 0.3 + 0.3);

                // Apply dynamic specular sheen ONLY onto legs
                diffuseColor.rgb += waveColor * glintIntensity * 0.55;
              }
              `
            );

            // Emissive radiance transform
            shader.fragmentShader = shader.fragmentShader.replace(
              "#include <emissivemap_fragment>",
              `
              #include <emissivemap_fragment>
              if (totalEmissiveRadiance.g > totalEmissiveRadiance.r * 1.02) {
                float elum = max(totalEmissiveRadiance.g, max(totalEmissiveRadiance.r, totalEmissiveRadiance.b));
                
                // 1. FRONT: Subtle Deep Dark Red Underglow
                if (vSpiderModelPos.z > 0.72) {
                  vec3 darkGarnet = vec3(0.42, 0.015, 0.030);
                  totalEmissiveRadiance = darkGarnet * elum * 1.4;
                }
                // 2. MIDDLE: Radiant Solar Plasma Orange Core
                else if (vSpiderModelPos.z >= -0.38) {
                  vec3 plasmaOrange = vec3(1.0, 0.38, 0.0);
                  totalEmissiveRadiance = plasmaOrange * elum * 3.8;
                }
                // 3. BACK: Deep Muted Sapphire Underglow (NO white/starlight flash)
                else {
                  vec3 sapphireGlow = vec3(0.05, 0.18, 0.45);
                  totalEmissiveRadiance = sapphireGlow * elum * 1.5;
                }
              }
              `
            );
          };

          child.material.needsUpdate = true;
        }
      }
    });
    return c;
  }, [scene]);

  const isSpinningRef = useRef(false);
  const spinProgressRef = useRef(0);
  const startSpinAngleRef = useRef(0);

  const isJumpingRef = useRef(false);
  const jumpProgressRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    legShineUniform.current.value = state.clock.elapsedTime;

    // ── Check for Jump Trigger (Single-Click) ──
    if (
      clickPulseRef.current > 0.1 &&
      !isJumpingRef.current &&
      !isSpinningRef.current &&
      stage === "hero"
    ) {
      isJumpingRef.current = true;
      jumpProgressRef.current = 0;
    }

    // ── Check for Spin Trick Trigger (Double-Click or 15s Idle Timer) ──
    if (
      spinTrickRef.current > 0.1 &&
      !isSpinningRef.current &&
      stage === "hero"
    ) {
      isSpinningRef.current = true;
      spinProgressRef.current = 0;
      isJumpingRef.current = false;
      startSpinAngleRef.current = groupRef.current.rotation.y;
      spinTrickRef.current = 0;
    }

    // ── 15-Second Idle Auto-Rotate Trigger ──
    if (
      stage === "hero" &&
      !isSpinningRef.current &&
      !isJumpingRef.current
    ) {
      idleTimerRef.current += delta;
      if (idleTimerRef.current >= 15.0) {
        idleTimerRef.current = 0;
        spinTrickRef.current = 1.0;
        spinPulseRef.current = 1.0;
      }
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
      // Advance normalized progress over full 7.0s (spider end tak ghumta hua dikhega)
      recedeProgress.current = Math.min(
        1,
        recedeProgress.current + delta / 7.0,
      );
      const p = recedeProgress.current;

      // ── Smooth Ease-In Curve (p^2.2): Stays prominent & spins majestically for first 4.5s, then accelerates into cosmic depth ──
      const ease = Math.pow(p, 2.2);

      // 1. Scale: starts huge (BASE_SPIDER_SCALE * 2.5), spins prominently, then smoothly recedes to 0.0008
      const startScale = BASE_SPIDER_SCALE * 2.5;
      const currentScale = THREE.MathUtils.lerp(startScale, 0.0008, ease);

      // 2. Position Z: starts at 0, drifts backward into cosmic depth (-8.0)
      const currentPosZ = THREE.MathUtils.lerp(0, -8.0, ease);

      // 3. Position Y: gently drifts downward as it recedes into cosmos
      const currentPosY = THREE.MathUtils.lerp(0.1, -1.15, ease);

      // 4. Spin (rotation): continuous majestic 360 rotation that accelerates smoothly across the 7 seconds
      const spinSpeed = 1.35 + ease * 3.2;
      spinAngle.current += delta * spinSpeed;
      groupRef.current.rotation.y = spinAngle.current;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(0, 0.35, ease);
      groupRef.current.rotation.z = Math.sin(p * Math.PI) * 0.14;

      groupRef.current.position.set(0, currentPosY, currentPosZ);
      groupRef.current.scale.setScalar(currentScale);
    } else if (stage === "hero") {
      recedeProgress.current = 0;
      heroScale.current = BASE_SPIDER_SCALE;
      groupRef.current.position.z = 0;
      groupRef.current.scale.setScalar(BASE_SPIDER_SCALE);

      if (prevModelStageRef.current !== "hero") {
        dropProgressRef.current = 0;
      }
      prevModelStageRef.current = stage;

      // ── Delta-smoothed continuous organic levitation (eliminates abrupt dead stops at peaks and troughs) ──
      smoothTimeRef.current += Math.min(delta, 0.024);
      const tHover = smoothTimeRef.current * 0.85;
      const breathingHover = landedRef.current
        ? Math.sin(tHover) * 0.025 + Math.sin(tHover * 0.5) * 0.007
        : 0;

      // Descend gracefully from ceiling (y: 4.8 -> 0) with smooth cubic ease-out
      if (yRef.current > 0.001 && dropProgressRef.current < 1.0) {
        dropProgressRef.current = Math.min(1.0, dropProgressRef.current + delta / 1.4);
        const p = dropProgressRef.current;
        // Cubic Ease-out for swift descent and buttery-soft touch-down
        const ease = 1 - Math.pow(1 - p, 3);
        yRef.current = 4.8 * (1 - ease);

        // Natural elastic spider sway as it hangs from the silk thread
        const swayAmp = Math.min(0.24, yRef.current * 0.06);
        const currentSway = Math.sin(state.clock.elapsedTime * 3.6) * swayAmp;
        xSwayRef.current = currentSway;
        groupRef.current.position.x = currentSway;
        groupRef.current.rotation.z = -currentSway * 0.5;
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0;

        if (p >= 0.92 && !landedRef.current) {
          landedRef.current = true;
        }
      } else {
        yRef.current = 0;
        landedRef.current = true;
        groupRef.current.position.x = THREE.MathUtils.damp(
          groupRef.current.position.x,
          0,
          6.0,
          delta
        );

        // ── 360° Acrobatic Spin Trick Motion ──
        if (isSpinningRef.current) {
          spinProgressRef.current += delta / 0.85; // Full trick in ~0.85s
          const p = Math.min(1.0, spinProgressRef.current);

          // Quintic ease in-out for silky, acrobatic acceleration & deceleration
          const ease =
            p < 0.5
              ? 4 * p * p * p
              : 1 - Math.pow(-2 * p + 2, 3) / 2;

          const currentSpin = ease * Math.PI * 2; // full 360-degree rotation
          groupRef.current.rotation.y = startSpinAngleRef.current + currentSpin;
          groupRef.current.rotation.z = Math.sin(p * Math.PI * 2) * 0.20;
          groupRef.current.rotation.x = -Math.sin(p * Math.PI) * 0.22;

          if (spinProgressRef.current >= 1.0) {
            isSpinningRef.current = false;
            groupRef.current.rotation.y = startSpinAngleRef.current;
            groupRef.current.rotation.z = 0;
            groupRef.current.rotation.x = 0;
          }
        } else if (isJumpingRef.current) {
          const p = Math.min(1.0, jumpProgressRef.current);
          const sinP = Math.sin(p * Math.PI);
          groupRef.current.rotation.x = -sinP * 0.22; // predatory pounce tilt
          groupRef.current.rotation.z = 0;
        } else {
          // Perfectly steady, calm resting stance (zero rotational jerk/wobble)
          groupRef.current.rotation.y = THREE.MathUtils.damp(
            groupRef.current.rotation.y,
            0,
            6.0,
            delta
          );
          groupRef.current.rotation.x = THREE.MathUtils.damp(
            groupRef.current.rotation.x,
            0,
            6.0,
            delta
          );
          groupRef.current.rotation.z = THREE.MathUtils.damp(
            groupRef.current.rotation.z,
            0,
            6.0,
            delta
          );
        }
      }

      // ── Interactive Single Click Jump Spring Bounce (0.52s parabolic physics arc) ──
      let clickJump = 0;
      if (isJumpingRef.current) {
        jumpProgressRef.current += delta / 0.52;
        const p = Math.min(1.0, jumpProgressRef.current);
        clickJump = Math.sin(p * Math.PI) * 0.65; // High, crisp, visible leap!
        if (jumpProgressRef.current >= 1.0) {
          isJumpingRef.current = false;
          clickPulseRef.current = 0;
        }
      }

      // ── Acrobatic Spin Aerial Lift ──
      let spinHop = 0;
      if (isSpinningRef.current) {
        const p = Math.min(1.0, spinProgressRef.current);
        spinHop = Math.sin(p * Math.PI) * 0.45;
      }

      groupRef.current.position.y =
        yRef.current + clickJump + spinHop + breathingHover;

      const jumpSquash = isJumpingRef.current
        ? 1.0 + Math.sin(jumpProgressRef.current * Math.PI) * 0.08
        : 1.0;
      groupRef.current.scale.setScalar(heroScale.current * jumpSquash);
    }
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        if (stage === "hero") {
          clickPulseRef.current = 1.0;
          idleTimerRef.current = 0;
        }
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (stage === "hero") {
          spinTrickRef.current = 1.0;
          spinPulseRef.current = 1.0;
          idleTimerRef.current = 0;
        }
      }}
    >
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
  const yRef = useRef(4.8);
  const xSwayRef = useRef(0);
  const landedRef = useRef(false);
  const clickPulseRef = useRef(0);
  const spinTrickRef = useRef(0);
  const spinPulseRef = useRef(0);
  const idleTimerRef = useRef(0);
  const isDraggingRef = useRef(false);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  const resetIdle = () => {
    idleTimerRef.current = 0;
  };

  // Dynamic user activity tracking to reset 15-second idle timer
  useEffect(() => {
    const handleActivity = () => {
      idleTimerRef.current = 0;
    };

    window.addEventListener("scroll", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, []);

  // Cleanup click debounce timer on unmount
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  // Transition handler: Reset yRef when transitioning into hero drop
  const prevStageRef = useRef(stage);
  useEffect(() => {
    if (stage === "hero" && prevStageRef.current !== "hero") {
      yRef.current = dropFromTop ? 4.8 : 0;
      landedRef.current = false;
    }
    prevStageRef.current = stage;
  }, [stage, dropFromTop]);

  const triggerJump = () => {
    if (stage === "hero") {
      clickPulseRef.current = 1.0;
    }
  };

  const triggerSpin = () => {
    if (stage === "hero") {
      spinTrickRef.current = 1.0;
      spinPulseRef.current = 1.0;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    hasMovedRef.current = false;
    resetIdle();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons > 0) {
      const dx = Math.abs(e.clientX - pointerDownPos.current.x);
      const dy = Math.abs(e.clientY - pointerDownPos.current.y);
      if (dx > 5 || dy > 5) {
        hasMovedRef.current = true;
      }
    }
  };

  const handlePointerUp = () => {
    resetIdle();
  };

  const handleClick = () => {
    if (stage !== "hero") return;
    resetIdle();

    // If user dragged to orbit the spider, do not trigger click action
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }

    const now = Date.now();
    const timeSinceLast = now - lastClickTimeRef.current;

    if (timeSinceLast > 0 && timeSinceLast < 320) {
      // ── DOUBLE CLICK: Acrobatic 360° Spin Trick ──
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      lastClickTimeRef.current = 0;
      triggerSpin();
    } else {
      // ── SINGLE CLICK: Spring Jump ──
      lastClickTimeRef.current = now;
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      clickTimerRef.current = setTimeout(() => {
        triggerJump();
        clickTimerRef.current = null;
      }, 210);
    }
  };

  const handleDoubleClick = () => {
    if (stage !== "hero" || hasMovedRef.current) return;
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    lastClickTimeRef.current = 0;
    triggerSpin();
  };

  return (
    <div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
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
          dpr={[1, 1.25]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            precision: "mediump",
            stencil: false,
            depth: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.45,
          }}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Photorealistic IBL Environment reflections for crystal/metallic facets */}
          <Environment preset="city" environmentIntensity={1.4} />

          {/* Main Key Studio Light */}
          <directionalLight position={[4, 8, 4]} intensity={2.8} />
          {/* Cyan Rim & Facet Glint Light */}
          <directionalLight position={[-4, 4, -3]} intensity={2.0} color="#00E5FF" />
          {/* Amber Under-Chassis Warm Bounce */}
          <directionalLight position={[0, -3, 2]} intensity={1.4} color="#FFA726" />
          {/* Soft Omni Ambient Fill */}
          <ambientLight intensity={1.5} />

          {/* Crisp Specular Facet Highlight Light */}
          <directionalLight position={[0, 6, 2]} intensity={1.8} color="#FFFFFF" />

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

          {/* Interactive 360 Spin Shockwave Rings */}
          <SpiderSpinShockwave spinPulseRef={spinPulseRef} />

          {/* Spider Model */}
          <SpiderModel
            stage={stage}
            mousePos={mousePos}
            yRef={yRef}
            xSwayRef={xSwayRef}
            landedRef={landedRef}
            clickPulseRef={clickPulseRef}
            spinTrickRef={spinTrickRef}
            spinPulseRef={spinPulseRef}
            idleTimerRef={idleTimerRef}
            isDraggingRef={isDraggingRef}
          />

          {/* Glacial Diamond Ice & Stardust Sparkles */}
          <Sparkles
            count={stage === "huge" ? 48 : 28}
            scale={stage === "huge" ? 6.0 : 4.2}
            size={stage === "huge" ? 2.2 : 1.6}
            speed={stage === "huge" ? 1.0 : 0.4}
            opacity={stage === "huge" ? 0.9 : 0.75}
            color="#E0F7FA"
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
            enabled={stage === "hero"}
            onChange={() => {
              idleTimerRef.current = 0;
            }}
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
