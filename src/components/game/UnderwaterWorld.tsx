import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

export function UnderwaterWorld() {
  return (
    <>
      {/* Underwater lighting */}
      <ambientLight intensity={0.12} color="#1a4060" />
      <directionalLight position={[30, 80, 20]} intensity={0.2} color="#4488aa" />
      <pointLight position={[0, 15, 0]} intensity={0.4} color="#3399cc" distance={60} />
      
      {/* Underwater fog */}
      <fog attach="fog" args={[new THREE.Color('#061828'), 5, 55]} />
      
      {/* Ocean floor */}
      <OceanFloor />
      
      {/* Temple ruins and city structures */}
      <CityStructures />
      
      {/* Tamil board */}
      <KumariKandamBoard />
      
      {/* Water statue */}
      <WaterStatue />
      
      {/* Ambient particles */}
      <Bubbles />
      <Bioluminescence />
      <FloatingDebris />
      
      {/* Caustic light rays from surface */}
      <CausticRays />
    </>
  );
}

function OceanFloor() {
  return (
    <group>
      {/* Main sandy floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0a1a28" roughness={0.9} />
      </mesh>
      
      {/* Scattered rocks */}
      {useMemo(() => 
        Array.from({ length: 40 }, (_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const dist = 5 + Math.random() * 35;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * dist, Math.random() * 0.3, Math.sin(angle) * dist]}
              rotation={[Math.random(), Math.random(), 0]}
            >
              <dodecahedronGeometry args={[0.3 + Math.random() * 0.6, 0]} />
              <meshStandardMaterial color={`hsl(200, ${10 + Math.random() * 15}%, ${10 + Math.random() * 8}%)`} roughness={0.8} />
            </mesh>
          );
        }), []
      )}
      
      {/* Seaweed clusters */}
      {useMemo(() =>
        Array.from({ length: 25 }, (_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const dist = 4 + Math.random() * 30;
          return (
            <Seaweed key={i} position={[Math.cos(angle) * dist, 0, Math.sin(angle) * dist]} />
          );
        }), []
      )}
    </group>
  );
}

function Seaweed({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const swaySpeed = 0.5 + Math.random() * 0.5;
  const height = 1 + Math.random() * 2;
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * swaySpeed) * 0.15;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * swaySpeed * 0.7) * 0.1;
    }
  });
  
  return (
    <group position={position} ref={ref}>
      {[0, 0.15, -0.1].map((offset, i) => (
        <mesh key={i} position={[offset, height * 0.5, offset * 0.5]}>
          <cylinderGeometry args={[0.03, 0.06, height, 4]} />
          <meshStandardMaterial color={`hsl(${140 + Math.random() * 30}, 50%, ${12 + Math.random() * 8}%)`} />
        </mesh>
      ))}
    </group>
  );
}

function CityStructures() {
  const structures = useMemo(() => {
    const items: { x: number; z: number; type: 'column' | 'wall' | 'arch' | 'temple'; h: number; rot: number }[] = [];
    
    // Temple columns lining a central avenue
    for (let i = -4; i <= 4; i++) {
      items.push({ x: -5, z: i * 5, type: 'column', h: 6 + Math.random() * 3, rot: 0 });
      items.push({ x: 5, z: i * 5, type: 'column', h: 6 + Math.random() * 3, rot: 0 });
    }
    
    // Ruined walls
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 12 + Math.random() * 18;
      items.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        type: 'wall',
        h: 3 + Math.random() * 4,
        rot: angle + Math.PI / 2,
      });
    }
    
    // Arches
    items.push({ x: 0, z: -12, type: 'arch', h: 8, rot: 0 });
    items.push({ x: 0, z: 12, type: 'arch', h: 7, rot: 0 });
    
    // Main temple building at center-south
    items.push({ x: 0, z: -22, type: 'temple', h: 12, rot: 0 });
    
    return items;
  }, []);

  return (
    <group>
      {structures.map((s, i) => {
        switch (s.type) {
          case 'column':
            return <Column key={i} position={[s.x, 0, s.z]} height={s.h} />;
          case 'wall':
            return <RuinedWall key={i} position={[s.x, 0, s.z]} height={s.h} rotation={s.rot} />;
          case 'arch':
            return <Arch key={i} position={[s.x, 0, s.z]} height={s.h} />;
          case 'temple':
            return <TempleBuilding key={i} position={[s.x, 0, s.z]} />;
          default:
            return null;
        }
      })}
    </group>
  );
}

