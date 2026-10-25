'use client';

import React, { useEffect, useState } from 'react';
import { SpectralDrape } from '@/components/ui/spectral-drape';

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
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
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
            density={1.15}
            dotSize={1.1}
            strands={8}
            amplitude={1.15}
            frequency={0.75}
            thickness={0.75}
            depth={1.5}
            softness={0.6}
            intensity={1.25}
            colorShift={0.2}
            tilt={-36}
            turn={-42}
            roll={108}
            zoom={1.1}
            flow={0.85}
            speed={0.85}
            interactive={true}
            brush={1.0}
            brushRadius={0.22}
            parallax={0.7}
            clickRipples={true}
            globalPointer={true}
            dpr={2}
          />
        </div>
      ) : (
        /* Graceful Non-WebGL Fallback */
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(139,108,255,0.15),transparent_70%)]" />
      )}

      {/* Layer 3: Atmospheric Vignette & Contrast Control */}
      {/* Ensures high readability for white and silver typography across all sections */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,transparent_35%,rgba(7,8,11,0.85)_85%)]" />

      {/* Subtle Atmospheric Color Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#8B6CFF]/[0.05] blur-[180px] rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-[450px] h-[450px] bg-[#1f51ff]/[0.04] blur-[160px] rounded-full" />
    </div>
  );
}

export default SpectralBackground;
