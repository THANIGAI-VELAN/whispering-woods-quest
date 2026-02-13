import { ElementType } from '@/store/gameStore';

export interface Question {
  id: string;
  text: string;
  element: ElementType;
  trait: string; // OCEAN trait
  reversed?: boolean;
}

// Big Five (OCEAN) Traits mapped to elements:
// Water → Openness (flowing, creative, curious)
// Fire → Extraversion (energetic, passionate, social)
// Air → Agreeableness (gentle, harmonious, cooperative)
// Earth → Neuroticism (grounded, emotional depth, sensitivity) - reverse scored for stability
// Ether → Conscientiousness (structured, purposeful, disciplined)

export const questions: Record<ElementType, Question[]> = {
  water: [
    { id: 'water_1', text: 'I often find myself lost in my imagination, creating vivid inner worlds.', element: 'water', trait: 'openness' },
    { id: 'water_2', text: 'I am deeply moved by art, music, or natural beauty.', element: 'water', trait: 'openness' },
    { id: 'water_3', text: 'I enjoy exploring new ideas and unconventional perspectives.', element: 'water', trait: 'openness' },
    { id: 'water_4', text: 'I prefer variety and new experiences over familiar routines.', element: 'water', trait: 'openness' },
    { id: 'water_5', text: 'I often question traditional ways of doing things.', element: 'water', trait: 'openness' },
  ],
  fire: [
    { id: 'fire_1', text: 'I feel energized when surrounded by other people.', element: 'fire', trait: 'extraversion' },
    { id: 'fire_2', text: 'I often take charge in group situations.', element: 'fire', trait: 'extraversion' },
    { id: 'fire_3', text: 'I enjoy being the center of attention.', element: 'fire', trait: 'extraversion' },
    { id: 'fire_4', text: 'I start conversations with strangers easily.', element: 'fire', trait: 'extraversion' },
    { id: 'fire_5', text: 'I feel excited and enthusiastic most of the time.', element: 'fire', trait: 'extraversion' },
  ],
  air: [
    { id: 'air_1', text: 'I naturally consider others\' feelings before making decisions.', element: 'air', trait: 'agreeableness' },
    { id: 'air_2', text: 'I find it easy to forgive others who have wronged me.', element: 'air', trait: 'agreeableness' },
    { id: 'air_3', text: 'I prefer cooperation over competition.', element: 'air', trait: 'agreeableness' },
    { id: 'air_4', text: 'I trust others easily and give them the benefit of the doubt.', element: 'air', trait: 'agreeableness' },
    { id: 'air_5', text: 'I go out of my way to help others, even at personal cost.', element: 'air', trait: 'agreeableness' },
  ],
  earth: [
    { id: 'earth_1', text: 'I often feel overwhelmed by my emotions.', element: 'earth', trait: 'neuroticism' },
    { id: 'earth_2', text: 'I worry about things more than most people.', element: 'earth', trait: 'neuroticism' },
    { id: 'earth_3', text: 'My mood can change quickly and unexpectedly.', element: 'earth', trait: 'neuroticism' },
    { id: 'earth_4', text: 'I often replay past mistakes in my mind.', element: 'earth', trait: 'neuroticism' },
    { id: 'earth_5', text: 'I feel stressed or anxious in uncertain situations.', element: 'earth', trait: 'neuroticism' },
  ],
  ether: [
    { id: 'ether_1', text: 'I always follow through on my commitments.', element: 'ether', trait: 'conscientiousness' },
    { id: 'ether_2', text: 'I plan my tasks carefully and stick to schedules.', element: 'ether', trait: 'conscientiousness' },
    { id: 'ether_3', text: 'I pay attention to details and strive for accuracy.', element: 'ether', trait: 'conscientiousness' },
    { id: 'ether_4', text: 'I set clear goals and work systematically toward them.', element: 'ether', trait: 'conscientiousness' },
    { id: 'ether_5', text: 'I prefer order and organization in my life.', element: 'ether', trait: 'conscientiousness' },
  ],
};

