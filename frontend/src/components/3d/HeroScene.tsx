"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import OscillatingSpotlight from "./OscillatingSpotlight";
import CoinStack from "./CoinStack";
import AnimatedCandlestick from "./AnimatedCandlestick";

interface HeroSceneProps {
  spotlightColor?: string;
  candlestickColor?: string;
  mirror?: boolean;
}

export default function HeroScene({
  spotlightColor = "#4ae79e",
  candlestickColor = "#4ae79e",
  mirror = false,
}: HeroSceneProps) {
  // Responsive scaling
  const [scale, setScale] = useState(1);
  const [cameraZ, setCameraZ] = useState(8);
  const [scenePosition, setScenePosition] = useState<[number, number, number]>([
    0, 0, 0,
  ]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // Smoothly interpolate scale and cameraZ across breakpoints
      const minWidth = 320;
      const maxWidth = 2560; // support 4K/ultrawide
      const minScale = 0.52;
      const maxScale = 1.15; // slight boost on large displays
      const minCameraZ = 13;
      const maxCameraZ = 7.5;

      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width));
      const normalizedWidth = (clampedWidth - minWidth) / (maxWidth - minWidth);
      // Use ease-out curve so small screens get more benefit per pixel
      const easedWidth = 1 - Math.pow(1 - normalizedWidth, 2);
      const smoothScale = minScale + (maxScale - minScale) * easedWidth;
      const smoothCameraZ = minCameraZ + (maxCameraZ - minCameraZ) * easedWidth;

      setScale(smoothScale);
      setCameraZ(smoothCameraZ);

      // On lg+ screens the hero uses a 1/3 text | 2/3 3D split.
      // Shifting the scene group toward the center (negative X for LTR) pulls the
      // objects away from the far edge so they fill the right two-thirds cleanly.
      // On smaller screens the 3D is a full-background layer; push it high so it
      // doesn't sit on top of the bottom-anchored text.
      if (width < 480) {
        const xDir = mirror ? 1.3 : -1.3;
        setScenePosition([xDir, 2.8, 0]);
      } else if (width < 768) {
        const xDir = mirror ? 1.0 : -1.0;
        setScenePosition([xDir, 2.2, 0]);
      } else if (width < 1024) {
        const xDir = mirror ? 0.5 : -0.5;
        setScenePosition([xDir, 2.0, 0]);
      } else if (width < 1280) {
        // Small laptops: text column starts, shift 3D toward center-right
        const xShift = mirror ? 0.8 : -0.8;
        setScenePosition([xShift, 0, 0]);
      } else {
        // Desktop / 4K: strong shift so objects fill the right 2/3
        const xShift = mirror ? 1.0 : -1.0;
        setScenePosition([xShift, 0, 0]);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mirror]); // mirror affects X offset direction

  return (
    <Canvas
      className="h-full w-full block"
      gl={{ antialias: false }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, cameraZ]} fov={35} />
      <Environment preset="night" environmentIntensity={0.3} />

      {/* Scene Content */}
      <group position={scenePosition}>
        <Suspense fallback={null}>
          <OscillatingSpotlight color={spotlightColor} mirror={mirror} />

          <pointLight
            position={mirror ? [2, 5, -2] : [-2, 5, -2]}
            intensity={50}
            color="#fff"
          />

          {/* Coin Stack */}
          <group
            scale={5 * scale}
            position={mirror ? [-2.5 * scale, 0, 0] : [2.5 * scale, 0, 0]}
          >
            <CoinStack />
          </group>

          {/* Candlesticks */}
          <group position={mirror ? [-2.5 * scale, 0, 0] : [2.5 * scale, 0, 0]}>
            <AnimatedCandlestick
              variant={1}
              position={mirror ? [-1.2, -0.5, 0] : [1.2, -0.5, 0]}
              scale={1.7 * scale}
              glassColor={candlestickColor}
            />
            <AnimatedCandlestick
              variant={2}
              position={mirror ? [1, 0, 0] : [-1, 0, 0]}
              scale={1.7 * scale}
              glassColor={candlestickColor}
            />
            <AnimatedCandlestick
              variant={3}
              position={mirror ? [-1, 1, 0] : [1, 1, 0]}
              scale={1.7 * scale}
              glassColor={candlestickColor}
            />
          </group>
        </Suspense>
      </group>

      <OrbitControls enabled={false} />
    </Canvas>
  );
}
