import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { statueClues } from '@/data/questions';

export function GameHUD() {
  const { 
    gamePhase, 
    currentStatueIndex, 
    statueOrder, 
    statueProgress,
    playerPosition 
  } = useGameStore();
  
  if (gamePhase !== 'exploring') return null;
  
  const currentElement = statueOrder[currentStatueIndex];
  const clue = statueClues[currentElement];
  
  // Calculate progress
  const completedCount = Object.values(statueProgress).filter(s => s.completed).length;
  
  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          {/* Progress indicators */}
          <div className="flex gap-2 pointer-events-auto">
            {statueOrder.map((element, index) => {
              const completed = statueProgress[element].completed;
              const isCurrent = index === currentStatueIndex;
              
              return (
                <motion.div
                  key={element}
                  className={`w-12 h-12 rounded-full flex items-center justify-center
                             border-2 transition-all duration-300 glass-panel
                             ${completed 
                               ? `border-${element} bg-${element}/20` 
                               : isCurrent 
                                 ? 'border-primary pulse-glow' 
                                 : 'border-border opacity-50'
                             }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ElementEmoji element={element} completed={completed} />
                </motion.div>
              );
            })}
          </div>
          
          {/* Statue counter */}
          <div className="glass-panel px-4 py-2 rounded-lg">
            <span className="text-sm font-display text-muted-foreground">
              Statues Found: {completedCount}/5
            </span>
          </div>
        </div>
      </div>
      
      {/* Clue hint */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 max-w-lg px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="glass-panel p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground font-body italic">
            "{clue.approaching}"
          </p>
        </div>
      </motion.div>
      
      {/* Controls reminder */}
      <div className="absolute bottom-4 left-4">
        <div className="glass-panel px-4 py-2 rounded-lg">
          <div className="flex gap-4 text-xs text-muted-foreground font-body">
            <span>WASD / Arrows to move</span>
            <span>•</span>
            <span>Find the glowing statues</span>
          </div>
        </div>
      </div>
      
      {/* Mini compass */}
      <div className="absolute bottom-4 right-4">
        <div className="glass-panel p-3 rounded-full">
          <Compass playerX={playerPosition.x} playerZ={playerPosition.z} />
        </div>
      </div>
    </div>
  );
}

function ElementEmoji({ element, completed }: { element: string; completed: boolean }) {
  const emojis: Record<string, string> = {
    water: '💧',
    fire: '🔥',
    air: '💨',
    sky: '⚡',
    ether: '✨',
  };
  
  return (
    <span className={`text-xl ${completed ? '' : 'opacity-50 grayscale'}`}>
      {emojis[element]}
    </span>
  );
}

function Compass({ playerX, playerZ }: { playerX: number; playerZ: number }) {
  // Simple compass showing direction to center
  const angle = Math.atan2(-playerZ, -playerX) * (180 / Math.PI) + 90;
  
  return (
    <div className="w-10 h-10 relative">
      <div className="absolute inset-0 rounded-full border border-border" />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ rotate: angle }}
      >
        <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary" />
      </motion.div>
      <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
        N
      </span>
    </div>
  );
}
