# 3D Hero Section — Implementation & Revert Guide

This document describes the 3D hero feature (animated coins + candlesticks) and how to restore the hero to its previous non-3D state.

---

## 1. Overview

The hero section uses a **full-screen 3D scene** built with **React Three Fiber** and **Three.js**:

- **Animated coin stack** — three metallic coins with breathing and tilting (GSAP)
- **Three candlestick models** — glass-style candlesticks with rotation (GSAP)
- **Volumetric spotlight** — colored by route (Forex = green, Futures = gold)
- **RTL support** — scene mirrors horizontally for Arabic locale
- **Responsive scaling** — layout and camera scale for mobile vs desktop

**Post-processing (bloom)** was removed due to compatibility issues with Next.js 16 + Turbopack (`@react-three/postprocessing`).

---

## 2. File Structure

### Files used only for the 3D hero

| File | Purpose |
|------|--------|
| `src/components/Global/hero.tsx` | Client Hero component; imports HeroScene and passes colors/locale |
| `src/components/3d/HeroScene.tsx` | Main 3D canvas: camera, lights, responsive state |
| `src/components/3d/OscillatingSpotlight.tsx` | Volumetric spotlight (color + RTL mirror) |
| `src/components/3d/CoinStack.tsx` | Three coins with GSAP breathing/tilt |
| `src/components/3d/Coin.tsx` | Single coin (GLB model) |
| `src/components/3d/AnimatedCandlestick.tsx` | Candlestick with GSAP rotation (variants 1–3) |

### Other 3D files (optional; not required for hero)

| File | Purpose |
|------|--------|
| `src/components/3d/Scene.tsx` | Generic Canvas wrapper |
| `src/components/3d/CoinScene.tsx` | Single-coin scene (e.g. used by HeroCoinClient) |
| `src/components/3d/CandlestickScene.tsx` | Candlestick demo scene |
| `src/components/3d/SingleCandlestickScene.tsx` | Single candlestick scene |
| `src/components/3d/models/CoinModel.tsx` | Coin model (Float + rotation) |
| `src/components/3d/models/CandlestickModel.tsx` | Candlestick model (Float) |
| `src/components/Global/HeroCoinClient.tsx` | Dynamic wrapper for CoinScene (not used by current hero) |

### 3D assets (public)

| Path | Description |
|------|-------------|
| `public/3d/coinplain.glb` | Coin mesh |
| `public/3d/candlestick.glb` | Candlestick variant 1 |
| `public/3d/candlestick2.glb` | Candlestick variant 2 |
| `public/3d/candlestick3.glb` | Candlestick variant 3 |

---

## 3. Dependencies (added for 3D hero)

These were added for the 3D hero; other 3D packages may already have been present:

| Package | Version | Purpose |
|---------|---------|--------|
| `@react-three/fiber` | ^9.5.0 | React renderer for Three.js |
| `@react-three/drei` | ^10.7.7 | Helpers (Environment, SpotLight, OrbitControls, etc.) |
| `three` | ^0.182.0 | 3D engine |
| `@types/three` | ^0.182.0 | TypeScript types |
| `gsap` | ^3.14.2 | Animations (coins, candlesticks) |
| `@gsap/react` | ^2.1.2 | React integration for GSAP |
| `@react-three/postprocessing` | ^3.0.4 | Post-processing (currently unused due to Next.js/Turbopack issues) |

Removing the 3D hero does **not** require removing these if you still use other 3D or GSAP features elsewhere.

---

## 4. How It Works

- **Colors**: `hero.tsx` uses `usePathname()`; `/futures` → gold (`#ffd23f`), otherwise → green (`#4ae79e`). Passed as `spotlightColor` and `candlestickColor` to `HeroScene`.
- **RTL**: `useLocale()` from `next-intl`; `locale === "ar"` sets `mirror={true}` so the scene flips.
- **Sizing**: `HeroScene` uses `useEffect` + `window.innerWidth` to set scale, camera Z, and mobile offset.

---

## 5. Reverting to the Hero Before 3D

To restore the hero to the **previous state** (no 3D, server-rendered layout with title, subtitle, CTA, and logo):

### Step 1: Replace `src/components/Global/hero.tsx`

Overwrite the file with:

