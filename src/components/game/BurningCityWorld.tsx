import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

export function BurningCityWorld() {
  return (
    <>
      {/* Hot lighting */}
      <ambientLight intensity={0.15} color="#3a1808" />
      <directionalLight position={[30, 60, 20]} intensity={0.3} color="#ff6633" />
      <pointLight position={[0, 20, 0]} intensity={0.5} color="#ff4400" distance={80} />
      
      {/* Fire/smoke fog */}
      <fog attach="fog" args={[new THREE.Color('#1a0a04'), 5, 55]} />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#1a0e08" roughness={0.9} />
      </mesh>
      
      {/* City grid */}
      <CityBuildings />
      
      {/* Tamil board */}
      <MaduraiBoard />
      
      {/* Palace with fire statue */}
      <Palace />
      <FireStatue />
      
      {/* Fire effects */}
      <FireParticles />
      <Embers />
      <SmokeColumns />
      
      {/* Street fires for ambient light */}
      <StreetFires />
    </>
  );
}

function CityBuildings() {
  const buildings = useMemo(() => {
    const items: { x: number; z: number; w: number; h: number; d: number; burning: boolean }[] = [];
    
    // Create city blocks along streets
    const streets = [-20, -12, -4, 4, 12, 20];
    
    for (const sx of streets) {
      for (let sz = -30; sz <= 30; sz += 6) {
        // Skip palace area
        if (Math.abs(sx) < 6 && Math.abs(sz) < 6) continue;
        
        const side = Math.random() > 0.5 ? 2 : -2;
        items.push({
          x: sx + side,
          z: sz + (Math.random() - 0.5) * 2,
          w: 2 + Math.random() * 3,
          h: 3 + Math.random() * 6,
          d: 2 + Math.random() * 3,
          burning: Math.random() > 0.3,
        });
      }
    }
    
    return items;
  }, []);

  return (
    <group>
      {buildings.map((b, i) => (
        <BurningBuilding key={i} {...b} />
      ))}
    </group>
  );
}

function BurningBuilding({ x, z, w, h, d, burning }: { x: number; z: number; w: number; h: number; d: number; burning: boolean }) {
  return (
    <group position={[x, 0, z]}>
      {/* Main structure */}
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial 
          color={burning ? '#2a1508' : '#1e1610'} 
          roughness={0.9} 
          emissive={burning ? '#331100' : '#000000'}
          emissiveIntensity={burning ? 0.3 : 0}
        />
      </mesh>
      
      {/* Doorway */}
      <mesh position={[0, 0.8, d / 2 + 0.01]}>
        <planeGeometry args={[0.8, 1.6]} />
        <meshBasicMaterial color="#0a0504" />
      </mesh>
      
      {burning && (
        <>
          {/* Glow from windows */}
          <pointLight position={[0, h * 0.6, 0]} color="#ff4400" intensity={1.5} distance={8} />
          {/* Roof fire */}
          <BuildingFire position={[0, h, 0]} width={w} />
        </>
      )}
    </group>
  );
}

