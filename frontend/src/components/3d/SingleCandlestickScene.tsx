"use client";

import Scene from "./Scene";
import CandlestickModel from "./models/CandlestickModel";
import { usePrimaryColor } from "@/hooks/usePrimaryColor";

interface SingleCandlestickSceneProps {
  className?: string;
  variant?: 1 | 2 | 3;
  scale?: number;
  rotationSpeed?: number;
}

export default function SingleCandlestickScene({
  className,
  variant = 2,
  scale = 1.4,
  rotationSpeed = 0.15,
}: SingleCandlestickSceneProps) {
  const { primary } = usePrimaryColor();

  return (
    <Scene className={className} cameraPosition={[0, 0, 3.5]} fov={50}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-3, 2, 2]} intensity={0.6} color={primary} />
      <CandlestickModel
        variant={variant}
        position={[0, 0, 0]}
        scale={scale}
        rotationSpeed={rotationSpeed}
      />
    </Scene>
  );
}
