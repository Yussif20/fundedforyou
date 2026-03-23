"use client";

import { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

type GLTFResult = GLTF & {
  nodes: {
    pCylinder7_standardSurface1_0: THREE.Mesh;
  };
};

interface CoinProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const Coin = forwardRef<THREE.Group, CoinProps>(function Coin(props, ref) {
  const { nodes } = useGLTF("/3d/coinplain.glb") as unknown as GLTFResult;

  return (
    <group ref={ref} {...props} dispose={null}>
      <group scale={0.01}>
        <mesh
          geometry={nodes.pCylinder7_standardSurface1_0.geometry}
          scale={[9.86, 1.458, 9.86]}
        >
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.8}
            roughness={0.05}
            envMapIntensity={0}
          />
        </mesh>
      </group>
    </group>
  );
});

useGLTF.preload("/3d/coinplain.glb");

export default Coin;
