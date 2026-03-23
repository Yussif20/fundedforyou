"use client";

import Scene from "./Scene";
import CoinModel from "./models/CoinModel";
import { usePrimaryColor } from "@/hooks/usePrimaryColor";

interface CoinSceneProps {
  className?: string;
}

export default function CoinScene({ className }: CoinSceneProps) {
  const { primary } = usePrimaryColor();

  return (
    <Scene
      className={className}
      cameraPosition={[0, 0, 2.2]}
      fov={55}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, 3, 2]} intensity={0.8} color={primary} />
      <CoinModel />
      {/* Glow ring beneath the coin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
        <torusGeometry args={[1.1, 0.03, 16, 100]} />
        <meshStandardMaterial color={primary} emissive={primary} emissiveIntensity={3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <torusGeometry args={[1.4, 0.01, 16, 100]} />
        <meshStandardMaterial color={primary} emissive={primary} emissiveIntensity={1.5} transparent opacity={0.5} />
      </mesh>
    </Scene>
  );
}