function Column({ position, height }: { position: [number, number, number]; height: number }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.6, 8]} />
        <meshStandardMaterial color="#2a3a40" roughness={0.7} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, height / 2 + 0.6, 0]}>
        <cylinderGeometry args={[0.35, 0.45, height, 8]} />
        <meshStandardMaterial color="#1e3038" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, height + 0.6, 0]}>
        <cylinderGeometry args={[0.6, 0.35, 0.5, 8]} />
        <meshStandardMaterial color="#2a3a40" roughness={0.7} />
      </mesh>
    </group>
  );
}

function RuinedWall({ position, height, rotation }: { position: [number, number, number]; height: number; rotation: number }) {
  return (
    <mesh position={[position[0], height / 2, position[2]]} rotation={[0, rotation, 0]}>
      <boxGeometry args={[4, height, 0.5]} />
      <meshStandardMaterial color="#1a2830" roughness={0.8} />
    </mesh>
  );
}

function Arch({ position, height }: { position: [number, number, number]; height: number }) {
  return (
    <group position={position}>
      {/* Two pillars */}
      <mesh position={[-2, height / 2, 0]}>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color="#1e3038" roughness={0.7} />
      </mesh>
      <mesh position={[2, height / 2, 0]}>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color="#1e3038" roughness={0.7} />
      </mesh>
      {/* Top beam */}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[5.6, 0.8, 1]} />
        <meshStandardMaterial color="#2a3a40" roughness={0.6} />
      </mesh>
    </group>
  );
}

function TempleBuilding({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base platform */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[14, 1, 10]} />
        <meshStandardMaterial color="#182830" roughness={0.7} />
      </mesh>
      {/* Walls */}
      <mesh position={[-6.5, 4, 0]}>
        <boxGeometry args={[0.6, 7, 10]} />
        <meshStandardMaterial color="#1a2a35" roughness={0.7} />
      </mesh>
      <mesh position={[6.5, 4, 0]}>
        <boxGeometry args={[0.6, 7, 10]} />
        <meshStandardMaterial color="#1a2a35" roughness={0.7} />
      </mesh>
      <mesh position={[0, 4, -4.7]}>
        <boxGeometry args={[14, 7, 0.6]} />
        <meshStandardMaterial color="#1a2a35" roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[15, 0.8, 11]} />
        <meshStandardMaterial color="#2a3a45" roughness={0.6} />
      </mesh>
      {/* Gopuram tower */}
      <mesh position={[0, 11, 4.5]}>
        <boxGeometry args={[6, 5, 1.5]} />
        <meshStandardMaterial color="#253540" roughness={0.6} />
      </mesh>
      <mesh position={[0, 14.5, 4.5]}>
        <boxGeometry args={[4, 2, 1.2]} />
        <meshStandardMaterial color="#2a3a45" roughness={0.5} />
      </mesh>
      {/* Inner glow */}
      <pointLight position={[0, 3, -2]} color="#3399cc" intensity={2} distance={15} />
    </group>
  );
}

function KumariKandamBoard() {
  return (
    <group position={[8, 4, -10]}>
      {/* Stone slab */}
      <mesh>
        <boxGeometry args={[5, 3, 0.3]} />
        <meshStandardMaterial color="#1e2e38" roughness={0.5} metalness={0.2} />
      </mesh>
      <pointLight position={[0, 0, 1]} color="#4dc3ff" intensity={1.5} distance={8} />
      <Text
        position={[0, 0.4, 0.2]}
        fontSize={0.8}
        color="#4dc3ff"
        anchorX="center"
        anchorY="middle"
      >
        குமரிக்கண்டம்
      </Text>
      <Text
        position={[0, -0.6, 0.2]}
        fontSize={0.25}
        color="#6abfdd"
        anchorX="center"
        anchorY="middle"
      >
        Kumari Kandam — The Lost Civilization
      </Text>
    </group>
  );
}

