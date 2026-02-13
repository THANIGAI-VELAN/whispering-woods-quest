import { create } from 'zustand';

export type ElementType = 'water' | 'fire' | 'air' | 'earth' | 'ether';

export interface Answer {
  questionId: string;
  value: number; // 1-5 scale
}

export interface StatueProgress {
  found: boolean;
  questionsAnswered: Answer[];
  completed: boolean;
}

export interface PlayerInfo {
  name: string;
  age: number;
  institution: string;
}

interface GameState {
  gamePhase: 'intro' | 'player-info' | 'exploring' | 'statue' | 'questions' | 'clue-reveal' | 'report';
  currentStatueIndex: number;
  statueOrder: ElementType[];
  statueProgress: Record<ElementType, StatueProgress>;
  currentQuestionIndex: number;
  playerPosition: { x: number; z: number };
  showClue: boolean;
  clueText: string;
  playerInfo: PlayerInfo | null;
  
  // Actions
  startGame: () => void;
  setPlayerInfo: (info: PlayerInfo) => void;
  enterForest: () => void;
  findStatue: (element: ElementType) => void;
  answerQuestion: (questionId: string, value: number) => void;
  nextQuestion: () => void;
  completeStatue: () => void;
  continueFromClue: () => void;
  movePlayer: (x: number, z: number) => void;
  showStatueClue: (clue: string) => void;
  hideClue: () => void;
  goToReport: () => void;
  resetGame: () => void;
}

const initialStatueProgress: Record<ElementType, StatueProgress> = {
  water: { found: false, questionsAnswered: [], completed: false },
  fire: { found: false, questionsAnswered: [], completed: false },
  air: { found: false, questionsAnswered: [], completed: false },
  earth: { found: false, questionsAnswered: [], completed: false },
  ether: { found: false, questionsAnswered: [], completed: false },
};

export const useGameStore = create<GameState>((set, get) => ({
  gamePhase: 'intro',
  currentStatueIndex: 0,
  statueOrder: ['water', 'fire', 'air', 'earth', 'ether'],
  statueProgress: { ...initialStatueProgress },
  currentQuestionIndex: 0,
  playerPosition: { x: 0, z: 0 },
  showClue: false,
  clueText: '',
  playerInfo: null,

  startGame: () => set({ gamePhase: 'player-info' }),

  setPlayerInfo: (info) => set({ playerInfo: info }),

  enterForest: () => set({ gamePhase: 'exploring' }),

  findStatue: (element) => {
    const state = get();
    const expectedElement = state.statueOrder[state.currentStatueIndex];
    
    if (element === expectedElement) {
      set((state) => ({
        gamePhase: 'statue',
        statueProgress: {
          ...state.statueProgress,
          [element]: { ...state.statueProgress[element], found: true },
        },
      }));
    }
  },

  answerQuestion: (questionId, value) => {
    const state = get();
    const currentElement = state.statueOrder[state.currentStatueIndex];
    
    set((state) => ({
      statueProgress: {
        ...state.statueProgress,
        [currentElement]: {
          ...state.statueProgress[currentElement],
          questionsAnswered: [
            ...state.statueProgress[currentElement].questionsAnswered,
            { questionId, value },
          ],
        },
      },
    }));
  },

  nextQuestion: () => {
    const state = get();
    if (state.currentQuestionIndex < 4) {
      set({ currentQuestionIndex: state.currentQuestionIndex + 1 });
    }
  },

  completeStatue: () => {
    const state = get();
    const currentElement = state.statueOrder[state.currentStatueIndex];
    const isLastStatue = state.currentStatueIndex === 4;

    set((state) => ({
      statueProgress: {
        ...state.statueProgress,
        [currentElement]: { ...state.statueProgress[currentElement], completed: true },
      },
      currentQuestionIndex: 0,
      gamePhase: isLastStatue ? 'report' : 'clue-reveal',
    }));
  },

  continueFromClue: () => {
    const state = get();
    set({
      currentStatueIndex: state.currentStatueIndex + 1,
      gamePhase: 'exploring',
    });
  },

  movePlayer: (x, z) => set({ playerPosition: { x, z } }),

  showStatueClue: (clue) => set({ showClue: true, clueText: clue }),

  hideClue: () => set({ showClue: false, clueText: '' }),

  goToReport: () => set({ gamePhase: 'report' }),

  resetGame: () => set({
    gamePhase: 'intro',
    currentStatueIndex: 0,
    statueProgress: { ...initialStatueProgress },
    currentQuestionIndex: 0,
    playerPosition: { x: 0, z: 0 },
    showClue: false,
    clueText: '',
    playerInfo: null,
  }),
}));
