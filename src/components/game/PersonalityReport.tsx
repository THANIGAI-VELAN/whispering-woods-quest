import { motion } from 'framer-motion';
import { useGameStore, ElementType } from '@/store/gameStore';
import { calculatePersonalityReport, TraitScore } from '@/utils/personalityAnalysis';

const elementStyles: Record<ElementType, { bg: string; text: string; border: string }> = {
  water: { bg: 'bg-water/10', text: 'text-water', border: 'border-water/30' },
  fire: { bg: 'bg-fire/10', text: 'text-fire', border: 'border-fire/30' },
  air: { bg: 'bg-air/10', text: 'text-air', border: 'border-air/30' },
  sky: { bg: 'bg-sky/10', text: 'text-sky', border: 'border-sky/30' },
  ether: { bg: 'bg-ether/10', text: 'text-ether', border: 'border-ether/30' },
};

const traitElements: Record<string, ElementType> = {
  'Openness': 'water',
  'Extraversion': 'fire',
  'Agreeableness': 'air',
  'Neuroticism': 'sky',
  'Conscientiousness': 'ether',
};

export function PersonalityReport() {
  const { gamePhase, statueProgress, resetGame } = useGameStore();
  
  if (gamePhase !== 'report') return null;
  
  const report = calculatePersonalityReport(statueProgress);
  
  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="min-h-screen py-12 px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl md:text-5xl font-display text-foreground mb-4 shimmer-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your Soul's Journey Revealed
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              The five elemental spirits have spoken. Here is the truth they uncovered.
            </motion.p>
          </div>
          
          {/* Summary card */}
          <motion.div
            className="glass-panel p-8 rounded-2xl mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-lg font-body text-foreground leading-relaxed text-center">
              {report.summary}
            </p>
          </motion.div>
          
          {/* Mental wellness metrics */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <MetricCard
              label="Mental Wellness"
              value={report.mentalHealthLevel}
              delay={0.7}
            />
            <MetricCard
              label="Confidence"
              value={report.confidenceLevel}
              delay={0.8}
            />
            <MetricCard
              label="Stress Resilience"
              value={report.stressResilience}
              delay={0.9}
            />
            <MetricCard
              label="Emotional Intelligence"
              value={report.emotionalIntelligence}
              delay={1.0}
            />
          </motion.div>
          
          {/* Big Five Traits */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <h2 className="text-2xl font-display text-foreground mb-6 text-center">
              The Five Elements of Your Personality
            </h2>
            
            <div className="space-y-6">
              {report.traits.map((trait, index) => (
                <TraitCard key={trait.trait} trait={trait} index={index} />
              ))}
            </div>
          </motion.div>
          
          {/* Strengths and Growth */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              className="glass-panel p-6 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 }}
            >
              <h3 className="text-xl font-display text-primary mb-4 flex items-center gap-2">
                ✨ Your Strengths
              </h3>
              <ul className="space-y-3">
                {report.strengths.map((strength, i) => (
                  <li key={i} className="text-muted-foreground font-body flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              className="glass-panel p-6 rounded-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 }}
            >
              <h3 className="text-xl font-display text-accent mb-4 flex items-center gap-2">
                🌱 Areas for Growth
              </h3>
              <ul className="space-y-3">
                {report.growthAreas.map((area, i) => (
                  <li key={i} className="text-muted-foreground font-body flex items-start gap-2">
                    <span className="text-accent mt-1">•</span>
                    {area}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          {/* Play again button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <button
              onClick={resetGame}
              className="px-12 py-4 text-xl font-display bg-primary text-primary-foreground 
                         rounded-lg hover:bg-primary/90 transition-all duration-300 
                         shadow-lg hover:shadow-primary/30 hover:scale-105"
            >
              Journey Again
            </button>
            <p className="mt-4 text-sm text-muted-foreground">
              The forest awaits those who seek deeper understanding...
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, delay }: { label: string; value: number; delay: number }) {
  const getColor = (v: number) => {
    if (v >= 70) return 'text-green-400';
    if (v >= 50) return 'text-primary';
    if (v >= 30) return 'text-yellow-400';
    return 'text-orange-400';
  };
  
  return (
    <motion.div
      className="glass-panel p-4 rounded-xl text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className={`text-3xl font-display mb-2 ${getColor(value)}`}>
        {value}%
      </div>
      <div className="text-sm text-muted-foreground font-body">
        {label}
      </div>
    </motion.div>
  );
}

function TraitCard({ trait, index }: { trait: TraitScore; index: number }) {
  const element = traitElements[trait.trait];
  const styles = elementStyles[element];
  
  const icons: Record<string, string> = {
    'Openness': '💧',
    'Extraversion': '🔥',
    'Agreeableness': '💨',
    'Neuroticism': '⚡',
    'Conscientiousness': '✨',
  };
  
  // For display, rename Neuroticism to Emotional Stability (since we reversed the score)
  const displayName = trait.trait === 'Neuroticism' ? 'Emotional Stability' : trait.trait;
  
  return (
    <motion.div
      className={`${styles.bg} ${styles.border} border rounded-xl p-6`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2 + index * 0.1 }}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icons[trait.trait]}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-xl font-display ${styles.text}`}>
              {displayName}
            </h4>
            <span className={`text-lg font-display ${styles.text}`}>
              {trait.score}%
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-muted rounded-full mb-3 overflow-hidden">
            <motion.div
              className={`h-full ${styles.bg.replace('/10', '')}`}
              style={{ backgroundColor: `hsl(var(--${element}))` }}
              initial={{ width: 0 }}
              animate={{ width: `${trait.score}%` }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.8 }}
            />
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm font-display ${styles.text}`}>
              {trait.level}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            {trait.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
