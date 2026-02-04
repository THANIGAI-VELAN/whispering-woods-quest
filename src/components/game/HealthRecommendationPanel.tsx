import { motion } from 'framer-motion';
import { PersonalityReport } from '@/utils/personalityAnalysis';
import { generateHealthRecommendations, RecommendationCategory, HealthProfessional } from '@/utils/healthRecommendations';

interface HealthRecommendationPanelProps {
  report: PersonalityReport;
}

const urgencyColors = {
  routine: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  moderate: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  urgent: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
};

const urgencyLabels = {
  routine: 'Routine Care Recommended',
  moderate: 'Moderate Priority',
  urgent: 'Priority Attention Recommended',
};

export function HealthRecommendationPanel({ report }: HealthRecommendationPanelProps) {
  const recommendations = generateHealthRecommendations(report);
  const urgencyStyle = urgencyColors[recommendations.urgencyLevel];
  
  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.0, duration: 0.8 }}
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <motion.h2
          className="text-3xl md:text-4xl font-display text-foreground mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1 }}
        >
          🩺 Professional Guidance Recommendations
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground font-body max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          Based on your assessment, here are personalized recommendations for healthcare 
          professionals who can support your mental health journey.
        </motion.p>
      </div>
      
      {/* Urgency Indicator */}
      <motion.div
        className={`${urgencyStyle.bg} ${urgencyStyle.border} border rounded-xl p-6 mb-8 text-center`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.3 }}
      >
        <div className={`text-xl font-display ${urgencyStyle.text} mb-2`}>
          {urgencyLabels[recommendations.urgencyLevel]}
        </div>
        <p className="text-muted-foreground font-body leading-relaxed">
          {recommendations.overallAssessment}
        </p>
      </motion.div>
      
      {/* Primary Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
      >
        <h3 className="text-xl font-display text-primary mb-4 flex items-center gap-2">
          ⭐ Primary Recommendation
        </h3>
        <RecommendationCategoryCard 
          category={recommendations.primaryRecommendation} 
          isPrimary 
        />
      </motion.div>
      
      {/* Secondary Recommendations */}
      {recommendations.secondaryRecommendations.length > 0 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6 }}
        >
          <h3 className="text-xl font-display text-foreground mb-4 flex items-center gap-2">
            📋 Additional Recommendations
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.secondaryRecommendations.map((category, index) => (
              <RecommendationCategoryCard 
                key={category.category} 
                category={category}
                delay={2.7 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>
      )}
      
      {/* General Advice */}
      <motion.div
        className="mt-8 glass-panel p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.0 }}
      >
        <h3 className="text-xl font-display text-accent mb-4 flex items-center gap-2">
          💡 General Wellness Advice
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {recommendations.generalAdvice.map((advice, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.1 + index * 0.05 }}
            >
              <span className="text-primary mt-0.5">✦</span>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {advice}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Disclaimer */}
      <motion.div
        className="mt-8 p-4 border border-border/50 rounded-lg bg-muted/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
      >
        <p className="text-xs text-muted-foreground font-body text-center leading-relaxed">
          <strong>Important Notice:</strong> This assessment is for informational and educational purposes only 
          and does not constitute medical advice, diagnosis, or treatment. The recommendations provided are based 
          on general psychological patterns and should not replace professional evaluation. If you are experiencing 
          a mental health crisis, please contact emergency services or a crisis helpline immediately. Always consult 
          with qualified healthcare professionals for personalized guidance regarding your mental health.
        </p>
      </motion.div>
    </motion.div>
  );
}

function RecommendationCategoryCard({ 
  category, 
  isPrimary = false,
  delay = 0 
}: { 
  category: RecommendationCategory; 
  isPrimary?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      className={`glass-panel p-6 rounded-xl ${isPrimary ? 'border-primary/30 border-2' : ''}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{category.icon}</span>
        <h4 className={`text-lg font-display ${isPrimary ? 'text-primary' : 'text-foreground'}`}>
          {category.category}
        </h4>
      </div>
      
      <p className="text-sm text-muted-foreground font-body mb-4 leading-relaxed">
        {category.reasoning}
      </p>
      
      <div className="space-y-4">
        {category.professionals.map((professional) => (
          <ProfessionalCard key={professional.type} professional={professional} />
        ))}
      </div>
    </motion.div>
  );
}

function ProfessionalCard({ professional }: { professional: HealthProfessional }) {
  const priorityColors = {
    high: 'border-l-orange-400',
    medium: 'border-l-yellow-400',
    low: 'border-l-green-400',
  };
  
  return (
    <div className={`bg-muted/30 rounded-lg p-4 border-l-4 ${priorityColors[professional.priority]}`}>
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-display text-foreground">{professional.title}</h5>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          professional.priority === 'high' 
            ? 'bg-orange-500/20 text-orange-400' 
            : professional.priority === 'medium'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-green-500/20 text-green-400'
        }`}>
          {professional.priority === 'high' ? 'Highly Recommended' : 
           professional.priority === 'medium' ? 'Recommended' : 'Optional'}
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground font-body mb-3 leading-relaxed">
        {professional.description}
      </p>
      
      <div className="bg-background/50 rounded-md p-3">
        <p className="text-xs text-muted-foreground font-body leading-relaxed">
          <span className="text-primary font-semibold">When to seek help: </span>
          {professional.whenToVisit}
        </p>
      </div>
    </div>
  );
}