function WaterStatue() {
  const ref = useRef<THREE.Group>(null);
  const { findStatue, playerPosition, gamePhase } = useGameStore();
  
  const statuePos: [number, number, number] = [0, 0, -22];
  
  useFrame(() => {
    if (gamePhase !== 'exploring_underwater') return;
    const dist = Math.sqrt(
      (playerPosition.x - statuePos[0]) ** 2 + (playerPosition.z - statuePos[2]) ** 2
    );
    if (dist < 5) {
      findStatue('water');
    }
    if (ref.current) {
      ref.current.position.y = 2.5 + Math.sin(Date.now() * 0.001) * 0.15;
    }
  });
  
  return (
    <group position={statuePos} ref={ref}>
      {/* Pedestal */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.2, 1.5, 2, 8]} />
        <meshStandardMaterial color="#1a2a35" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Statue body */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 2.5, 8]} />
        <meshStandardMaterial color="#4dc3ff" emissive="#0066aa" emissiveIntensity={1.2} roughness={0.2} metalness={0.5} />
      </mesh>
      {/* Orb */}
      <mesh position={[0, 4.8, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#4dc3ff" emissive="#0088cc" emissiveIntensity={2} roughness={0.1} metalness={0.8} transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 4.8, 0]} color="#4dc3ff" intensity={8} distance={20} />
      
      <Text position={[0, 6, 0]} fontSize={0.4} color="#4dc3ff" anchorX="center" anchorY="middle">
        Water Statue
      </Text>
    </group>
  );
}

function Bubbles() {
  const count = 80;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 70,
        Math.random() * 20,
        (Math.random() - 0.5) * 70
      ),
      speed: 0.3 + Math.random() * 0.6,
      offset: Math.random() * Math.PI * 2,
      size: 0.05 + Math.random() * 0.12,
    })), []
  );

  useFrame((state) => {
    particles.forEach((p, i) => {
      const t = state.clock.elapsedTime;
      let y = p.pos.y + t * p.speed;
      y = y % 25;
      dummy.position.set(
        p.pos.x + Math.sin(t * 0.5 + p.offset) * 0.5,
        y,
        p.pos.z + Math.cos(t * 0.5 + p.offset) * 0.5
      );
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#88ccff" transparent opacity={0.35} />
    </instancedMesh>
  );
}

function Bioluminescence() {
  const count = 40;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        0.5 + Math.random() * 8,
        (Math.random() - 0.5) * 60
      ),
      speed: 0.2 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
    })), []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.pos.x + Math.sin(t * p.speed + p.offset) * 2,
        p.pos.y + Math.sin(t * p.speed * 1.3 + p.offset) * 0.5,
        p.pos.z + Math.cos(t * p.speed + p.offset) * 2
      );
      const s = 0.08 + Math.sin(t * 2 + p.offset) * 0.03;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#44ffcc" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function FloatingDebris() {
  const count = 20;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        2 + Math.random() * 10,
        (Math.random() - 0.5) * 60
      ),
      rotSpeed: 0.1 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
    })), []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.pos.x + Math.sin(t * 0.1 + p.offset) * 0.5,
        p.pos.y + Math.sin(t * 0.2 + p.offset) * 0.3,
        p.pos.z
      );
      dummy.rotation.set(t * p.rotSpeed, t * p.rotSpeed * 0.7, 0);
      dummy.scale.setScalar(0.15 + Math.random() * 0.05);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 0.2, 0.5]} />
      <meshStandardMaterial color="#1a3040" roughness={0.9} />
    </instancedMesh>
  );
}

function CausticRays() {
  const rays = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      x: -15 + i * 4 + Math.random() * 2,
      z: (Math.random() - 0.5) * 20,
      speed: 0.3 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
    })), []
  );

  return (
    <group>
      {rays.map((ray, i) => (
        <CausticRay key={i} {...ray} />
      ))}
    </group>
  );
}

function CausticRay({ x, z, speed, offset }: { x: number; z: number; speed: number; offset: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.03 + Math.sin(t * speed + offset) * 0.02;
    }
  });

  return (
    <mesh ref={ref} position={[x, 12, z]} rotation={[0, 0, Math.random() * 0.3 - 0.15]}>
      <planeGeometry args={[0.5, 25]} />
      <meshBasicMaterial color="#55aadd" transparent opacity={0.04} side={THREE.DoubleSide} />
    </mesh>
  );
}
