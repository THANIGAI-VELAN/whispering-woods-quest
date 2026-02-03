import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ForestEnvironment() {
  const fogColor = new THREE.Color(0x0a1510);
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.15} color="#1a3025" />
      
      {/* Main moonlight */}
      <directionalLight
        position={[50, 100, 50]}
        intensity={0.3}
        color="#4a6b8a"
        castShadow
      />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0a1208" />
      </mesh>
      
      {/* Fog */}
      <fog attach="fog" args={[fogColor, 5, 60]} />
      
      {/* Trees */}
      <Trees />
      
      {/* Fireflies */}
      <Fireflies />
    </>
  );
}

function Trees() {
  const trees = useMemo(() => {
    const positions: { x: number; z: number; scale: number; rotation: number }[] = [];
    
    // Generate random tree positions avoiding center area and statue positions
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 6 + Math.random() * 35;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      
      // Avoid statue positions with larger clearings
      const statuePositions = [
        { x: 18, z: 0 },
        { x: 0, z: 18 },
        { x: -18, z: 0 },
        { x: 0, z: -18 },
        { x: 0, z: 0 },
      ];
      
      const tooClose = statuePositions.some(
        (pos) => Math.sqrt((x - pos.x) ** 2 + (z - pos.z) ** 2) < 6
      );
      
      // Also avoid player start area
      const nearStart = Math.sqrt(x ** 2 + (z - 8) ** 2) < 4;
      
      if (!tooClose && !nearStart) {
        positions.push({
          x,
          z,
          scale: 0.7 + Math.random() * 0.5,
          rotation: Math.random() * Math.PI * 2,
        });
      }
    }
    
    return positions;
  }, []);
  
  return (
    <>
      {trees.map((tree, i) => (
        <Tree key={i} position={[tree.x, 0, tree.z]} scale={tree.scale} rotation={tree.rotation} />
      ))}
    </>
  );
}


function Tree({ position, scale, rotation }: { position: [number, number, number]; scale: number; rotation: number }) {
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      {/* Trunk */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
        <meshStandardMaterial color="#1a0f0a" />
      </mesh>
      
      {/* Foliage layers */}
      <mesh position={[0, 5, 0]} castShadow>
        <coneGeometry args={[2, 3, 8]} />
        <meshStandardMaterial color="#0a2010" />
      </mesh>
      <mesh position={[0, 6.5, 0]} castShadow>
        <coneGeometry args={[1.5, 2.5, 8]} />
        <meshStandardMaterial color="#0d2814" />
      </mesh>
      <mesh position={[0, 7.8, 0]} castShadow>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color="#0f3018" />
      </mesh>
    </group>
  );
}

function Fireflies() {
  const count = 50;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 5 + Math.random() * 30;
      temp.push({
        position: new THREE.Vector3(
          Math.cos(angle) * distance,
          1 + Math.random() * 4,
          Math.sin(angle) * distance
        ),
        speed: 0.5 + Math.random() * 1,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, []);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useFrame((state) => {
    particles.forEach((particle, i) => {
      const t = state.clock.elapsedTime * particle.speed + particle.offset;
      
      dummy.position.set(
        particle.position.x + Math.sin(t) * 0.5,
        particle.position.y + Math.sin(t * 1.5) * 0.3,
        particle.position.z + Math.cos(t) * 0.5
      );
      
      const scale = 0.05 + Math.sin(t * 3) * 0.02;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      
      mesh.current?.setMatrixAt(i, dummy.matrix);
    });
    
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });
  
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#aaff77" transparent opacity={0.8} />
    </instancedMesh>
  );
}
