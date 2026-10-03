"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Center,
  Float,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { Box, CircularProgress } from "@mui/material";

import * as THREE from "three";

interface ModelProps {
  modelPath?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  enableFloat?: boolean;
}

const DEFAULT_MODEL = "/models/mandalorian_grogu.glb";

function Model({
  modelPath = DEFAULT_MODEL,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  enableFloat = true,
}: ModelProps) {
  const path = modelPath || DEFAULT_MODEL;
  const { scene } = useGLTF(path);

  const { cloned, finalScale } = React.useMemo(() => {
    const clonedScene = scene.clone(true);

    // Auto compute bounding box to normalize scale so any model fits with comfortable padding
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const normalizedScale = (1.55 / maxDim) * scale;

    clonedScene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        if (child.material.transparent) {
          child.material.depthWrite = true;
        }
      }
    });

    return { cloned: clonedScene, finalScale: normalizedScale };
  }, [scene, scale]);

  const content = (
    <Center>
      <primitive
        object={cloned}
        scale={finalScale}
        position={position}
        rotation={rotation}
      />
    </Center>
  );

  if (enableFloat) {
    return (
      <Float
        speed={2}
        rotationIntensity={0.6}
        floatIntensity={0.8}
        floatingRange={[-0.1, 0.1]}
      >
        {content}
      </Float>
    );
  }

  return content;
}

interface ModelViewerProps {
  modelPath?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  enableFloat?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  height?: string | number;
  width?: string | number;
  cameraPosition?: [number, number, number];
}

export default function ModelViewer({
  modelPath = DEFAULT_MODEL,
  scale = 1.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  enableFloat = true,
  autoRotate = true,
  autoRotateSpeed = 1.2,
  height = "100%",
  width = "100%",
  cameraPosition = [0, 1.5, 4],
}: ModelViewerProps) {
  return (
    <Box
      sx={{
        width,
        height,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <CircularProgress size={36} sx={{ color: "primary.main" }} />
          </Box>
        }
      >
        <Canvas
          camera={{ position: cameraPosition, fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <ambientLight intensity={1.6} />
          <directionalLight position={[5, 10, 5]} intensity={2.2} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={1.2} />
          <pointLight position={[0, 4, 3]} intensity={1.0} />
          <pointLight position={[0, -2, 2]} intensity={0.5} />

          <Model
            modelPath={modelPath}
            scale={scale}
            position={position}
            rotation={rotation}
            enableFloat={enableFloat}
          />

          <ContactShadows
            position={[0, -0.95, 0]}
            opacity={0.7}
            scale={7}
            blur={2.2}
            far={3.5}
            color="#0f172a"
          />

          <OrbitControls
            enableZoom={false}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 3}
          />
          <Environment preset="city" />
        </Canvas>
      </Suspense>
    </Box>
  );
}
