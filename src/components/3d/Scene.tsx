import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';
import { GymProduct } from './GymProduct';
import * as THREE from 'three';
import gsap from 'gsap';

interface SceneContentProps {
  cameraPosition: { x: number; y: number; z: number };
  targetRotation: { x: number; y: number; z: number };
  lightIntensity: number;
}

function SceneContent({ cameraPosition, targetRotation, lightIntensity }: SceneContentProps) {
  const { camera } = useThree();
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    gsap.to(camera.position, {
      x: cameraPosition.x,
      y: cameraPosition.y,
      z: cameraPosition.z,
      duration: 1.2,
      ease: 'power2.out',
    });
  }, [camera, cameraPosition]);

  useEffect(() => {
    if (lightRef.current) {
      gsap.to(lightRef.current, {
        intensity: lightIntensity,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }, [lightIntensity]);

  return (
    <>
      {/* Lighting setup - studio style */}
      <ambientLight intensity={0.3} />
      
      {/* Key light */}
      <directionalLight
        ref={lightRef}
        position={[5, 5, 5]}
        intensity={lightIntensity}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.4}
        color="#60a5fa"
      />
      
      {/* Rim light */}
      <spotLight
        position={[0, 5, -5]}
        intensity={0.8}
        angle={0.5}
        penumbra={1}
        color="#f0f9ff"
      />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Floating product */}
      <Float
        speed={2}
        rotationIntensity={0.2}
        floatIntensity={0.3}
      >
        <GymProduct targetRotation={targetRotation} />
      </Float>

      {/* Contact shadow for grounding */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  );
}

interface SceneProps {
  cameraPosition: { x: number; y: number; z: number };
  targetRotation: { x: number; y: number; z: number };
  lightIntensity: number;
}

export function Scene({ cameraPosition, targetRotation, lightIntensity }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 2]}
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <SceneContent
          cameraPosition={cameraPosition}
          targetRotation={targetRotation}
          lightIntensity={lightIntensity}
        />
      </Suspense>
    </Canvas>
  );
}
