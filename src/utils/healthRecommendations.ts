import { PersonalityReport, TraitScore } from './personalityAnalysis';

export interface HealthProfessional {
  type: string;
  title: string;
  description: string;
  whenToVisit: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RecommendationCategory {
  category: string;
  icon: string;
  professionals: HealthProfessional[];
  reasoning: string;
}

export interface HealthRecommendations {
  primaryRecommendation: RecommendationCategory;
  secondaryRecommendations: RecommendationCategory[];
  generalAdvice: string[];
  urgencyLevel: 'routine' | 'moderate' | 'urgent';
  overallAssessment: string;
}

const professionalDatabase: Record<string, HealthProfessional> = {
  psychiatrist: {
    type: 'psychiatrist',
    title: 'Psychiatrist',
    description: 'A medical doctor specializing in mental health who can diagnose mental disorders, prescribe medications, and provide comprehensive psychiatric treatment. They are trained to understand the complex relationship between emotional and physical health, and can offer both medication management and psychotherapy when needed.',
    whenToVisit: 'Consider visiting a psychiatrist if you experience severe mood swings, persistent anxiety or depression that significantly impacts daily functioning, thoughts of self-harm, or if you suspect you may benefit from medication to manage mental health symptoms.',
    priority: 'high',
  },
  clinicalPsychologist: {
    type: 'clinicalPsychologist',
    title: 'Clinical Psychologist',
    description: 'A doctoral-level mental health professional who specializes in assessing, diagnosing, and treating psychological disorders through evidence-based therapeutic approaches. They conduct psychological testing, provide psychotherapy including cognitive-behavioral therapy (CBT), and help develop coping strategies for various mental health conditions.',
    whenToVisit: 'Seek a clinical psychologist when you need comprehensive psychological assessment, therapy for complex mental health issues like trauma, personality concerns, or when you want to understand your psychological patterns through formal testing and structured therapeutic intervention.',
    priority: 'high',
  },
  counselingPsychologist: {
    type: 'counselingPsychologist',
    title: 'Counseling Psychologist',
    description: 'A mental health professional focused on helping individuals navigate life transitions, relationship issues, stress management, and emotional difficulties. They emphasize personal strengths and healthy functioning rather than pathology, making them ideal for those seeking personal growth and improved well-being.',
    whenToVisit: 'Visit a counseling psychologist when facing life transitions such as career changes, relationship difficulties, grief, or when you want to enhance your personal development, improve communication skills, or build better coping mechanisms for everyday stress.',
    priority: 'medium',
  },
  licensedTherapist: {
    type: 'licensedTherapist',
    title: 'Licensed Therapist (LMFT/LCSW)',
    description: 'Licensed mental health professionals including Marriage and Family Therapists (LMFT) and Licensed Clinical Social Workers (LCSW) who provide therapy for individuals, couples, and families. They are trained in various therapeutic modalities and can address relationship dynamics, family systems, and individual mental health concerns.',
    whenToVisit: 'Consider a licensed therapist when experiencing relationship conflicts, family communication issues, couples therapy needs, or when seeking individual therapy with a professional who understands social and relational contexts of mental health.',
    priority: 'medium',
  },
  mentalHealthCounselor: {
    type: 'mentalHealthCounselor',
    title: 'Licensed Mental Health Counselor',
    description: 'A trained professional who provides counseling services for a wide range of mental health concerns including anxiety, depression, stress, and life challenges. They offer supportive therapy, help develop coping skills, and guide clients toward healthier emotional patterns and improved quality of life.',
    whenToVisit: 'Seek a mental health counselor for general emotional support, mild to moderate anxiety or depression, stress management, adjustment issues, or when you need someone to talk to about life challenges in a structured therapeutic environment.',
    priority: 'low',
  },
  neurologist: {
    type: 'neurologist',
    title: 'Neurologist',
    description: 'A medical specialist who diagnoses and treats disorders of the nervous system including the brain, spinal cord, and nerves. They can identify neurological causes of cognitive, emotional, or behavioral symptoms and work collaboratively with mental health professionals when both neurological and psychological factors are involved.',
    whenToVisit: 'Consult a neurologist if you experience cognitive difficulties like memory problems, concentration issues, sleep disorders with potential neurological causes, headaches affecting mental clarity, or when there may be a physical brain-based component to your symptoms.',
    priority: 'medium',
  },
  sleepSpecialist: {
    type: 'sleepSpecialist',
    title: 'Sleep Medicine Specialist',
    description: 'A physician specializing in diagnosing and treating sleep disorders that significantly impact mental health and daily functioning. They understand the bidirectional relationship between sleep and mental health, conducting sleep studies and providing treatments for insomnia, sleep apnea, and circadian rhythm disorders.',
    whenToVisit: 'Visit a sleep specialist if you experience chronic insomnia, excessive daytime sleepiness, irregular sleep patterns affecting mood and cognition, suspected sleep apnea, or when poor sleep quality is contributing to anxiety, depression, or cognitive difficulties.',
    priority: 'medium',
  },
  behavioralHealthCoach: {
    type: 'behavioralHealthCoach',
    title: 'Behavioral Health Coach',
    description: 'A trained professional who helps individuals set and achieve health-related goals, build sustainable habits, and make lifestyle changes that support mental and physical well-being. They focus on motivation, accountability, and practical strategies for behavior change rather than treating clinical disorders.',
    whenToVisit: 'Consider a behavioral health coach when you want to develop healthier habits, improve work-life balance, increase motivation, build resilience, or need accountability and guidance in making positive lifestyle changes that support your mental health.',
    priority: 'low',
  },
  stressManagementSpecialist: {
    type: 'stressManagementSpecialist',
    title: 'Stress Management Specialist',
    description: 'A professional trained in techniques and interventions specifically designed to reduce stress and its negative effects on mental and physical health. They teach relaxation techniques, mindfulness practices, time management skills, and help identify and modify stress-triggering patterns.',
    whenToVisit: 'Seek a stress management specialist if you experience chronic stress affecting your health, difficulty relaxing, burnout symptoms, physical manifestations of stress like tension or fatigue, or want to learn evidence-based techniques for managing daily stressors.',
    priority: 'low',
  },
  cognitiveBehavioralSpecialist: {
    type: 'cognitiveBehavioralSpecialist',
    title: 'CBT Specialist',
    description: 'A mental health professional specially trained in Cognitive Behavioral Therapy, an evidence-based approach that helps identify and change negative thought patterns and behaviors. They work collaboratively with clients to develop practical strategies for managing anxiety, depression, and other conditions.',
    whenToVisit: 'Visit a CBT specialist when you notice recurring negative thought patterns, anxiety that disrupts daily life, depressive thinking, phobias, or when you want a structured, goal-oriented approach to therapy with proven techniques for changing unhelpful thoughts and behaviors.',
    priority: 'medium',
  },
  mindfulnessInstructor: {
    type: 'mindfulnessInstructor',
    title: 'Mindfulness-Based Therapist',
    description: 'A therapist who integrates mindfulness practices into treatment, helping clients develop present-moment awareness, emotional regulation skills, and stress reduction techniques. They may use approaches like Mindfulness-Based Stress Reduction (MBSR) or Mindfulness-Based Cognitive Therapy (MBCT).',
    whenToVisit: 'Consider mindfulness-based therapy if you want to develop greater self-awareness, reduce rumination and worry, manage chronic stress or pain, prevent depression relapse, or learn to respond to difficult emotions with greater equanimity and acceptance.',
    priority: 'low',
  },
  groupTherapyFacilitator: {
    type: 'groupTherapyFacilitator',
    title: 'Group Therapy Facilitator',
    description: 'A licensed mental health professional who leads therapeutic groups, creating a supportive environment where individuals with similar concerns can share experiences, learn from each other, and develop interpersonal skills. Group therapy offers unique benefits like social support and perspective-taking.',
    whenToVisit: 'Explore group therapy when you would benefit from peer support, want to improve social skills, feel isolated and seek connection with others facing similar challenges, or when hearing others perspectives might help normalize your experiences and provide new insights.',
    priority: 'low',
  },
  occupationalTherapist: {
    type: 'occupationalTherapist',
    title: 'Occupational Therapist',
    description: 'A healthcare professional who helps individuals develop, recover, or maintain daily living and work skills. For mental health, they focus on how psychological conditions affect daily functioning and help create structured routines, coping strategies, and environmental modifications to support well-being.',
    whenToVisit: 'Consult an occupational therapist if mental health issues are affecting your ability to perform daily activities, maintain employment, manage time effectively, or when you need practical support in structuring your day and environment to support psychological recovery.',
    priority: 'medium',
  },
  artTherapist: {
    type: 'artTherapist',
    title: 'Art Therapist',
    description: 'A licensed therapist who uses creative processes and artistic expression as therapeutic tools for emotional healing and personal growth. Art therapy can be particularly helpful for processing emotions that are difficult to verbalize, trauma recovery, and exploring the unconscious mind.',
    whenToVisit: 'Consider art therapy if you find verbal expression challenging, want to explore emotions through creative outlets, are processing trauma, or if traditional talk therapy hasnt fully addressed your needs. It is suitable for all ages and requires no artistic skill.',
    priority: 'low',
  },
  careerCounselor: {
    type: 'careerCounselor',
    title: 'Career Counselor',
    description: 'A professional who helps individuals explore career options, navigate job transitions, and find work that aligns with their values, strengths, and interests. They understand how work satisfaction impacts overall mental health and can address work-related stress, burnout, and professional identity concerns.',
    whenToVisit: 'Seek a career counselor if work-related stress is affecting your mental health, youre experiencing burnout, feeling unfulfilled in your career, facing a major job transition, or wanting to align your work with your personality strengths and core values.',
    priority: 'low',
  },
};

function analyzeTraits(traits: TraitScore[]): {
  concerns: string[];
  strengths: string[];
  patterns: string[];
} {
  const concerns: string[] = [];
  const strengths: string[] = [];
  const patterns: string[] = [];
  
  for (const trait of traits) {
    const traitName = trait.trait.toLowerCase();
    
    // Analyze each trait for concerns and strengths
    if (trait.score < 30) {
      if (traitName === 'openness') {
        concerns.push('Limited openness may indicate rigid thinking patterns or avoidance of new experiences that could impact personal growth and adaptability to change.');
        patterns.push('Preference for routine and familiar situations may limit exposure to growth opportunities and diverse perspectives.');
      } else if (traitName === 'extraversion') {
        concerns.push('Low extraversion suggests potential social withdrawal or isolation that could benefit from gradual exposure to supportive social environments.');
        patterns.push('Tendency toward solitude may indicate either healthy introversion or social anxiety that warrants further exploration with a professional.');
      } else if (traitName === 'agreeableness') {
        concerns.push('Lower agreeableness may indicate interpersonal difficulties, trust issues, or challenges in maintaining harmonious relationships with others.');
        patterns.push('Skeptical or competitive tendencies may protect against exploitation but could also create barriers to forming close, trusting relationships.');
      } else if (traitName === 'neuroticism') {
        strengths.push('Exceptional emotional stability indicates strong resilience to stress and ability to remain calm under pressure.');
        patterns.push('High emotional regulation suggests well-developed coping mechanisms and psychological resilience.');
      } else if (traitName === 'conscientiousness') {
        concerns.push('Low conscientiousness may manifest as difficulty with organization, goal-setting, or follow-through that could impact daily functioning and achievement.');
        patterns.push('Preference for spontaneity and flexibility may sometimes conflict with responsibilities and long-term goal achievement.');
      }
    } else if (trait.score >= 70) {
      if (traitName === 'openness') {
        strengths.push('High openness indicates creativity, intellectual curiosity, and adaptability to new situations and experiences.');
      } else if (traitName === 'extraversion') {
        strengths.push('Strong extraversion suggests social confidence, assertiveness, and ability to draw energy from interpersonal interactions.');
      } else if (traitName === 'agreeableness') {
        strengths.push('High agreeableness reflects strong empathy, cooperation skills, and ability to maintain positive relationships with others.');
      } else if (traitName === 'neuroticism') {
        concerns.push('Elevated emotional sensitivity may indicate vulnerability to stress, anxiety, or mood fluctuations that could benefit from professional support.');
        patterns.push('Heightened emotional reactivity may signal the need for developing stronger coping strategies and emotional regulation skills.');
      } else if (traitName === 'conscientiousness') {
        strengths.push('High conscientiousness demonstrates excellent self-discipline, reliability, and ability to work toward long-term goals effectively.');
      }
    }
  }
  
  return { concerns, strengths, patterns };
}

function determineUrgency(
  mentalHealth: number,
  emotionalStability: number,
  concerns: string[]
): 'routine' | 'moderate' | 'urgent' {
  if (mentalHealth < 30 || emotionalStability < 25) {
    return 'urgent';
  }
  if (mentalHealth < 50 || emotionalStability < 40 || concerns.length >= 3) {
    return 'moderate';
  }
  return 'routine';
}

function selectProfessionals(
  report: PersonalityReport,
  analysis: ReturnType<typeof analyzeTraits>,
  urgency: 'routine' | 'moderate' | 'urgent'
): RecommendationCategory[] {
  const categories: RecommendationCategory[] = [];
  
  const emotionalStability = report.traits.find(t => t.trait === 'Neuroticism')?.score || 50;
  const extraversion = report.traits.find(t => t.trait === 'Extraversion')?.score || 50;
  const openness = report.traits.find(t => t.trait === 'Openness')?.score || 50;
  const agreeableness = report.traits.find(t => t.trait === 'Agreeableness')?.score || 50;
  const conscientiousness = report.traits.find(t => t.trait === 'Conscientiousness')?.score || 50;
  
  // Primary mental health support based on severity
  if (urgency === 'urgent' || report.mentalHealthLevel < 40) {
    categories.push({
      category: 'Comprehensive Mental Health Care',
      icon: '🏥',
      professionals: [
        professionalDatabase.psychiatrist,
        professionalDatabase.clinicalPsychologist,
      ],
      reasoning: 'Your assessment indicates significant emotional challenges that would benefit from comprehensive evaluation by mental health specialists who can provide thorough assessment, accurate diagnosis, and develop an integrated treatment plan combining therapeutic and medical approaches as needed.',
    });
  }
  
  // Emotional regulation support
  if (emotionalStability < 40) {
    categories.push({
      category: 'Emotional Regulation Support',
      icon: '🧠',
      professionals: [
        professionalDatabase.cognitiveBehavioralSpecialist,
        professionalDatabase.mindfulnessInstructor,
      ],
      reasoning: 'Your responses suggest heightened emotional sensitivity that could benefit from specialized therapeutic approaches focused on developing emotional regulation skills, identifying thought patterns that contribute to distress, and building practical coping strategies.',
    });
  }
  
  // Social connection and relationship support
  if (extraversion < 35 || agreeableness < 35) {
    categories.push({
      category: 'Social and Relationship Support',
      icon: '👥',
      professionals: [
        professionalDatabase.licensedTherapist,
        professionalDatabase.groupTherapyFacilitator,
      ],
      reasoning: 'Your personality profile suggests potential benefits from exploring interpersonal dynamics, building social skills, or addressing patterns that may affect your relationships. Therapists specializing in relational approaches can help navigate these areas.',
    });
  }
  
  // Stress and lifestyle management
  if (report.stressResilience < 50) {
    categories.push({
      category: 'Stress Management and Resilience',
      icon: '🌿',
      professionals: [
        professionalDatabase.stressManagementSpecialist,
        professionalDatabase.behavioralHealthCoach,
      ],
      reasoning: 'Your stress resilience scores indicate that developing stronger stress management techniques and building sustainable healthy habits could significantly improve your overall well-being and ability to handle life challenges.',
    });
  }
  
  // Cognitive and functional concerns
  if (conscientiousness < 40 || openness < 30) {
    categories.push({
      category: 'Cognitive and Functional Support',
      icon: '📋',
      professionals: [
        professionalDatabase.occupationalTherapist,
        professionalDatabase.counselingPsychologist,
      ],
      reasoning: 'Your assessment suggests potential areas for growth in organization, planning, or adapting to new situations. These professionals can help develop practical strategies for improving daily functioning and exploring personal development.',
    });
  }
  
  // Sleep and neurological considerations
  if (report.mentalHealthLevel < 45 && report.stressResilience < 45) {
    categories.push({
      category: 'Physical Health Considerations',
      icon: '💤',
      professionals: [
        professionalDatabase.sleepSpecialist,
        professionalDatabase.neurologist,
      ],
      reasoning: 'When mental health and stress resilience are both impacted, it is important to consider physical factors like sleep quality and neurological health that can significantly affect psychological well-being and cognitive function.',
    });
  }
  
  // Creative and alternative approaches
  if (urgency === 'routine' && openness >= 50) {
    categories.push({
      category: 'Creative and Holistic Approaches',
      icon: '🎨',
      professionals: [
        professionalDatabase.artTherapist,
        professionalDatabase.mindfulnessInstructor,
      ],
      reasoning: 'Your openness to new experiences suggests you may benefit from and engage well with creative therapeutic approaches that allow for self-expression and exploration beyond traditional talk therapy.',
    });
  }
  
  // Career and purpose alignment
  if (report.confidenceLevel < 45) {
    categories.push({
      category: 'Purpose and Self-Development',
      icon: '🎯',
      professionals: [
        professionalDatabase.careerCounselor,
        professionalDatabase.counselingPsychologist,
      ],
      reasoning: 'Lower confidence levels may be connected to questions about purpose, direction, or alignment between your values and daily life. Exploring these areas can lead to greater self-assurance and life satisfaction.',
    });
  }
  
  // General counseling for moderate concerns
  if (categories.length === 0 || urgency === 'routine') {
    categories.push({
      category: 'General Mental Wellness Support',
      icon: '💚',
      professionals: [
        professionalDatabase.mentalHealthCounselor,
        professionalDatabase.behavioralHealthCoach,
      ],
      reasoning: 'Proactive mental health support can help maintain psychological well-being, build resilience, and address minor concerns before they develop into larger issues. Regular check-ins with a mental health professional benefit everyone.',
    });
  }
  
  return categories;
}

function generateGeneralAdvice(
  report: PersonalityReport,
  urgency: 'routine' | 'moderate' | 'urgent'
): string[] {
  const advice: string[] = [];
  
  // Universal advice
  advice.push('Maintain consistent sleep habits by going to bed and waking up at regular times, as quality sleep is foundational to mental health and emotional regulation.');
  
  advice.push('Engage in regular physical activity that you enjoy, as exercise has been consistently shown to reduce anxiety and depression while improving overall mood and cognitive function.');
  
  if (report.emotionalIntelligence < 50) {
    advice.push('Practice identifying and naming your emotions throughout the day, as developing emotional awareness is the first step toward better emotional regulation and interpersonal understanding.');
  }
  
  if (report.stressResilience < 50) {
    advice.push('Incorporate daily stress-reduction practices such as deep breathing exercises, progressive muscle relaxation, or brief mindfulness sessions to build your capacity for managing stressful situations.');
  }
  
  if (report.confidenceLevel < 50) {
    advice.push('Keep a daily record of small accomplishments and positive experiences to build self-efficacy and counteract negative self-perceptions over time.');
  }
  
  // Urgency-specific advice
  if (urgency === 'urgent') {
    advice.push('Please prioritize scheduling an appointment with a mental health professional soon, as addressing significant concerns early leads to better outcomes and prevents escalation.');
  } else if (urgency === 'moderate') {
    advice.push('Consider reaching out to a mental health professional within the next few weeks to discuss your assessment results and explore supportive strategies.');
  }
  
  advice.push('Build and maintain social connections, even if brief, as social support is one of the strongest protective factors for mental health across all personality types.');
  
  advice.push('Limit exposure to negative news and social media when feeling overwhelmed, and instead engage in activities that bring you genuine enjoyment and relaxation.');
  
  return advice;
}

export function generateHealthRecommendations(
  report: PersonalityReport
): HealthRecommendations {
  const analysis = analyzeTraits(report.traits);
  const urgency = determineUrgency(
    report.mentalHealthLevel,
    report.traits.find(t => t.trait === 'Neuroticism')?.score || 50,
    analysis.concerns
  );
  
  const allCategories = selectProfessionals(report, analysis, urgency);
  const primaryRecommendation = allCategories[0];
  const secondaryRecommendations = allCategories.slice(1, 4);
  
  const generalAdvice = generateGeneralAdvice(report, urgency);
  
  // Generate overall assessment
  let overallAssessment = '';
  
  if (urgency === 'urgent') {
    overallAssessment = 'Your assessment results indicate significant areas of concern that warrant prompt attention from qualified mental health professionals. The patterns identified in your responses suggest you would benefit greatly from comprehensive support to address emotional challenges and develop effective coping strategies. Seeking help is a sign of strength and self-awareness.';
  } else if (urgency === 'moderate') {
    overallAssessment = 'Your assessment reveals a mix of strengths and areas that could benefit from professional guidance. While you demonstrate resilience in some domains, there are patterns suggesting that targeted support could enhance your well-being and help you develop additional tools for managing life challenges effectively.';
  } else {
    overallAssessment = 'Your assessment indicates generally healthy psychological functioning with opportunities for growth and enhancement. Engaging with mental health resources proactively can help maintain your well-being, build additional resilience, and optimize your personal and professional life satisfaction.';
  }
  
  return {
    primaryRecommendation,
    secondaryRecommendations,
    generalAdvice,
    urgencyLevel: urgency,
    overallAssessment,
  };
}
