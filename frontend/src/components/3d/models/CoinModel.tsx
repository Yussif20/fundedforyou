"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import { Group } from "three";

useGLTF.preload("/3d/coinplain.glb");

export default function CoinModel() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF("/3d/coinplain.glb");

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef}>
        <primitive object={scene} scale={2.2} />
      </group>
    </Float>
  );
}
