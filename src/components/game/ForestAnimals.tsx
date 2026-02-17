import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

interface AnimalData {
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  wanderAngle: number;
  speed: number;
  type: 'deer' | 'rabbit' | 'fox';
  scale: number;
  moveTimer: number;
}

function Deer({ position, rotation, scale }: { position: THREE.Vector3; rotation: number; scale: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <capsuleGeometry args={[0.25, 0.6, 8, 8]} />
        <meshStandardMaterial color="#8B6914" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0.4, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#9B7924" roughness={0.7} />
      </mesh>
      {/* Antlers */}
      <mesh position={[0.45, 1.5, 0.08]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.02, 0.01, 0.35, 4]} />
        <meshStandardMaterial color="#5a4020" />
      </mesh>
      <mesh position={[0.45, 1.5, -0.08]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.02, 0.01, 0.35, 4]} />
        <meshStandardMaterial color="#5a4020" />
      </mesh>
      {/* Legs */}
      {[[-0.15, 0, 0.12], [-0.15, 0, -0.12], [0.2, 0, 0.12], [0.2, 0, -0.12]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.25, pos[2]]} castShadow>
          <cylinderGeometry args={[0.04, 0.03, 0.5, 6]} />
          <meshStandardMaterial color="#7a5910" roughness={0.9} />
        </mesh>
      ))}
      {/* Glowing eyes */}
      <mesh position={[0.55, 1.25, 0.07]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#ffcc44" />
      </mesh>
      <mesh position={[0.55, 1.25, -0.07]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial color="#ffcc44" />
      </mesh>
    </group>
  );
}

function Rabbit({ position, rotation, scale }: { position: THREE.Vector3; rotation: number; scale: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Body */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#aaa088" roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh position={[0.2, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#bbb098" roughness={0.8} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.22, 0.55, 0.05]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.025, 0.15, 4, 4]} />
        <meshStandardMaterial color="#c8b8a8" />
      </mesh>
      <mesh position={[0.22, 0.55, -0.05]} rotation={[0, 0, -0.1]}>
        <capsuleGeometry args={[0.025, 0.15, 4, 4]} />
        <meshStandardMaterial color="#c8b8a8" />
      </mesh>
    </group>
  );
}

export function ForestAnimals() {
  const { animalsMigrating, waterPhase, currentStatueIndex } = useGameStore();
  const animalsRef = useRef<AnimalData[]>([]);
  const groupRef = useRef<THREE.Group>(null);
  const migrationStarted = useRef(false);
  const elapsedSinceExplore = useRef(0);

  // Only show animals during water chapter
  const showAnimals = currentStatueIndex === 0 && (waterPhase === 'forest_roam' || waterPhase === 'animals_migrate');

  const animals = useMemo(() => {
    const data: AnimalData[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 8 + Math.random() * 15;
      data.push({
        position: new THREE.Vector3(Math.cos(angle) * dist, 0, Math.sin(angle) * dist),
        targetPosition: new THREE.Vector3(Math.cos(angle) * dist, 0, Math.sin(angle) * dist),
        wanderAngle: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 2,
        type: i < 5 ? 'deer' : i < 9 ? 'rabbit' : 'fox',
        scale: i < 5 ? 0.8 + Math.random() * 0.4 : 0.5 + Math.random() * 0.3,
        moveTimer: Math.random() * 5,
      });
    }
    animalsRef.current = data;
    return data;
  }, []);

  useFrame((_, delta) => {
    if (!showAnimals) return;
    
    const { gamePhase, setAnimalsMigrating, setWaterPhase } = useGameStore.getState();
    if (gamePhase !== 'exploring') return;

    elapsedSinceExplore.current += delta;

    // After 10 seconds, trigger migration
    if (elapsedSinceExplore.current > 10 && !migrationStarted.current) {
      migrationStarted.current = true;
      setAnimalsMigrating(true);
      setWaterPhase('animals_migrate');
    }

    animalsRef.current.forEach((animal) => {
      animal.moveTimer -= delta;

      if (animalsMigrating) {
        // All animals move toward east (positive X = east, where ocean is)
        animal.targetPosition.set(38, 0, animal.position.z + Math.sin(Date.now() * 0.001 + animal.wanderAngle) * 2);
      } else if (animal.moveTimer <= 0) {
        // Random wandering
        animal.wanderAngle += (Math.random() - 0.5) * 2;
        const dist = 3 + Math.random() * 5;
        animal.targetPosition.set(
          animal.position.x + Math.cos(animal.wanderAngle) * dist,
          0,
          animal.position.z + Math.sin(animal.wanderAngle) * dist
        );
        // Keep within bounds
        animal.targetPosition.x = Math.max(-30, Math.min(30, animal.targetPosition.x));
        animal.targetPosition.z = Math.max(-30, Math.min(30, animal.targetPosition.z));
        animal.moveTimer = 3 + Math.random() * 4;
      }

      // Move toward target
      const dx = animal.targetPosition.x - animal.position.x;
      const dz = animal.targetPosition.z - animal.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      
      if (dist > 0.5) {
        const moveSpeed = animalsMigrating ? animal.speed * 1.5 : animal.speed;
        animal.position.x += (dx / dist) * moveSpeed * delta;
        animal.position.z += (dz / dist) * moveSpeed * delta;
      }
    });
  });

  if (!showAnimals) return null;

  return (
    <group ref={groupRef}>
      {animals.map((animal, i) => {
        const dx = animal.targetPosition.x - animal.position.x;
        const dz = animal.targetPosition.z - animal.position.z;
        const rotation = Math.atan2(dz, dx);
        
        if (animal.type === 'deer') {
          return <Deer key={i} position={animal.position} rotation={rotation} scale={animal.scale} />;
        }
        return <Rabbit key={i} position={animal.position} rotation={rotation} scale={animal.scale} />;
      })}

      {/* Ambient animal sounds visual - fireflies near animals */}
      {animalsMigrating && (
        <pointLight position={[35, 3, 0]} color="#4dc3ff" intensity={8} distance={20} />
      )}
    </group>
  );
}
