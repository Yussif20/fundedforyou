"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { SpotLight } from "@react-three/drei";
import * as THREE from "three";

interface OscillatingSpotlightProps {
  color: string;
  mirror?: boolean;
}

export default function OscillatingSpotlight({
  color,
  mirror = false,
}: OscillatingSpotlightProps) {
  const targetRef = useRef<THREE.Object3D>(null);
  const [target, setTarget] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (targetRef.current) {
      setTarget(targetRef.current);
    }
  }, []);

  useFrame(({ clock }) => {
    if (targetRef.current) {
      // Oscillate the Y position of the target (currently disabled with * 0)
      const oscillation = Math.sin(clock.getElapsedTime() * 0) * 0;
      targetRef.current.position.y = oscillation;
    }
  });

  // Mirror the positions if mirror is true (for RTL/Arabic)
  const targetPosition: [number, number, number] = mirror
    ? [-2, 0, 0]
    : [2, 0, 0];
  const spotlightPosition: [number, number, number] = mirror
    ? [2, 5, -2]
    : [-2, 5, -2];

  return (
    <>
      <object3D ref={targetRef} position={targetPosition} />
      {target && (
        <SpotLight
          position={spotlightPosition}
          target={target}
          color={color}
          distance={10}
          angle={0.25}
          attenuation={10}
          anglePower={3}
          opacity={0.99}
        />
      )}
    </>
  );
}
