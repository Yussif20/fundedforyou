"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import * as THREE from "three";
import Coin from "./Coin";

export default function CoinStack() {
  // Animation parameters
  const tiltSpeed = 0.8;
  const coinSpacing = 0.15;
  const floatDistance = 0.05;
  const tiltAmount = 1;

  // Refs for the three coins
  const topCoin = useRef<THREE.Group>(null);
  const midCoin = useRef<THREE.Group>(null);
  const botCoin = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!topCoin.current || !midCoin.current || !botCoin.current) return;

    // Kill any existing animations
    gsap.killTweensOf([
      topCoin.current.position,
      midCoin.current.position,
      botCoin.current.position,
      topCoin.current.rotation,
      midCoin.current.rotation,
      botCoin.current.rotation,
    ]);

    // 1. Vertical "Breathing" (Accordion Effect)
    const floatDur = 2;
    const ease = "sine.inOut";

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(topCoin.current.position, { y: `+=${floatDistance}`, duration: floatDur, ease }, 0)
      .to(midCoin.current.position, { y: `+=${floatDistance}`, duration: floatDur, ease }, 0.12)
      .to(botCoin.current.position, { y: `+=${floatDistance}`, duration: floatDur, ease }, 0.24);

    // 2. Different Tilt Animations for Each Coin
    const baseDurations = {
      top: { x: 2.1, y: 2.5, z: 3 },
      mid: { z: 1.7, x: 2.1, y: 2.9 },
      bot: { x: 2.7, z: 1.9, y: 3.3 },
    };

    // Top Coin: Enhanced X, Y, and Z tilt
    gsap.to(topCoin.current.rotation, {
      x: 0.45 * tiltAmount,
      duration: baseDurations.top.x / tiltSpeed,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(topCoin.current.rotation, {
      y: 0.35 * tiltAmount,
      duration: baseDurations.top.y / tiltSpeed,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(topCoin.current.rotation, {
      z: 0.25 * tiltAmount,
      duration: baseDurations.top.z / tiltSpeed,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Mid Coin: Pronounced Z-axis tilt with X and Y rotation
    gsap.to(midCoin.current.rotation, {
      z: 0.5 * tiltAmount,
      duration: baseDurations.mid.z / tiltSpeed,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(midCoin.current.rotation, {
      x: -0.3 * tiltAmount,
      duration: baseDurations.mid.x / tiltSpeed,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(midCoin.current.rotation, {
      y: 0.4 * tiltAmount,
      duration: baseDurations.mid.y / tiltSpeed,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Bot Coin: Strong opposite tilt pattern
    gsap.to(botCoin.current.rotation, {
      x: -0.48 * tiltAmount,
      duration: baseDurations.bot.x / tiltSpeed,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(botCoin.current.rotation, {
      z: -0.38 * tiltAmount,
      duration: baseDurations.bot.z / tiltSpeed,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    gsap.to(botCoin.current.rotation, {
      y: -0.32 * tiltAmount,
      duration: baseDurations.bot.y / tiltSpeed,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, [tiltSpeed, coinSpacing, floatDistance, tiltAmount]);

  return (
    <group position={[0, 0, 0]}>
      {/* TOP COIN */}
      <Coin ref={topCoin} position={[0, coinSpacing, 0]} rotation={[0.3, 0, 0]} />

      {/* MID COIN */}
      <Coin ref={midCoin} position={[0, 0, 0]} rotation={[0.1, 2, 0]} />

      {/* BOT COIN */}
      <Coin ref={botCoin} position={[0, -coinSpacing, 0]} rotation={[-0.2, 4, 0]} />
    </group>
  );
}
