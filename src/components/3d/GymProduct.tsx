import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface GymProductProps {
  targetRotation: { x: number; y: number; z: number };
}

export function GymProduct({ targetRotation }: GymProductProps) {
  const groupRef = useRef<THREE.Group>(null);
  const dumbbellRef = useRef<THREE.Group>(null);
  
  // Smooth rotation interpolation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.x,
        delta * 2
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.y + state.clock.elapsedTime * 0.1,
        delta * 2
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        targetRotation.z,
        delta * 2
      );
    }
  });

  // Metallic material for dumbbell
  const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1e293b',
    metalness: 0.95,
    roughness: 0.1,
  }), []);

  const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    metalness: 1,
    roughness: 0.05,
  }), []);

  const rubberMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#3B82F6',
    metalness: 0.1,
    roughness: 0.8,
  }), []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Dumbbell */}
      <group ref={dumbbellRef} rotation={[0, 0, Math.PI / 2]}>
        {/* Center bar */}
        <mesh material={chromeMaterial}>
          <cylinderGeometry args={[0.08, 0.08, 2, 32]} />
        </mesh>
        
        {/* Grip texture (knurled pattern) */}
        <mesh position={[0, 0, 0]} material={metalMaterial}>
          <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
        </mesh>
        
        {/* Left weight plates */}
        <group position={[0, -0.85, 0]}>
          {/* Collar */}
          <mesh material={chromeMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
          </mesh>
          {/* Inner plate */}
          <mesh position={[0, -0.12, 0]} material={metalMaterial}>
            <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
          </mesh>
          {/* Outer plate */}
          <mesh position={[0, -0.25, 0]} material={rubberMaterial}>
            <cylinderGeometry args={[0.45, 0.45, 0.15, 32]} />
          </mesh>
          {/* Outer ring */}
          <RoundedBox args={[0.95, 0.14, 0.95]} position={[0, -0.25, 0]} radius={0.05}>
            <meshStandardMaterial color="#3B82F6" metalness={0.2} roughness={0.6} />
          </RoundedBox>
        </group>
        
        {/* Right weight plates */}
        <group position={[0, 0.85, 0]}>
          {/* Collar */}
          <mesh material={chromeMaterial}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
          </mesh>
          {/* Inner plate */}
          <mesh position={[0, 0.12, 0]} material={metalMaterial}>
            <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
          </mesh>
          {/* Outer plate */}
          <mesh position={[0, 0.25, 0]} material={rubberMaterial}>
            <cylinderGeometry args={[0.45, 0.45, 0.15, 32]} />
          </mesh>
          {/* Outer ring */}
          <RoundedBox args={[0.95, 0.14, 0.95]} position={[0, 0.25, 0]} radius={0.05}>
            <meshStandardMaterial color="#3B82F6" metalness={0.2} roughness={0.6} />
          </RoundedBox>
        </group>
      </group>

      {/* Floating accent elements */}
      <mesh position={[1.2, 0.5, -0.5]} scale={0.15}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.1}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
        />
      </mesh>

      <mesh position={[-1.3, -0.3, 0.5]} scale={0.1}>
        <octahedronGeometry args={[1]} />
        <meshStandardMaterial color="#34D399" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[0.8, -0.6, 0.8]} scale={0.08}>
        <torusGeometry args={[1, 0.4, 16, 32]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}
