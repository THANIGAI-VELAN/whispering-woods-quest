import { ElementType, StatueProgress } from '@/store/gameStore';
import { questions } from '@/data/questions';

export interface TraitScore {
  trait: string;
  element: ElementType;
  score: number; // 0-100
  level: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
  description: string;
}

export interface PersonalityReport {
  traits: TraitScore[];
  mentalHealthLevel: number;
  confidenceLevel: number;
  stressResilience: number;
  emotionalIntelligence: number;
  summary: string;
  strengths: string[];
  growthAreas: string[];
}

const traitDescriptions: Record<string, Record<string, string>> = {
  openness: {
    'Very Low': 'You prefer practical, conventional approaches and find comfort in familiar routines. You value tradition and concrete thinking.',
    'Low': 'You tend toward practical solutions and appreciate stability. While open to some new ideas, you prefer proven methods.',
    'Moderate': 'You balance creativity with practicality. You can appreciate both new ideas and traditional approaches.',
    'High': 'You are curious and imaginative, drawn to new experiences and creative expression. You think abstractly and value innovation.',
    'Very High': 'You are exceptionally creative and open-minded, constantly seeking novel experiences and ideas. Your imagination knows few bounds.',
  },
  extraversion: {
    'Very Low': 'You are deeply introspective and find energy in solitude. You prefer meaningful one-on-one connections over large gatherings.',
    'Low': 'You lean toward introversion, preferring quiet environments and smaller social circles. You think before you speak.',
    'Moderate': 'You can adapt to both social and solitary situations. You enjoy company but also value your alone time.',
    'High': 'You are energized by social interaction and enjoy being around others. You express yourself openly and confidently.',
    'Very High': 'You thrive in social settings and naturally draw energy from others. You are enthusiastic, talkative, and assertive.',
  },
  agreeableness: {
    'Very Low': 'You are highly independent and prioritize self-interest. You tend to be skeptical and competitive.',
    'Low': 'You are somewhat guarded and prefer to maintain boundaries. You value independence over harmony at times.',
    'Moderate': 'You balance cooperation with self-interest. You can be both collaborative and assertive as needed.',
    'High': 'You are compassionate and cooperative, valuing harmony in relationships. You tend to trust others easily.',
    'Very High': 'You are exceptionally empathetic and altruistic, putting others\' needs first. You are trusting and forgiving.',
  },
  neuroticism: {
    'Very Low': 'You are remarkably emotionally stable and resilient. Stress rarely affects your calm demeanor.',
    'Low': 'You handle stress well and maintain emotional balance. You recover quickly from setbacks.',
    'Moderate': 'You experience normal emotional fluctuations. You manage stress reasonably well most of the time.',
    'High': 'You are emotionally sensitive and may experience mood swings. Stress can significantly impact your well-being.',
    'Very High': 'You experience intense emotions and may struggle with anxiety or stress. You are highly sensitive to your environment.',
  },
  conscientiousness: {
    'Very Low': 'You are spontaneous and flexible, preferring to go with the flow. Structure and planning feel restrictive.',
    'Low': 'You are somewhat relaxed about organization and deadlines. You value flexibility over rigid structure.',
    'Moderate': 'You can be organized when needed but also appreciate flexibility. You balance responsibility with spontaneity.',
    'High': 'You are organized, reliable, and goal-oriented. You take your commitments seriously and plan ahead.',
    'Very High': 'You are exceptionally disciplined and methodical. You set high standards and consistently meet them.',
  },
};

const elementToTrait: Record<ElementType, string> = {
  water: 'openness',
  fire: 'extraversion',
  air: 'agreeableness',
  earth: 'neuroticism',
  ether: 'conscientiousness',
};

function getLevel(score: number): 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High' {
  if (score < 20) return 'Very Low';
  if (score < 40) return 'Low';
  if (score < 60) return 'Moderate';
  if (score < 80) return 'High';
  return 'Very High';
}

