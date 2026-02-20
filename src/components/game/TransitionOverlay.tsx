import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function TransitionOverlay() {
  const { gamePhase, transitionType, enterWorld } = useGameStore();
  const [progress, setProgress] = useState(0);

  const isActive = gamePhase === 'transition' && transitionType != null;

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const duration = transitionType === 'diving' ? 3500 : 4000;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p >= 1) {
        clearInterval(interval);
        if (transitionType === 'diving') {
          enterWorld('exploring_underwater');
        } else if (transitionType === 'rubbing_stones') {
          enterWorld('exploring_madurai');
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isActive, transitionType, enterWorld]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {transitionType === 'diving' && <DivingTransition progress={progress} />}
        {transitionType === 'rubbing_stones' && <RubbingStonesTransition progress={progress} />}
      </motion.div>
    </AnimatePresence>
  );
}

function DivingTransition({ progress }: { progress: number }) {
  return (
    <div className="relative w-full h-full">
      {/* Darkening ocean gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, 
            hsl(210 ${30 + progress * 30}% ${15 - progress * 10}%) 0%, 
            hsl(220 ${40 + progress * 20}% ${8 - progress * 5}%) 50%, 
            hsl(230 60% ${4}%) 100%)`,
        }}
      />

      {/* Rising bubbles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-water/30"
          style={{
            width: `${4 + Math.random() * 10}px`,
            height: `${4 + Math.random() * 10}px`,
            left: `${Math.random() * 100}%`,
            background: `hsl(200 80% 55% / 0.1)`,
          }}
          initial={{ bottom: `${Math.random() * 30}%`, opacity: 0 }}
          animate={{
            bottom: '110%',
            opacity: [0, 0.6, 0],
            x: [0, Math.random() * 30 - 15, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Central text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <motion.p
          className="text-2xl md:text-3xl font-display text-water"
          style={{ textShadow: '0 0 30px hsl(200 80% 55% / 0.6)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Descending into the depths...
        </motion.p>
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-water/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-water rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function RubbingStonesTransition({ progress }: { progress: number }) {
  return (
    <div className="relative w-full h-full">
      {/* Dark to fire gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, 
            hsl(160 20% ${6 - progress * 4}%) 0%, 
            hsl(${20 + progress * 15} ${30 + progress * 50}% ${8 + progress * 10}%) 50%, 
            hsl(${15 + progress * 10} ${40 + progress * 40}% ${6 + progress * 8}%) 100%)`,
        }}
      />

      {/* Sparks from center */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            background: `hsl(${30 + Math.random() * 20} 100% ${60 + Math.random() * 30}%)`,
            boxShadow: `0 0 4px hsl(35 100% 60%)`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 200],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.4,
            repeat: Infinity,
            delay: Math.random() * 1.5,
            repeatDelay: Math.random() * 1,
          }}
        />
      ))}

      {/* Stones shaking */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 0.15, repeat: Infinity }}
      >
        <div className="w-14 h-9 rounded bg-muted border border-border" />
      </motion.div>

      {/* Fire flash at end */}
      {progress > 0.7 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: (progress - 0.7) / 0.3 * 0.5 }}
          style={{ background: 'radial-gradient(circle, hsl(35 100% 60% / 0.4), transparent 60%)' }}
        />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 mt-20">
        <motion.p
          className="text-2xl md:text-3xl font-display text-fire"
          style={{ textShadow: '0 0 30px hsl(25 95% 55% / 0.6)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Rubbing the ancient stones...
        </motion.p>
        
        <div className="w-48 h-1 bg-fire/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-fire rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