function BuildingFire({ position, width }: { position: [number, number, number]; width: number }) {
  const count = 8;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const flames = useMemo(() =>
    Array.from({ length: count }, () => ({
      xOff: (Math.random() - 0.5) * width * 0.8,
      speed: 1 + Math.random() * 2,
      offset: Math.random() * Math.PI * 2,
      maxH: 1 + Math.random() * 2,
    })), [width, count]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    flames.forEach((f, i) => {
      const h = (t * f.speed + f.offset) % 1;
      dummy.position.set(
        position[0] + f.xOff + Math.sin(t * 3 + f.offset) * 0.2,
        position[1] + h * f.maxH,
        position[2] + Math.cos(t * 2 + f.offset) * 0.15
      );
      const s = (1 - h) * 0.3;
      dummy.scale.set(s, s * 2, s);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ff6622" transparent opacity={0.7} />
    </instancedMesh>
  );
}

function Palace() {
  return (
    <group position={[0, 0, 0]}>
      {/* Platform */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[12, 1, 12]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.6} />
      </mesh>
      
      {/* Pillars */}
      {[
        [-4, 4], [4, 4], [-4, -4], [4, -4],
        [-4, 0], [4, 0], [0, 4], [0, -4],
      ].map(([px, pz], i) => (
        <mesh key={i} position={[px, 4, pz]}>
          <cylinderGeometry args={[0.4, 0.5, 7, 8]} />
          <meshStandardMaterial color="#3a2515" roughness={0.5} metalness={0.1} />
        </mesh>
      ))}
      
      {/* Roof */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[13, 0.8, 13]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.6} />
      </mesh>
      
      {/* Tower */}
      <mesh position={[0, 11, 0]}>
        <cylinderGeometry args={[1.5, 3, 5, 8]} />
        <meshStandardMaterial color="#3a2010" roughness={0.5} />
      </mesh>
      <mesh position={[0, 14, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#aa6622" emissive="#ff4400" emissiveIntensity={0.5} roughness={0.3} metalness={0.4} />
      </mesh>
      
      {/* Palace fire glow */}
      <pointLight position={[0, 5, 0]} color="#ff6633" intensity={3} distance={20} />
    </group>
  );
}

function MaduraiBoard() {
  return (
    <group position={[10, 3, 12]}>
      <mesh>
        <boxGeometry args={[4, 2.5, 0.3]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.5} />
      </mesh>
      <pointLight position={[0, 0, 1]} color="#ff6b35" intensity={1.5} distance={8} />
      <Text position={[0, 0.3, 0.2]} fontSize={0.7} color="#ff6b35" anchorX="center" anchorY="middle">
        மதுரை
      </Text>
      <Text position={[0, -0.5, 0.2]} fontSize={0.22} color="#cc8844" anchorX="center" anchorY="middle">
        Madurai — The Ancient City
      </Text>
    </group>
  );
}

function FireStatue() {
  const ref = useRef<THREE.Group>(null);
  const { findStatue, playerPosition, gamePhase } = useGameStore();
  
  const statuePos: [number, number, number] = [0, 0, 0];
  
  useFrame(() => {
    if (gamePhase !== 'exploring_madurai') return;
    const dist = Math.sqrt(playerPosition.x ** 2 + playerPosition.z ** 2);
    if (dist < 5) {
      findStatue('fire');
    }
    if (ref.current) {
      ref.current.position.y = 2 + Math.sin(Date.now() * 0.0015) * 0.1;
    }
  });
  
  return (
    <group position={statuePos} ref={ref}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[1, 1.3, 2, 8]} />
        <meshStandardMaterial color="#1a0a05" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 2.5, 8]} />
        <meshStandardMaterial color="#ff6b35" emissive="#ff3300" emissiveIntensity={1.5} roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, 5.3, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#ff6b35" emissive="#ff4400" emissiveIntensity={2.5} roughness={0.1} metalness={0.8} transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 5.3, 0]} color="#ff4400" intensity={10} distance={25} />
      
      <Text position={[0, 6.5, 0]} fontSize={0.4} color="#ff6b35" anchorX="center" anchorY="middle">
        Fire Statue
      </Text>
    </group>
  );
}

function FireParticles() {
  const count = 120;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        Math.random() * 2,
        (Math.random() - 0.5) * 60
      ),
      speed: 1 + Math.random() * 3,
      offset: Math.random() * Math.PI * 2,
      maxH: 5 + Math.random() * 10,
    })), []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const phase = (t * p.speed * 0.3 + p.offset) % 1;
      dummy.position.set(
        p.pos.x + Math.sin(t + p.offset) * 0.5,
        p.pos.y + phase * p.maxH,
        p.pos.z + Math.cos(t + p.offset) * 0.3
      );
      const s = (1 - phase) * 0.1;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ff5500" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function Embers() {
  const count = 60;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        Math.random() * 15,
        (Math.random() - 0.5) * 50
      ),
      speed: 0.5 + Math.random(),
      drift: (Math.random() - 0.5) * 2,
      offset: Math.random() * Math.PI * 2,
    })), []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      let y = (p.pos.y + t * p.speed) % 20;
      dummy.position.set(
        p.pos.x + Math.sin(t * 0.5 + p.offset) * p.drift,
        y,
        p.pos.z + Math.cos(t * 0.3 + p.offset) * p.drift * 0.5
      );
      dummy.scale.setScalar(0.03 + Math.sin(t * 3 + p.offset) * 0.01);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffaa33" transparent opacity={0.8} />
    </instancedMesh>
  );
}

function SmokeColumns() {
  const positions = useMemo(() => [
    [-15, 10], [15, -10], [-10, 20], [10, -20], [20, 15], [-20, -15],
  ], []);

  return (
    <group>
      {positions.map(([x, z], i) => (
        <SmokeColumn key={i} x={x} z={z} />
      ))}
    </group>
  );
}

function SmokeColumn({ x, z }: { x: number; z: number }) {
  const count = 6;
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const puffs = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      yOff: i * 3,
      speed: 0.5 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
    })), [count]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    puffs.forEach((p, i) => {
      const phase = (t * p.speed * 0.2 + p.offset) % 1;
      dummy.position.set(
        x + Math.sin(t * 0.3 + p.offset) * 0.5,
        phase * 15,
        z + Math.cos(t * 0.2 + p.offset) * 0.5
      );
      const s = 0.5 + phase * 1.5;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      ref.current?.setMatrixAt(i, dummy.matrix);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#1a1008" transparent opacity={0.15} />
    </instancedMesh>
  );
}

function StreetFires() {
  const positions = useMemo(() => [
    [-8, 8], [8, -8], [-15, -5], [15, 5], [-5, 15], [5, -15],
    [-12, 12], [12, -12], [-18, 0], [18, 0],
  ], []);

  return (
    <group>
      {positions.map(([x, z], i) => (
        <pointLight key={i} position={[x, 2, z]} color="#ff4400" intensity={2} distance={10} />
      ))}
    </group>
  );
}
