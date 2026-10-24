'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SculptureGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Group>(null);

  // Materials with physical properties
  const materials = useMemo(() => {
    // Smoked architectural glass
    const smokedGlass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#14171d'),
      transmission: 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.14,
      metalness: 0.1,
      ior: 1.52,
      thickness: 1.8,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });

    // Brushed titanium / metallic silver
    const brushedMetal = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c5c8ce'),
      metalness: 0.92,
      roughness: 0.28,
    });

    // Dark graphite structural matte
    const darkStructural = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#101215'),
      metalness: 0.85,
      roughness: 0.45,
    });

    // Cobalt highlight element
    const cobaltAccent = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1f51ff'),
      emissive: new THREE.Color('#1f51ff'),
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.2,
    });

    return { smokedGlass, brushedMetal, darkStructural, cobaltAccent };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Subtle, graceful floating oscillation
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.12;

    // Slow, controlled rotation
    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.08;

    // Subtle pointer parallax
    const targetX = state.pointer.x * 0.35;
    const targetY = state.pointer.y * 0.25;
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y * 0.5) * 0.02;
    groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x * 0.5) * 0.02;

    // Secondary ring independent counter-motion
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.08;
      ringRef.current.rotation.z += delta * 0.04;
    }

    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.16;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.25}>
      {/* Central Core: Architectural Smoked Glass Monolith */}
      <group ref={coreRef}>
        <mesh material={materials.smokedGlass} castShadow receiveShadow>
          <boxGeometry args={[1.6, 2.8, 0.45]} />
        </mesh>

        {/* Interlocking Diagonal Glass Bevel Slab */}
        <mesh
          position={[0.3, 0.2, 0.2]}
          rotation={[0.35, 0.4, 0.15]}
          material={materials.smokedGlass}
        >
          <boxGeometry args={[1.3, 2.2, 0.35]} />
        </mesh>
      </group>

      {/* Internal Cobalt Refraction Core */}
      <mesh
        ref={innerRef}
        position={[0, 0, 0]}
        rotation={[0.5, 0.5, 0]}
        material={materials.cobaltAccent}
      >
        <octahedronGeometry args={[0.42, 0]} />
      </mesh>

      {/* Structural Brushed Metallic Datum Ring */}
      <mesh
        ref={ringRef}
        rotation={[Math.PI / 3, 0.2, 0.4]}
        material={materials.brushedMetal}
      >
        <torusGeometry args={[1.85, 0.028, 24, 100]} />
      </mesh>

      {/* Secondary Fine Titanium Ellipse Ring */}
      <mesh
        rotation={[-Math.PI / 4, 0.8, -0.2]}
        material={materials.brushedMetal}
      >
        <torusGeometry args={[2.15, 0.015, 20, 100]} />
      </mesh>

      {/* Architectural Alignment Pins / Transverse Hairline Rods */}
      <mesh
        position={[0, 0.9, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={materials.brushedMetal}
      >
        <cylinderGeometry args={[0.02, 0.02, 3.2, 16]} />
      </mesh>

      <mesh
        position={[0, -0.85, 0.15]}
        rotation={[Math.PI / 4, 0, Math.PI / 3]}
        material={materials.darkStructural}
      >
        <cylinderGeometry args={[0.025, 0.025, 2.8, 16]} />
      </mesh>

      {/* Precision Corner Bevel Anchors */}
      <mesh position={[0.85, 1.45, 0.25]} material={materials.cobaltAccent}>
        <sphereGeometry args={[0.045, 16, 16]} />
      </mesh>
      <mesh position={[-0.85, -1.45, -0.25]} material={materials.brushedMetal}>
        <sphereGeometry args={[0.045, 16, 16]} />
      </mesh>
    </group>
  );
}
