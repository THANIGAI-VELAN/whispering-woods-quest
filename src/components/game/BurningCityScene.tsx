import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { BurningCityWorld } from './BurningCityWorld';
import { PlayerController } from './PlayerController';

export function BurningCityScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 80 }}
        gl={{ antialias: true }}
        style={{ background: '#1a0a04' }}
      >
        <Suspense fallback={null}>
          <BurningCityWorld />
          <PlayerController />
        </Suspense>
      </Canvas>
    </div>
  );
}
