import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { nextStatueClues } from '@/data/questions';

export function ClueReveal() {
  const { gamePhase, currentStatueIndex, statueOrder, continueFromClue } = useGameStore();

  if (gamePhase !== 'clue-reveal') return null;

  const completedElement = statueOrder[currentStatueIndex];
  const clueText = nextStatueClues[completedElement];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-background/85 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-2xl w-full mx-4 p-8 rounded-2xl glass-panel"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="text-5xl mb-6"
            >
              🗝️
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-display text-primary mb-4">
              A Clue Has Been Revealed
            </h2>

            <p className="text-sm text-muted-foreground font-body mb-6">
              The {completedElement} spirit has been satisfied. It offers you guidance...
            </p>

            <motion.div
              className="p-6 rounded-xl bg-card/50 border border-primary/20 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="text-lg font-body text-foreground leading-relaxed italic">
                {clueText}
              </p>
            </motion.div>

            <motion.button
              onClick={continueFromClue}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 text-lg font-display bg-primary text-primary-foreground 
                         rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              Continue Your Journey
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
