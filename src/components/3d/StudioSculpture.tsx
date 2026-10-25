'use client';

import { Suspense, useEffect, useState } from 'react';
import { j, SpectralDrape } from '@/components/ui/spectral-drape';
import { FallbackSculpture } from './FallbackSculpture';

export { j, SpectralDrape };

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

export function StudioSculpture() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(checkWebGLSupport());
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-cobalt-blue animate-ping" />
      </div>
    );
  }

  if (!hasWebGL) {
    return <FallbackSculpture />;
  }

  return (
    <div className="relative w-full h-full">
      <SpectralDrape
        className="w-full h-full"
        colors={['#1f51ff', '#E4DBFF']}
        backgroundColor="transparent"
        density={1.1}
        dotSize={1.15}
        strands={8}
        amplitude={1.1}
        frequency={0.8}
        thickness={0.8}
        depth={1.4}
        softness={0.55}
        intensity={1.25}
        colorShift={0.25}
        tilt={-38}
        turn={-42}
        roll={108}
        zoom={1.05}
        flow={1}
        speed={1}
        interactive={true}
        brush={1.2}
        brushRadius={0.22}
        parallax={1.2}
        clickRipples={true}
      />
    </div>
  );
}

export default StudioSculpture;
