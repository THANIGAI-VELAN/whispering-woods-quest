import { ForestScene } from './ForestScene';
import { IntroScreen } from './IntroScreen';
import { PlayerInfoForm } from './PlayerInfoForm';
import { StatueEncounter } from './StatueEncounter';
import { QuestionPanel } from './QuestionPanel';
import { PersonalityReport } from './PersonalityReport';
import { GameHUD } from './GameHUD';
import { MiniMap } from './MiniMap';
import { ClueReveal } from './ClueReveal';
import { useGameStore } from '@/store/gameStore';

export function GameContainer() {
  const { gamePhase } = useGameStore();
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Forest Scene - always rendered but may be covered */}
      {gamePhase !== 'intro' && gamePhase !== 'player-info' && gamePhase !== 'report' && (
        <ForestScene />
      )}
      
      {/* UI Overlays */}
      <IntroScreen />
      <PlayerInfoForm />
      <GameHUD />
      <MiniMap />
      <StatueEncounter />
      <QuestionPanel />
      <ClueReveal />
      <PersonalityReport />
      
      {/* Audio indicator */}
      {gamePhase === 'exploring' && (
        <div className="fixed bottom-4 right-20 z-30">
          <div className="glass-panel px-3 py-2 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground font-body">
              Forest Ambience
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
