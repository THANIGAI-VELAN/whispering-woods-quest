import { ForestScene } from './ForestScene';
import { UnderwaterScene } from './UnderwaterScene';
import { BurningCityScene } from './BurningCityScene';
import { IntroScreen } from './IntroScreen';
import { PlayerInfoForm } from './PlayerInfoForm';
import { StatueEncounter } from './StatueEncounter';
import { QuestionPanel } from './QuestionPanel';
import { PersonalityReport } from './PersonalityReport';
import { GameHUD } from './GameHUD';
import { MiniMap } from './MiniMap';
import { ClueReveal } from './ClueReveal';
import { TransitionOverlay } from './TransitionOverlay';
import { useGameStore } from '@/store/gameStore';

export function GameContainer() {
  const { gamePhase } = useGameStore();

  const showForest = gamePhase === 'exploring' || gamePhase === 'statue' || gamePhase === 'questions' || gamePhase === 'clue-reveal';
  const showUnderwater = gamePhase === 'exploring_underwater';
  const showMadurai = gamePhase === 'exploring_madurai';
  // Also show the correct 3D scene when statue/questions overlay is on top of a world
  const currentElement = useGameStore((s) => s.statueOrder[s.currentStatueIndex]);
  const showUnderwaterBg = (gamePhase === 'statue' || gamePhase === 'questions' || gamePhase === 'clue-reveal') && currentElement === 'water';
  const showMaduraiBg = (gamePhase === 'statue' || gamePhase === 'questions' || gamePhase === 'clue-reveal') && currentElement === 'fire';

  const show3D = gamePhase !== 'intro' && gamePhase !== 'player-info' && gamePhase !== 'report' && gamePhase !== 'transition';

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Scenes */}
      {show3D && (showUnderwaterBg || showUnderwater) && <UnderwaterScene />}
      {show3D && (showMaduraiBg || showMadurai) && <BurningCityScene />}
      {show3D && showForest && !showUnderwaterBg && !showMaduraiBg && <ForestScene />}

      {/* UI Overlays */}
      <IntroScreen />
      <PlayerInfoForm />
      <GameHUD />
      <MiniMap />
      <StatueEncounter />
      <QuestionPanel />
      <ClueReveal />
      <PersonalityReport />

      {/* Transitions */}
      <TransitionOverlay />

      {/* Audio indicator */}
      {(gamePhase === 'exploring' || gamePhase === 'exploring_underwater' || gamePhase === 'exploring_madurai') && (
        <div className="fixed bottom-4 right-20 z-30">
          <div className="glass-panel px-3 py-2 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground font-body">
              {gamePhase === 'exploring_underwater' ? 'Underwater Ambience' :
               gamePhase === 'exploring_madurai' ? 'Burning City' : 'Forest Ambience'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
