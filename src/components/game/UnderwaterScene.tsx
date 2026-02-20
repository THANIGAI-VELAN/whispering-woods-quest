import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { UnderwaterWorld } from './UnderwaterWorld';
import { PlayerController } from './PlayerController';

export function UnderwaterScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 80 }}
        gl={{ antialias: true }}
        style={{ background: '#061828' }}
      >
        <Suspense fallback={null}>
          <UnderwaterWorld />
          <PlayerController />
        </Suspense>
      </Canvas>
    </div>
  );
}
