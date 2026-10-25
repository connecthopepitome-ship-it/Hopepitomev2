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
      {/* Layer 1: Base Near-Black Surface */}
      <div className="absolute inset-0 bg-[#07080B]" />

      {/* Layer 2: 3D Living Spectral Drape Mesh */}
      {mounted && hasWebGL ? (
        <div className="absolute inset-0 w-full h-full">
          <SpectralDrape
            className="w-full h-full"
            colors={['#8B6CFF', '#E4DBFF']}
            backgroundColor="transparent"
            density={1.2}
            dotSize={1.15}
            strands={8}
            amplitude={1.15}
            frequency={0.75}
            thickness={0.8}
            depth={1.5}
            softness={0.55}
            intensity={1.4}
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(139,108,255,0.2),transparent_70%)]" />
      )}

      {/* Layer 3: Atmospheric Subtle Violet Ambience (Non-blocking, does not mask mesh) */}
      <div className="absolute top-1/4 right-10 w-[550px] h-[550px] bg-[#8B6CFF]/[0.07] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] bg-[#8B6CFF]/[0.05] blur-[180px] rounded-full pointer-events-none" />
    </div>
  );
}

export default SpectralBackground;
