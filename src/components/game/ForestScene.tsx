import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { ForestEnvironment } from './ForestEnvironment';
import { ElementalStatue } from './ElementalStatue';
import { PlayerController } from './PlayerController';
import { useGameStore, ElementType } from '@/store/gameStore';

// Statues positioned at cardinal directions for easy navigation
const statuePositions: Record<ElementType, [number, number, number]> = {
  water: [18, 0, 0],      // East
  fire: [0, 0, 18],       // South
  air: [-18, 0, 0],       // West
  sky: [0, 0, -18],       // North
  ether: [0, 0, 0],       // Center (final)
};

export function ForestScene() {
  const { statueProgress, currentStatueIndex, statueOrder } = useGameStore();
  
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
        style={{ background: '#050a08' }}
      >
        <Suspense fallback={null}>
          <ForestEnvironment />
          <PlayerController />
          
          {/* Render statues */}
          {statueOrder.map((element, index) => (
            <ElementalStatue
              key={element}
              element={element}
              position={statuePositions[element]}
              isActive={index <= currentStatueIndex}
              isCompleted={statueProgress[element].completed}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
