import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/gameStore';

export function PlayerController() {
  const { camera } = useThree();
  const { movePlayer, gamePhase } = useGameStore();
  
  const keys = useRef<{ [key: string]: boolean }>({});
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const rotation = useRef(0);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  useFrame((_, delta) => {
    if (gamePhase !== 'exploring') return;
    
    const speed = 8;
    const rotSpeed = 2;
    
    // Rotation
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) {
      rotation.current += rotSpeed * delta;
    }
    if (keys.current['KeyD'] || keys.current['ArrowRight']) {
      rotation.current -= rotSpeed * delta;
    }
    
    // Movement direction
    direction.current.set(0, 0, 0);
    
    if (keys.current['KeyW'] || keys.current['ArrowUp']) {
      direction.current.z = -1;
    }
    if (keys.current['KeyS'] || keys.current['ArrowDown']) {
      direction.current.z = 1;
    }
    
    // Apply rotation to direction
    if (direction.current.length() > 0) {
      direction.current.normalize();
      direction.current.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
      
      velocity.current.x = direction.current.x * speed * delta;
      velocity.current.z = direction.current.z * speed * delta;
      
      camera.position.x += velocity.current.x;
      camera.position.z += velocity.current.z;
      
      // Clamp to forest bounds
      camera.position.x = Math.max(-40, Math.min(40, camera.position.x));
      camera.position.z = Math.max(-40, Math.min(40, camera.position.z));
    }
    
    // Update camera rotation
    camera.rotation.y = rotation.current;
    
    // Update player position in store
    movePlayer(camera.position.x, camera.position.z);
  });
  
  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 2, 8);
    camera.rotation.set(0, 0, 0);
  }, [camera]);
  
  return null;
}
