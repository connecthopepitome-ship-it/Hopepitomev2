'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SpectralDrape to prevent any SSR / WebGL context evaluation in Node/Worker environments
const SpectralDrape = dynamic(
  () => import('@/components/ui/spectral-drape').then((mod) => mod.SpectralDrape),
  { ssr: false }
);

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Site-Wide Persistent Spectral Drape Background Layer.
 * Renders an immersive, full-viewport 3D glowing dot mesh behind all pages,
 * with global pointer wake tracking and atmospheric depth vignette.
 */
export function SpectralBackground() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(checkWebGLSupport());
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Layer 1: Base Obsidian Surface */}
      <div className="absolute inset-0 bg-[#07080C]" />

      {/* Layer 2: 3D Living Spectral Drape Mesh */}
      {mounted && hasWebGL ? (
        <div className="absolute inset-0 w-full h-full">
          <SpectralDrape
            className="w-full h-full"
            colors={['#9D85FF', '#E8E2FF']}
            backgroundColor="transparent"
            density={1.2}
            dotSize={1.15}
            strands={8}
            amplitude={1.15}
            frequency={0.75}
            thickness={0.8}
            depth={1.5}
            softness={0.55}
            intensity={1.3}
            colorShift={0.2}
            tilt={-36}
            turn={-42}
            roll={108}
            zoom={1.1}
            flow={0.85}
            speed={0.85}
            interactive={true}
            brush={1.2}
            brushRadius={0.25}
            parallax={0.8}
            clickRipples={true}
            globalPointer={true}
            dpr={2}
          />
        </div>
      ) : (
        /* Graceful Non-WebGL Fallback */
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(157,133,255,0.2),transparent_70%)]" />
      )}

      {/* Layer 3: Atmospheric Subtle Violet Ambience */}
      <div className="absolute top-1/4 right-10 w-[550px] h-[550px] bg-[#9D85FF]/[0.08] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] bg-[#9D85FF]/[0.06] blur-[180px] rounded-full pointer-events-none" />

      {/* Layer 4: Global Optical Contrast Stabilizer (preserves 3D visibility while preventing text blinding) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07080C]/20 via-transparent to-[#07080C]/35 pointer-events-none" />
    </div>
  );
}

export default SpectralBackground;
