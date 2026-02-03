import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function IntroScreen() {
  const { startGame, gamePhase } = useGameStore();
  
  if (gamePhase !== 'intro') return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center mystical-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center max-w-2xl px-8">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display text-foreground mb-6 shimmer-text">
              The Enchanted Forest
            </h1>
          </motion.div>
          
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground font-body mb-8 leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            You have wandered into an ancient forest, bound by mystical forces. 
            Five elemental statues hold the key to your escape. 
            Each will ask questions that reveal the depths of your soul...
          </motion.p>
          
          <motion.div
            className="space-y-4 text-muted-foreground mb-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <p className="text-lg font-body italic">
              Find the statues. Answer truthfully. Discover yourself.
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <span className="text-water">💧 Water</span>
              <span className="text-fire">🔥 Fire</span>
              <span className="text-air">💨 Air</span>
              <span className="text-sky">⚡ Sky</span>
              <span className="text-ether">✨ Ether</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <button
              onClick={startGame}
              className="px-12 py-4 text-xl font-display bg-primary text-primary-foreground rounded-lg 
                         hover:bg-primary/90 transition-all duration-300 
                         shadow-lg hover:shadow-primary/30 hover:scale-105"
            >
              Enter the Forest
            </button>
          </motion.div>
          
          <motion.p
            className="mt-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            Use WASD or Arrow keys to move • Find the glowing statues
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
