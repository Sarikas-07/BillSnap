"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function EnergyCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.25;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.4, 1]} />
        <MeshDistortMaterial color="#2E6FF2" distort={0.35} speed={1.6} roughness={0.15} metalness={0.4} />
      </mesh>
    </Float>
  );
}

function OrbitNode({ radius, speed, size, color, offset }: { radius: number; speed: number; size: number; color: string; offset: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (ref.current) {
      ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.7) * (radius * 0.4), Math.sin(t) * radius);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
}

export function HeroScene() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 4]} intensity={1.2} color="#FDB813" />
        <pointLight position={[-4, -2, -2]} intensity={0.8} color="#2E6FF2" />
        <EnergyCore />
        <OrbitNode radius={2.6} speed={0.5} size={0.16} color="#FDB813" offset={0} />
        <OrbitNode radius={3.1} speed={0.35} size={0.12} color="#17B892" offset={2} />
        <OrbitNode radius={2.2} speed={0.6} size={0.1} color="#6EA1FF" offset={4} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