export function calculatePersonalityReport(
  statueProgress: Record<ElementType, StatueProgress>
): PersonalityReport {
  const traits: TraitScore[] = [];
  
  for (const element of Object.keys(statueProgress) as ElementType[]) {
    const progress = statueProgress[element];
    const trait = elementToTrait[element];
    
    let totalScore = 0;
    const answers = progress.questionsAnswered;
    
    if (answers.length > 0) {
      for (const answer of answers) {
        if (trait === 'neuroticism') {
          totalScore += (6 - answer.value);
        } else {
          totalScore += answer.value;
        }
      }
      totalScore = ((totalScore / answers.length) - 1) * 25;
    }
    
    const level = getLevel(totalScore);
    
    traits.push({
      trait: trait.charAt(0).toUpperCase() + trait.slice(1),
      element,
      score: Math.round(totalScore),
      level,
      description: traitDescriptions[trait][level],
    });
  }
  
  const openness = traits.find(t => t.trait === 'Openness')?.score || 50;
  const extraversion = traits.find(t => t.trait === 'Extraversion')?.score || 50;
  const agreeableness = traits.find(t => t.trait === 'Agreeableness')?.score || 50;
  const emotionalStability = traits.find(t => t.trait === 'Neuroticism')?.score || 50;
  const conscientiousness = traits.find(t => t.trait === 'Conscientiousness')?.score || 50;
  
  const mentalHealthLevel = Math.round(
    (emotionalStability * 0.35) + (agreeableness * 0.25) + (conscientiousness * 0.20) + (extraversion * 0.10) + (openness * 0.10)
  );
  
  const confidenceLevel = Math.round(
    (extraversion * 0.45) + (emotionalStability * 0.35) + (conscientiousness * 0.20)
  );
  
  const stressResilience = Math.round(
    (emotionalStability * 0.50) + (conscientiousness * 0.30) + (openness * 0.20)
  );
  
  const emotionalIntelligence = Math.round(
    (agreeableness * 0.40) + (openness * 0.30) + (emotionalStability * 0.20) + (extraversion * 0.10)
  );
  
  const strengths: string[] = [];
  const growthAreas: string[] = [];
  
  for (const trait of traits) {
    if (trait.score >= 70) {
      strengths.push(getStrength(trait.trait, trait.score));
    } else if (trait.score <= 30) {
      growthAreas.push(getGrowthArea(trait.trait, trait.score));
    }
  }
  
  if (strengths.length === 0) {
    const highestTrait = traits.reduce((a, b) => a.score > b.score ? a : b);
    strengths.push(getStrength(highestTrait.trait, highestTrait.score));
  }
  
  if (growthAreas.length === 0) {
    const lowestTrait = traits.reduce((a, b) => a.score < b.score ? a : b);
    growthAreas.push(getGrowthArea(lowestTrait.trait, lowestTrait.score));
  }
  
  const summary = generateSummary(traits, mentalHealthLevel, confidenceLevel);
  
  return {
    traits,
    mentalHealthLevel,
    confidenceLevel,
    stressResilience,
    emotionalIntelligence,
    summary,
    strengths,
    growthAreas,
  };
}

function getStrength(trait: string, score: number): string {
  const strengths: Record<string, string> = {
    'Openness': 'Your creative mind and curiosity drive innovation and fresh perspectives.',
    'Extraversion': 'Your social energy inspires others and builds strong connections.',
    'Agreeableness': 'Your compassion and empathy create harmonious relationships.',
    'Neuroticism': 'Your emotional stability provides a calm anchor in turbulent times.',
    'Conscientiousness': 'Your discipline and organization lead to consistent achievement.',
  };
  return strengths[trait] || 'You have notable strengths in this area.';
}

function getGrowthArea(trait: string, score: number): string {
  const areas: Record<string, string> = {
    'Openness': 'Consider exploring new experiences and perspectives to expand your horizons.',
    'Extraversion': 'Building social connections gradually could enhance your support network.',
    'Agreeableness': 'Practicing empathy and trust could deepen your relationships.',
    'Neuroticism': 'Developing emotional regulation strategies could increase your resilience.',
    'Conscientiousness': 'Setting small, achievable goals could help build structure.',
  };
  return areas[trait] || 'This is an area with potential for growth.';
}

function generateSummary(
  traits: TraitScore[],
  mentalHealth: number,
  confidence: number
): string {
  const highTraits = traits.filter(t => t.score >= 60);
  const traitNames = highTraits.map(t => t.trait.toLowerCase());
  
  let summary = 'Your journey through the enchanted forest has revealed a unique personality profile. ';
  
  if (mentalHealth >= 70) {
    summary += 'You demonstrate strong mental wellness and emotional balance. ';
  } else if (mentalHealth >= 50) {
    summary += 'Your emotional landscape shows healthy balance with room for growth. ';
  } else {
    summary += 'Your answers suggest you may benefit from focusing on emotional well-being. ';
  }
  
  if (confidence >= 70) {
    summary += 'You carry yourself with notable confidence and self-assurance. ';
  } else if (confidence >= 50) {
    summary += 'Your confidence level is healthy and can continue to grow. ';
  }
  
  if (traitNames.length > 0) {
    summary += `Your personality particularly shines in ${traitNames.slice(0, 2).join(' and ')}.`;
  }
  
  return summary;
}
