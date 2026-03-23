"use client";

import { useState, useEffect } from "react";
import { PresentationControls } from "@react-three/drei";
import Scene from "./Scene";
import CandlestickModel from "./models/CandlestickModel";
import { usePrimaryColor } from "@/hooks/usePrimaryColor";

interface CandlestickSceneProps {
  className?: string;
}

export default function CandlestickScene({ className }: CandlestickSceneProps) {
  const { primary } = usePrimaryColor();
  const [groupScale, setGroupScale] = useState(1);
  const [fov, setFov] = useState(60);
  const [cameraZ, setCameraZ] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) {
        // Very small phones — pull camera back and shrink group so all 3 fit
        setGroupScale(0.52);
        setFov(68);
        setCameraZ(5.0);
      } else if (w < 640) {
        setGroupScale(0.65);
        setFov(65);
        setCameraZ(4.7);
      } else if (w < 768) {
        setGroupScale(0.78);
        setFov(63);
        setCameraZ(4.4);
      } else if (w < 1024) {
        setGroupScale(0.88);
        setFov(62);
        setCameraZ(4.2);
      } else if (w < 1280) {
        setGroupScale(1.0);
        setFov(60);
        setCameraZ(4.0);
      } else if (w < 1920) {
        setGroupScale(1.08);
        setFov(58);
        setCameraZ(3.8);
      } else {
        // 4K / ultrawide — slightly larger scene
        setGroupScale(1.18);
        setFov(56);
        setCameraZ(3.6);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <Scene
      className={className}
      cameraPosition={[0, 0, cameraZ]}
      fov={fov}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <pointLight position={[0, 3, 3]} intensity={0.6} color={primary} />

      <PresentationControls
        global
        snap
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <group scale={groupScale}>
          <CandlestickModel variant={1} position={[-3, 0, 0]} scale={2} rotationSpeed={0} />
          <CandlestickModel variant={2} position={[0, 0, 0]} scale={2.4} rotationSpeed={0} />
          <CandlestickModel variant={3} position={[3, 0, 0]} scale={2} rotationSpeed={0} />
        </group>
      </PresentationControls>
    </Scene>
  );
}
