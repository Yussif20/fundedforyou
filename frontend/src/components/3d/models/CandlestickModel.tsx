"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import { Group } from "three";

useGLTF.preload("/3d/candlestick.glb");
useGLTF.preload("/3d/candlestick2.glb");
useGLTF.preload("/3d/candlestick3.glb");

const glbPaths: Record<1 | 2 | 3, string> = {
  1: "/3d/candlestick.glb",
  2: "/3d/candlestick2.glb",
  3: "/3d/candlestick3.glb",
};

const floatSpeeds: Record<1 | 2 | 3, number> = {
  1: 1.2,
  2: 1.6,
  3: 0.9,
};

interface CandlestickModelProps {
  variant?: 1 | 2 | 3;
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

export default function CandlestickModel({
  variant = 1,
  position,
  scale = 1,
  rotationSpeed = 0.3,
}: CandlestickModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(glbPaths[variant]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <Float
      speed={floatSpeeds[variant]}
      rotationIntensity={0.2}
      floatIntensity={0.6}
    >
      <group ref={groupRef} position={position}>
        <primitive object={scene} scale={scale} />
      </group>
    </Float>
  );
}
