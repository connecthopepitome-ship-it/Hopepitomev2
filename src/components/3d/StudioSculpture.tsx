'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SculptureGeometry } from './SculptureGeometry';
import { FallbackSculpture } from './FallbackSculpture';

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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasWebGL(checkWebGLSupport());

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-cobalt-blue animate-ping" />
      </div>
    );
  }

  // Graceful fallback for non-WebGL or reduced motion preference
  if (!hasWebGL || prefersReducedMotion) {
    return <FallbackSculpture />;
  }

  return (
    <div className="relative w-full h-full pointer-events-none select-none">
      {/* Background Directional Cobalt Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] md:w-[520px] md:h-[520px] bg-cobalt-blue/15 blur-[120px] rounded-full pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Studio Lighting System */}
          <ambientLight intensity={0.65} color="#e6e9ee" />

          {/* Key Directional Light: Crisp White Studio Cast */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={2.4}
            color="#ffffff"
            castShadow
          />

          {/* Fill Light: Cool Graphite Shadow Softener */}
          <directionalLight
            position={[-5, -3, 2]}
            intensity={0.8}
            color="#8a92a0"
          />

          {/* Rim / Silhouette Light: Intense Cobalt Edge Lighting */}
          <directionalLight
            position={[4, -4, -6]}
            intensity={4.2}
            color="#1f51ff"
          />

          {/* Top Architectural Pin Light */}
          <pointLight
            position={[0, 4, 2]}
            intensity={1.2}
            color="#c8cbd0"
            distance={8}
          />

          {/* 3D Physical Art-Directed Sculpture */}
          <SculptureGeometry />
        </Suspense>
      </Canvas>
    </div>
  );
}
