import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, ElementType } from '@/store/gameStore';
import { statueClues, elementDescriptions } from '@/data/questions';

const elementStyles: Record<ElementType, { bg: string; text: string; glow: string }> = {
  water: { bg: 'bg-water/20', text: 'text-water', glow: 'glow-water' },
  fire: { bg: 'bg-fire/20', text: 'text-fire', glow: 'glow-fire' },
  air: { bg: 'bg-air/20', text: 'text-air', glow: 'glow-air' },
  sky: { bg: 'bg-sky/20', text: 'text-sky', glow: 'glow-sky' },
  ether: { bg: 'bg-ether/20', text: 'text-ether', glow: 'glow-ether' },
};

export function StatueEncounter() {
  const { gamePhase, currentStatueIndex, statueOrder } = useGameStore();
  
  if (gamePhase !== 'statue') return null;
  
  const currentElement = statueOrder[currentStatueIndex];
  const styles = elementStyles[currentElement];
  const description = elementDescriptions[currentElement];
  const clue = statueClues[currentElement];
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={`max-w-2xl mx-8 p-8 rounded-2xl ${styles.bg} border border-border/50 backdrop-blur-xl`}
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <ElementIcon element={currentElement} />
            </motion.div>
            
            <h2 className={`text-3xl md:text-4xl font-display mb-4 ${styles.text}`}>
              {description.name}
            </h2>
            
            <p className="text-lg text-muted-foreground mb-4 font-body italic">
              {description.effect}
            </p>
            
            <p className="text-sm text-muted-foreground/80 mb-8">
              {description.sound}
            </p>
            
            <div className={`p-6 rounded-lg bg-card/50 mb-8 border border-border/30`}>
              <p className={`text-xl font-body leading-relaxed ${styles.text}`}>
                "{clue.found}"
              </p>
            </div>
            
            <BeginQuestionsButton element={currentElement} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ElementIcon({ element }: { element: ElementType }) {
  const icons: Record<ElementType, string> = {
    water: '💧',
    fire: '🔥',
    air: '💨',
    sky: '⚡',
    ether: '✨',
  };
  
  return (
    <span className="text-6xl pulse-glow inline-block">
      {icons[element]}
    </span>
  );
}

function BeginQuestionsButton({ element }: { element: ElementType }) {
  const styles = elementStyles[element];
  
  return (
    <motion.button
      onClick={() => {
        useGameStore.setState({ gamePhase: 'questions' });
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`px-10 py-4 text-lg font-display rounded-lg transition-all duration-300
                  bg-primary text-primary-foreground hover:bg-primary/90
                  shadow-lg hover:shadow-xl`}
    >
      Begin the Questions
    </motion.button>
  );
}
