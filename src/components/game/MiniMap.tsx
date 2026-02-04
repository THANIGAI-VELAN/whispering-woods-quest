import { motion } from 'framer-motion';
import { useGameStore, ElementType } from '@/store/gameStore';

const statuePositions: Record<ElementType, { x: number; z: number }> = {
  water: { x: 18, z: 0 },
  fire: { x: 0, z: 18 },
  air: { x: -18, z: 0 },
  sky: { x: 0, z: -18 },
  ether: { x: 0, z: 0 },
};

const elementColors: Record<ElementType, string> = {
  water: 'bg-water',
  fire: 'bg-fire',
  air: 'bg-air',
  sky: 'bg-sky',
  ether: 'bg-ether',
};

const elementIcons: Record<ElementType, string> = {
  water: '💧',
  fire: '🔥',
  air: '💨',
  sky: '⚡',
  ether: '✨',
};

export function MiniMap() {
  const { gamePhase, playerPosition, statueProgress, statueOrder, currentStatueIndex } = useGameStore();
  
  if (gamePhase !== 'exploring') return null;
  
  // Map scale: game world is roughly -25 to 25, map is 160px
  const mapSize = 160;
  const worldSize = 50; // -25 to 25
  const scale = mapSize / worldSize;
  
  // Convert world position to map position
  const worldToMap = (x: number, z: number) => ({
    x: (x + worldSize / 2) * scale,
    y: (z + worldSize / 2) * scale,
  });
  
  const playerMapPos = worldToMap(playerPosition.x, playerPosition.z);
  
  return (
    <motion.div
      className="fixed top-4 right-4 z-40"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-panel p-2 rounded-xl">
        <div className="text-xs text-muted-foreground font-body text-center mb-1">
          Forest Map
        </div>
        
        {/* Map container */}
        <div 
          className="relative rounded-lg overflow-hidden border border-border/50"
          style={{ width: mapSize, height: mapSize, background: 'hsl(160 30% 8%)' }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-muted-foreground" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-muted-foreground" />
          </div>
          
          {/* Cardinal directions */}
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">N</span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">S</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">W</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">E</span>
          
          {/* Statues */}
          {statueOrder.map((element, index) => {
            const isDiscovered = statueProgress[element].found || statueProgress[element].completed;
            const isActive = index <= currentStatueIndex;
            const isCompleted = statueProgress[element].completed;
            const pos = worldToMap(statuePositions[element].x, statuePositions[element].z);
            
            // Show statue if discovered or if it's the current target
            const shouldShow = isDiscovered || index === currentStatueIndex;
            
            if (!shouldShow) return null;
            
            return (
              <motion.div
                key={element}
                className="absolute"
                style={{
                  left: pos.x,
                  top: pos.y,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                {isCompleted ? (
                  <div className={`w-4 h-4 rounded-full ${elementColors[element]} flex items-center justify-center text-[8px]`}>
                    ✓
                  </div>
                ) : isActive && !isDiscovered ? (
                  <motion.div
                    className={`w-3 h-3 rounded-full border-2 border-dashed`}
                    style={{ borderColor: `hsl(var(--${element}))` }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <div 
                    className={`w-4 h-4 rounded-full ${elementColors[element]} pulse-glow flex items-center justify-center text-[8px]`}
                  >
                    {elementIcons[element]}
                  </div>
                )}
              </motion.div>
            );
          })}
          
          {/* Player */}
          <motion.div
            className="absolute w-3 h-3 bg-primary rounded-full border-2 border-primary-foreground shadow-lg"
            style={{
              left: playerMapPos.x,
              top: playerMapPos.y,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 10px hsl(var(--primary))',
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          
          {/* Player direction indicator */}
          <div
            className="absolute w-0 h-0"
            style={{
              left: playerMapPos.x,
              top: playerMapPos.y - 8,
              transform: 'translate(-50%, -50%)',
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderBottom: '6px solid hsl(var(--primary))',
            }}
          />
        </div>
        
        {/* Legend */}
        <div className="mt-2 flex flex-wrap gap-1 justify-center">
          {statueOrder.map((element, index) => {
            const isCompleted = statueProgress[element].completed;
            const isActive = index === currentStatueIndex;
            
            return (
              <div
                key={element}
                className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] ${
                  isCompleted 
                    ? 'bg-muted text-muted-foreground line-through' 
                    : isActive 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted/50 text-muted-foreground/50'
                }`}
              >
                <span>{elementIcons[element]}</span>
                <span className="capitalize">{element}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
