import { ElementType } from '@/store/gameStore';

export interface Question {
  id: string;
  text: string;
  element: ElementType;
  trait: string; // OCEAN trait
  reversed?: boolean; // Some questions are reverse-scored
}

// Big Five (OCEAN) Traits mapped to elements:
// Water → Openness (flowing, creative, curious)
// Fire → Extraversion (energetic, passionate, social)
// Air → Agreeableness (gentle, harmonious, cooperative)
// Sky → Neuroticism (emotional depth, sensitivity) - reverse scored for stability
// Ether → Conscientiousness (structured, purposeful, disciplined)

export const questions: Record<ElementType, Question[]> = {
  water: [
    {
      id: 'water_1',
      text: 'I often find myself lost in my imagination, creating vivid inner worlds.',
      element: 'water',
      trait: 'openness',
    },
    {
      id: 'water_2',
      text: 'I am deeply moved by art, music, or natural beauty.',
      element: 'water',
      trait: 'openness',
    },
    {
      id: 'water_3',
      text: 'I enjoy exploring new ideas and unconventional perspectives.',
      element: 'water',
      trait: 'openness',
    },
    {
      id: 'water_4',
      text: 'I prefer variety and new experiences over familiar routines.',
      element: 'water',
      trait: 'openness',
    },
    {
      id: 'water_5',
      text: 'I often question traditional ways of doing things.',
      element: 'water',
      trait: 'openness',
    },
  ],
  fire: [
    {
      id: 'fire_1',
      text: 'I feel energized when surrounded by other people.',
      element: 'fire',
      trait: 'extraversion',
    },
    {
      id: 'fire_2',
      text: 'I often take charge in group situations.',
      element: 'fire',
      trait: 'extraversion',
    },
    {
      id: 'fire_3',
      text: 'I enjoy being the center of attention.',
      element: 'fire',
      trait: 'extraversion',
    },
    {
      id: 'fire_4',
      text: 'I start conversations with strangers easily.',
      element: 'fire',
      trait: 'extraversion',
    },
    {
      id: 'fire_5',
      text: 'I feel excited and enthusiastic most of the time.',
      element: 'fire',
      trait: 'extraversion',
    },
  ],
  air: [
    {
      id: 'air_1',
      text: 'I naturally consider others\' feelings before making decisions.',
      element: 'air',
      trait: 'agreeableness',
    },
    {
      id: 'air_2',
      text: 'I find it easy to forgive others who have wronged me.',
      element: 'air',
      trait: 'agreeableness',
    },
    {
      id: 'air_3',
      text: 'I prefer cooperation over competition.',
      element: 'air',
      trait: 'agreeableness',
    },
    {
      id: 'air_4',
      text: 'I trust others easily and give them the benefit of the doubt.',
      element: 'air',
      trait: 'agreeableness',
    },
    {
      id: 'air_5',
      text: 'I go out of my way to help others, even at personal cost.',
      element: 'air',
      trait: 'agreeableness',
    },
  ],
  sky: [
    {
      id: 'sky_1',
      text: 'I often feel overwhelmed by my emotions.',
      element: 'sky',
      trait: 'neuroticism',
    },
    {
      id: 'sky_2',
      text: 'I worry about things more than most people.',
      element: 'sky',
      trait: 'neuroticism',
    },
    {
      id: 'sky_3',
      text: 'My mood can change quickly and unexpectedly.',
      element: 'sky',
      trait: 'neuroticism',
    },
    {
      id: 'sky_4',
      text: 'I often replay past mistakes in my mind.',
      element: 'sky',
      trait: 'neuroticism',
    },
    {
      id: 'sky_5',
      text: 'I feel stressed or anxious in uncertain situations.',
      element: 'sky',
      trait: 'neuroticism',
    },
  ],
  ether: [
    {
      id: 'ether_1',
      text: 'I always follow through on my commitments.',
      element: 'ether',
      trait: 'conscientiousness',
    },
    {
      id: 'ether_2',
      text: 'I plan my tasks carefully and stick to schedules.',
      element: 'ether',
      trait: 'conscientiousness',
    },
    {
      id: 'ether_3',
      text: 'I pay attention to details and strive for accuracy.',
      element: 'ether',
      trait: 'conscientiousness',
    },
    {
      id: 'ether_4',
      text: 'I set clear goals and work systematically toward them.',
      element: 'ether',
      trait: 'conscientiousness',
    },
    {
      id: 'ether_5',
      text: 'I prefer order and organization in my life.',
      element: 'ether',
      trait: 'conscientiousness',
    },
  ],
};

export const statueClues: Record<ElementType, { approaching: string; found: string }> = {
  water: {
    approaching: 'Listen... the sound of flowing water calls to you from the east. Where creativity flows, the first truth awaits.',
    found: 'The Water Spirit speaks: "I am the river of your imagination. Answer my questions, and I shall reveal the depths of your creative soul."',
  },
  fire: {
    approaching: 'A warm glow flickers through the ancient trees to the north. The flames of passion beckon...',
    found: 'The Fire Spirit speaks: "I am the flame within your heart. Tell me of your passion, and I shall illuminate your social spirit."',
  },
  air: {
    approaching: 'A gentle breeze carries whispers from the western grove. The breath of harmony guides your path...',
    found: 'The Air Spirit speaks: "I am the gentle wind of connection. Share your truth, and I shall reveal your capacity for compassion."',
  },
  sky: {
    approaching: 'Thunder rumbles in the distance, where the tallest trees touch the clouds. The storm holds wisdom...',
    found: 'The Sky Spirit speaks: "I am the storm of your emotions. Face your inner tempest, and I shall show you the landscape of your feelings."',
  },
  ether: {
    approaching: 'An otherworldly hum resonates from the heart of the forest. The infinite awaits at the sacred center...',
    found: 'The Ether Spirit speaks: "I am the infinite space of purpose. Reveal your discipline, and I shall unlock the final truth of your being."',
  },
};

export const elementDescriptions: Record<ElementType, { name: string; effect: string; sound: string }> = {
  water: {
    name: 'Statue of Water',
    effect: 'Cascading waterfalls flow eternally from the ancient stone',
    sound: 'The soothing sound of flowing water fills the air',
  },
  fire: {
    name: 'Statue of Fire',
    effect: 'Brilliant flames dance and flicker with eternal energy',
    sound: 'The crackling roar of flames echoes through the trees',
  },
  air: {
    name: 'Statue of Air',
    effect: 'Gentle breezes swirl with visible wisps of wind',
    sound: 'Soft whispers of wind carry ancient secrets',
  },
  sky: {
    name: 'Statue of Sky',
    effect: 'Storm clouds gather and lightning crackles overhead',
    sound: 'Deep thunder rolls across the heavens',
  },
  ether: {
    name: 'Statue of Ether',
    effect: 'Infinite space and cosmic energy radiate outward',
    sound: 'A deep cosmic OM resonates through existence',
  },
};