// Storyline riddles to find each statue
export const statueRiddles: Record<ElementType, string> = {
  water: 'Every creature in this forest must drink to survive. Follow the trail where animals gather, where roots run deep toward moisture. The source of all life flows somewhere to the east...',
  fire: 'Where there is life, there is warmth. Look for the scorched earth, the place where lightning once struck and left its mark. The creatures here fear it, yet the forest needs it to renew. Seek the glow to the south...',
  air: 'The birds know this secret — they ride invisible rivers through the canopy. Where the leaves dance without being touched and the ancient trees whisper, the breath of the forest awaits in the west...',
  earth: 'Beneath your feet lies the oldest element. Where the ground trembles with ancient memory, where roots grip stone and mountains once stood tall. Seek the place where the forest floor remembers in the north...',
  ether: 'You have found water, fire, air, and earth. Now seek what connects them all — the space between, the silence within. At the very heart of the forest, where all paths converge, the infinite awaits...',
};

// Clues given AFTER answering questions to find the NEXT statue
export const nextStatueClues: Record<ElementType, string> = {
  water: '🔥 The Water Spirit whispers: "You have proven your depth. Now seek the opposite — where the forest burns brightest, where passion ignites the undergrowth. Follow the warmth south, where no water dares to flow..."',
  fire: '💨 The Fire Spirit roars: "Your flame burns true! But fire needs air to breathe. Seek the western wind, where the canopy opens and the breeze carries secrets only the gentlest souls can hear..."',
  air: '🌍 The Air Spirit sighs: "You have felt my breath. Now ground yourself. The north holds something ancient — stone and soil, the weight of emotion buried deep. Where tremors echo beneath the roots, earth speaks..."',
  earth: '✨ The Earth Spirit rumbles: "You have touched the foundation. Now look beyond — to the center, where all elements converge. The final truth lies in the infinite space between worlds. Seek the heart of the forest..."',
  ether: '', // Last statue, no next clue needed
};

export const statueClues: Record<ElementType, { approaching: string; found: string }> = {
  water: {
    approaching: 'Listen... the sound of flowing water calls to you from the east. Where creatures of the forest drink, the first truth awaits.',
    found: 'The Water Spirit speaks: "I am the river of your imagination. Every creature seeks me to survive. Answer my questions, and I shall reveal the depths of your creative soul."',
  },
  fire: {
    approaching: 'A warm glow flickers through the ancient trees to the south. Where lightning once scarred the earth, flames of passion beckon...',
    found: 'The Fire Spirit speaks: "I am the flame within your heart. The forest fears me, yet needs me to be reborn. Tell me of your passion, and I shall illuminate your social spirit."',
  },
  air: {
    approaching: 'A gentle breeze carries whispers from the western grove. The leaves dance on their own, and birds ride invisible rivers...',
    found: 'The Air Spirit speaks: "I am the gentle wind of connection. I carry the songs of birds and the whispers of trees. Share your truth, and I shall reveal your capacity for compassion."',
  },
  earth: {
    approaching: 'The ground beneath you trembles faintly from the north. Ancient roots grip stone where mountains once stood tall...',
    found: 'The Earth Spirit speaks: "I am the foundation beneath all things. I hold the weight of ages and the memory of mountains. Face your inner depths, and I shall show you the landscape of your feelings."',
  },
  ether: {
    approaching: 'An otherworldly hum resonates from the heart of the forest. All paths lead here, where the infinite awaits at the sacred center...',
    found: 'The Ether Spirit speaks: "I am the infinite space of purpose, the thread that binds all elements. You have journeyed far. Reveal your discipline, and I shall unlock the final truth of your being."',
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
  earth: {
    name: 'Statue of Earth',
    effect: 'Ancient stones pulse with deep terrestrial energy, roots intertwine',
    sound: 'A deep rumble resonates from the ground beneath',
  },
  ether: {
    name: 'Statue of Ether',
    effect: 'Infinite space and cosmic energy radiate outward',
    sound: 'A deep cosmic OM resonates through existence',
  },
};
