import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

const worldConfigs = {
  exploring: { bounds: 40, cameraY: 2, speed: 8 },
  exploring_underwater: { bounds: 35, cameraY: 3, speed: 6 },
  exploring_madurai: { bounds: 30, cameraY: 2, speed: 7 },
};

export function PlayerController() {
  const { camera } = useThree();
  const { movePlayer, gamePhase } = useGameStore();
  
  const keys = useRef<{ [key: string]: boolean }>({});
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const rotation = useRef(0);
  
  const isExploring = gamePhase === 'exploring' || gamePhase === 'exploring_underwater' || gamePhase === 'exploring_madurai';
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useFrame((_, delta) => {
    if (!isExploring) return;
    
    const config = worldConfigs[gamePhase as keyof typeof worldConfigs] || worldConfigs.exploring;
    const { speed, bounds, cameraY } = config;
    const rotSpeed = 2;
    
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) rotation.current += rotSpeed * delta;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) rotation.current -= rotSpeed * delta;
    
    direction.current.set(0, 0, 0);
    if (keys.current['KeyW'] || keys.current['ArrowUp']) direction.current.z = -1;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) direction.current.z = 1;
    
    if (direction.current.length() > 0) {
      direction.current.normalize();
      direction.current.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
      
      velocity.current.x = direction.current.x * speed * delta;
      velocity.current.z = direction.current.z * speed * delta;
      
      camera.position.x += velocity.current.x;
      camera.position.z += velocity.current.z;
      
      camera.position.x = Math.max(-bounds, Math.min(bounds, camera.position.x));
      camera.position.z = Math.max(-bounds, Math.min(bounds, camera.position.z));
    }
    
    camera.position.y = cameraY;
    camera.rotation.y = rotation.current;
    
    movePlayer(camera.position.x, camera.position.z);

    // Chapter triggers (only in forest)
    if (gamePhase === 'exploring') {
      const state = useGameStore.getState();
      const currentElement = state.statueOrder[state.currentStatueIndex];

      if (currentElement === 'water' && state.animalsMigrating && camera.position.x > 35) {
        state.triggerTransition('diving');
      }

      if (currentElement === 'fire' && camera.position.z > 35) {
        state.triggerTransition('rubbing_stones');
      }
    }
  });
  
  useEffect(() => {
    camera.position.set(0, worldConfigs[gamePhase as keyof typeof worldConfigs]?.cameraY || 2, 8);
    camera.rotation.set(0, 0, 0);
    rotation.current = 0;
  }, [camera, gamePhase]);
  
  return null;
}
