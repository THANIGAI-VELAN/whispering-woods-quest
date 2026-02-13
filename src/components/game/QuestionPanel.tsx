import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, ElementType } from '@/store/gameStore';
import { questions } from '@/data/questions';

const elementStyles: Record<ElementType, { bg: string; text: string; accent: string }> = {
  water: { bg: 'bg-water/10', text: 'text-water', accent: 'border-water' },
  fire: { bg: 'bg-fire/10', text: 'text-fire', accent: 'border-fire' },
  air: { bg: 'bg-air/10', text: 'text-air', accent: 'border-air' },
  earth: { bg: 'bg-earth/10', text: 'text-earth', accent: 'border-earth' },
  ether: { bg: 'bg-ether/10', text: 'text-ether', accent: 'border-ether' },
};

const ratingLabels = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree',
];

export function QuestionPanel() {
  const { 
    gamePhase, 
    currentStatueIndex, 
    statueOrder, 
    currentQuestionIndex,
    answerQuestion,
    nextQuestion,
    completeStatue,
  } = useGameStore();
  
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  if (gamePhase !== 'questions') return null;
  
  const currentElement = statueOrder[currentStatueIndex];
  const elementQuestions = questions[currentElement];
  const currentQuestion = elementQuestions[currentQuestionIndex];
  const styles = elementStyles[currentElement];
  
  const handleSubmit = () => {
    if (selectedValue === null) return;
    
    setIsTransitioning(true);
    answerQuestion(currentQuestion.id, selectedValue);
    
    setTimeout(() => {
      setSelectedValue(null);
      
      if (currentQuestionIndex < 4) {
        nextQuestion();
      } else {
        completeStatue();
      }
      
      setIsTransitioning(false);
    }, 500);
  };
  
  const progress = ((currentQuestionIndex + 1) / 5) * 100;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-background/90 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`max-w-2xl w-full mx-4 p-8 rounded-2xl glass-panel ${styles.bg}`}
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className={`text-lg font-display ${styles.text}`}>
              {currentElement.charAt(0).toUpperCase() + currentElement.slice(1)} Spirit
            </span>
            <span className="text-muted-foreground font-body">
              Question {currentQuestionIndex + 1} of 5
            </span>
          </div>
          
          <div className="h-1 bg-muted rounded-full mb-8 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r from-primary to-${currentElement}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xl md:text-2xl font-body text-foreground mb-10 leading-relaxed text-center">
                "{currentQuestion.text}"
              </p>
              
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <motion.button
                    key={value}
                    onClick={() => setSelectedValue(value)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left
                              ${selectedValue === value 
                                ? `${styles.accent} ${styles.bg} ${styles.text}` 
                                : 'border-border hover:border-muted-foreground/50'
                              }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                                      ${selectedValue === value 
                                        ? `${styles.accent} ${styles.text}` 
                                        : 'border-muted-foreground/30'
                                      }`}>
                        {selectedValue === value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4 rounded-full bg-current"
                          />
                        )}
                      </div>
                      <span className="font-body text-lg">
                        {ratingLabels[value - 1]}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          
          <motion.button
            onClick={handleSubmit}
            disabled={selectedValue === null || isTransitioning}
            whileHover={selectedValue !== null ? { scale: 1.02 } : {}}
            whileTap={selectedValue !== null ? { scale: 0.98 } : {}}
            className={`w-full mt-8 py-4 rounded-lg font-display text-lg transition-all duration-300
                       ${selectedValue !== null
                         ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg'
                         : 'bg-muted text-muted-foreground cursor-not-allowed'
                       }`}
          >
            {currentQuestionIndex < 4 ? 'Next Question' : 'Complete & Continue'}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
