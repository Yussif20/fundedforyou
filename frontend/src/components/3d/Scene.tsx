"use client";

import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";

interface SceneProps {
  children: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
}

export default function Scene({
  children,
  className,
  cameraPosition = [0, 0, 5],
  fov = 45,
}: SceneProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
    >
      <PerspectiveCamera makeDefault position={cameraPosition} fov={fov} />
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