```tsx
import { getTranslations } from "next-intl/server";
import Container from "./Container";
import Logo from "@/utils/Logo";
import { ChevronDown } from "lucide-react";

export default async function Hero() {
  const t = await getTranslations("HomePage");
  return (
    <div id="top" className="bg-primary rounded-b-[50px]">
      <div className="py-16 md:py-24 lg:py-28 bg-background">
        <Container className="flex flex-col-reverse lg:flex-row justify-between items-center w-full gap-8 lg:gap-10">
          {/* Left: text + CTA */}
          <div className="flex flex-col items-center lg:items-start gap-4 lg:gap-6 min-w-0 flex-1 lg:flex-initial">
            <h1 className="font-bold text-4xl lg:text-5xl xl:text-6xl max-w-[900px] lg:leading-tight text-center lg:text-start uppercase">
              {t("heroTitle.title1")}
              <span className="text-primary"> {t("heroTitle.title2")}</span>
            </h1>
            <p className="text-foreground/60 text-sm md:text-base max-w-md text-center lg:text-start">
              {t("heroTitle.subtitle")}
            </p>
            <a
              href="#tabs-section"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-3 sm:px-6 rounded-full transition-colors text-sm md:text-base shrink-0 min-h-11 min-w-[140px] sm:min-w-0 text-center"
            >
              <span className="whitespace-normal sm:whitespace-nowrap">{t("heroTitle.cta")}</span>
              <ChevronDown size={16} className="shrink-0 hidden sm:block" />
            </a>
          </div>

          {/* Right: logo */}
          <div className="mx-auto shrink-0">
            <div className="aspect-8/9 h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 relative">
              <Logo />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
```

This brings back:

- Server component (`async`, `getTranslations`).
- No 3D; no `"use client"`, no pathname/locale.
- Title, subtitle, CTA link, and logo layout as before.

### Step 2: (Optional) Remove hero-only 3D components

If you want to delete the 3D hero code (and keep other 3D scenes if any), remove only these:

- `src/components/3d/HeroScene.tsx`
- `src/components/3d/OscillatingSpotlight.tsx`
- `src/components/3d/CoinStack.tsx`
- `src/components/3d/Coin.tsx`
- `src/components/3d/AnimatedCandlestick.tsx`

Do **not** remove `Scene.tsx`, `CoinScene.tsx`, `CandlestickScene.tsx`, `CoinModel.tsx`, `CandlestickModel.tsx`, or `HeroCoinClient.tsx` if they are used elsewhere.

### Step 3: (Optional) Remove 3D/GSAP dependencies

Only if you are not using 3D or GSAP anywhere else:

```bash
cd frontend
npm uninstall @react-three/fiber @react-three/drei @react-three/postprocessing three gsap @gsap/react
npm uninstall -D @types/three
```

### Step 4: (Optional) Remove 3D assets

Only if you no longer need the hero GLB models anywhere:

- `public/3d/coinplain.glb`
- `public/3d/candlestick.glb`
- `public/3d/candlestick2.glb`
- `public/3d/candlestick3.glb`

---

## 6. Re-enabling the 3D Hero After Revert

1. Restore the current `hero.tsx` (client component that imports `HeroScene` and passes `spotlightColor`, `candlestickColor`, `mirror`) from version control or from this repo.
2. Ensure the six hero-only 3D files listed in **Step 2** above are present.
3. Ensure dependencies from **Section 3** are installed (`npm install` in `frontend`).
4. Ensure `public/3d/*.glb` assets are present.

No layout or route changes are required; the hero is self-contained in `hero.tsx` and the 3D components it imports.

---

## 7. Summary

| Topic | Details |
|-------|--------|
| **Current hero** | Client component; full-screen 3D (coins + candlesticks); theme by route; RTL mirror. |
| **Previous hero** | Server component; title + subtitle + CTA + logo; no 3D. |
| **Revert** | Replace `hero.tsx` with the code in **Section 5, Step 1**. Optionally remove hero-only 3D files and, if unused elsewhere, 3D/GSAP deps and GLB assets. |
| **Re-enable 3D** | Restore current `hero.tsx` and hero 3D components, deps, and assets. |

For questions or issues, refer to the `3d/` folder (legacy frontend) for the original 3D hero reference implementation.
