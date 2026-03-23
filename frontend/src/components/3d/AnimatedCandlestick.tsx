"use client";

import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";

type GLTFResult = GLTF & {
  nodes: {
    Cylinder: THREE.Mesh;
    Cube: THREE.Mesh;
  };
  materials: {
    Metal: THREE.MeshStandardMaterial;
    Glass: THREE.MeshStandardMaterial;
  };
};

interface AnimatedCandlestickProps {
  variant?: 1 | 2 | 3;
  position?: [number, number, number];
  scale?: number;
  glassColor?: string;
}

const glbPaths: Record<1 | 2 | 3, string> = {
  1: "/3d/candlestick.glb",
  2: "/3d/candlestick2.glb",
  3: "/3d/candlestick3.glb",
};

const durations: Record<1 | 2 | 3, number> = {
  1: 2.0,
  2: 2.3,
  3: 2.6,
};

const scales: Record<1 | 2 | 3, { cylinder: [number, number, number]; cube: [number, number, number] }> = {
  1: {
    cylinder: [0.393, 0.393, 0.393],
    cube: [0.045, 0.285, 0.045],
  },
  2: {
    cylinder: [0.393, 0.324, 0.393],
    cube: [0.045, 0.23, 0.045],
  },
  3: {
    cylinder: [0.393, 0.272, 0.393],
    cube: [0.045, 0.112, 0.045],
  },
};

export default function AnimatedCandlestick({
  variant = 1,
  position,
  scale = 1,
  glassColor = "#4ae79e",
}: AnimatedCandlestickProps) {
  const { nodes } = useGLTF(glbPaths[variant]) as unknown as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      // Rotate back and forth on Y-axis: -80 degrees to +80 degrees
      gsap.to(groupRef.current.rotation, {
        y: (Math.PI * 80) / 180,
        duration: durations[variant],
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }, [variant]);

  const scaleConfig = scales[variant];

  return (
    <group ref={groupRef} position={position} scale={scale} dispose={null}>
      {/* Inner Stick (Metal) */}
      <mesh geometry={nodes.Cylinder.geometry} scale={scaleConfig.cylinder}>
        <meshStandardMaterial
          color="#a0a0a0"
          metalness={1}
          roughness={0.2}
          emissive="#4f46e5"
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>

      {/* Outer Block (Glass) */}
      <mesh
        geometry={nodes.Cube.geometry}
        rotation={[-Math.PI, 0, -Math.PI]}
        scale={scaleConfig.cube}
      >
        <meshPhysicalMaterial
          color={glassColor}
          metalness={0.8}
          roughness={0.05}
          transmission={1}
          thickness={0.5}
          ior={1.5}
        />
      </mesh>
    </group>
  );
}

// Preload all variants
useGLTF.preload("/3d/candlestick.glb");
useGLTF.preload("/3d/candlestick2.glb");
useGLTF.preload("/3d/candlestick3.glb");
