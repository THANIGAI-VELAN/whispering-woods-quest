import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { ElementType, useGameStore } from '@/store/gameStore';

interface StatueProps {
  element: ElementType;
  position: [number, number, number];
  isActive: boolean;
  isCompleted: boolean;
}

const elementColors: Record<ElementType, string> = {
  water: '#4dc3ff',
  fire: '#ff6b35',
  air: '#b8d4e3',
  earth: '#8B6914',
  ether: '#a855f7',
};

const elementEmissive: Record<ElementType, string> = {
  water: '#0066aa',
  fire: '#ff3300',
  air: '#88aabb',
  earth: '#5a4010',
  ether: '#7722bb',
};

export function ElementalStatue({ element, position, isActive, isCompleted }: StatueProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isNearby, setIsNearby] = useState(false);
  const { findStatue, playerPosition } = useGameStore();
  
  useFrame(() => {
    if (!isActive || isCompleted) return;
    
    const distance = Math.sqrt(
      (playerPosition.x - position[0]) ** 2 +
      (playerPosition.z - position[2]) ** 2
    );
    
    const wasNearby = isNearby;
    const nowNearby = distance < 4;
    
    setIsNearby(nowNearby);
    
    if (nowNearby && !wasNearby) {
      findStatue(element);
    }
    
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.1;
    }
  });
  
  if (!isActive && !isCompleted) {
    return null;
  }
  
  const color = elementColors[element];
  const emissive = elementEmissive[element];
  const intensity = isCompleted ? 0.3 : isNearby ? 1.5 : 0.8;
  
  return (
    <group ref={groupRef} position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.5, 1, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
      </mesh>
      
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 2, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={intensity}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>
      
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={intensity * 1.5}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      <pointLight
        position={[0, 3.5, 0]}
        color={color}
        intensity={isActive ? intensity * 5 : 1}
        distance={isActive ? 15 : 5}
      />
      
      {isActive && <ElementEffect element={element} isNearby={isNearby} />}
      
      {isNearby && (
        <Text
          position={[0, 5, 0]}
          fontSize={0.4}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {element.charAt(0).toUpperCase() + element.slice(1)} Statue
        </Text>
      )}
    </group>
  );
}

function ElementEffect({ element, isNearby }: { element: ElementType; isNearby: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = element === 'ether' ? 200 : 100;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 1.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.random() * 3;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [particleCount]);
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      switch (element) {
        case 'water':
          positions[i3 + 1] -= 0.03;
          if (positions[i3 + 1] < 0) positions[i3 + 1] = 3;
          positions[i3] += Math.sin(time + i) * 0.01;
          break;
        case 'fire':
          positions[i3 + 1] += 0.05;
          if (positions[i3 + 1] > 4) positions[i3 + 1] = 1;
          positions[i3] += Math.sin(time * 2 + i) * 0.02;
          break;
        case 'air':
          const angle = time * 0.5 + i * 0.1;
          const radius = 1 + Math.sin(time + i) * 0.5;
          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 2] = Math.sin(angle) * radius;
          positions[i3 + 1] = 2 + Math.sin(time * 2 + i) * 0.5;
          break;
        case 'earth':
          // Rising dust and trembling ground particles
          positions[i3 + 1] += 0.01;
          if (positions[i3 + 1] > 2) positions[i3 + 1] = 0;
          positions[i3] += Math.sin(time * 3 + i) * 0.015;
          positions[i3 + 2] += Math.cos(time * 3 + i) * 0.015;
          break;
        case 'ether':
          const etherAngle = time * 0.3 + i * 0.05;
          const etherRadius = 0.5 + (i / particleCount) * 2;
          positions[i3] = Math.cos(etherAngle) * etherRadius;
          positions[i3 + 1] = 2 + Math.sin(etherAngle * 2) * 1.5;
          positions[i3 + 2] = Math.sin(etherAngle) * etherRadius;
          break;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  const color = elementColors[element];
  const size = element === 'ether' ? 0.08 : 0.1;
  
  return (
    <points ref={particlesRef} position={[0, 1, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={isNearby ? 0.9 : 0.6}
        sizeAttenuation
      />
    </points>
  );
}
