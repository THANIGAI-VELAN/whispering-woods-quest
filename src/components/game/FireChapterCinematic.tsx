import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

type FireScene = 'rubbing_stones' | 'fire_ignite' | 'madurai_reveal' | 'burning_city' | 'palace_entrance' | 'done';

export function FireChapterCinematic() {
  const { gamePhase, firePhase, endCinematic } = useGameStore();
  const [scene, setScene] = useState<FireScene>('rubbing_stones');
  const [textIndex, setTextIndex] = useState(0);

  const isActive = gamePhase === 'cinematic' && firePhase === 'cinematic_fire';

  const advanceScene = useCallback(() => {
    switch (scene) {
      case 'rubbing_stones':
        setScene('fire_ignite');
        setTextIndex(0);
        break;
      case 'fire_ignite':
        setScene('madurai_reveal');
        setTextIndex(0);
        break;
      case 'madurai_reveal':
        setScene('burning_city');
        setTextIndex(0);
        break;
      case 'burning_city':
        setScene('palace_entrance');
        setTextIndex(0);
        break;
      case 'palace_entrance':
        endCinematic();
        break;
    }
  }, [scene, endCinematic]);

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => setTextIndex((p) => p + 1), 40);
    return () => clearTimeout(timer);
  }, [textIndex, isActive]);

  if (!isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene}
        className="fixed inset-0 z-50 overflow-hidden cursor-pointer"
        onClick={advanceScene}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        {scene === 'rubbing_stones' && <RubbingStonesScene textIndex={textIndex} />}
        {scene === 'fire_ignite' && <FireIgniteScene textIndex={textIndex} />}
        {scene === 'madurai_reveal' && <MaduraiRevealScene textIndex={textIndex} />}
        {scene === 'burning_city' && <BurningCityScene textIndex={textIndex} />}
        {scene === 'palace_entrance' && <PalaceEntranceScene textIndex={textIndex} />}

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-sm font-body text-foreground/60 tracking-widest uppercase">
            Click to continue
          </span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function TypewriterText({ text, textIndex, color = 'text-foreground/90' }: { text: string; textIndex: number; color?: string }) {
  return (
    <motion.p className={`text-lg md:text-xl font-body leading-relaxed ${color} max-w-2xl text-center`}>
      {text.slice(0, textIndex)}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>
    </motion.p>
  );
}

function RubbingStonesScene({ textIndex }: { textIndex: number }) {
  const text = "The Water Spirit's clue echoes in your mind... You pick up two ancient stones from the forest floor. Your hands tremble as you strike them together, again and again...";

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(160,20%,6%)] via-[hsl(30,15%,8%)] to-[hsl(20,20%,6%)]" />

      {/* Sparks */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            background: `hsl(${30 + Math.random() * 30} 100% ${60 + Math.random() * 30}%)`,
            boxShadow: `0 0 4px hsl(35 100% 60%)`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 200],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 0.6 + Math.random() * 0.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            repeatDelay: Math.random() * 2,
          }}
        />
      ))}

      {/* Stones center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 0.3, repeat: Infinity }}
      >
        <div className="w-12 h-8 rounded bg-[hsl(30,10%,25%)] border border-[hsl(30,15%,35%)]" />
      </motion.div>

      <div className="absolute bottom-[15%] left-0 right-0 flex justify-center p-8">
        <TypewriterText text={text} textIndex={textIndex} />
      </div>
    </div>
  );
}

function FireIgniteScene({ textIndex }: { textIndex: number }) {
  const text = "WHOOSH! A blinding flame erupts from the stones, engulfing the darkness. The fire grows, consuming the forest around you, revealing a portal of swirling flames that pulls you through time itself...";

  return (
    <div className="relative w-full h-full">
      {/* Fire gradient */}
      <motion.div
        className="absolute inset-0"
        initial={{ background: 'linear-gradient(180deg, hsl(20 30% 5%) 0%, hsl(30 40% 8%) 100%)' }}
        animate={{ background: 'linear-gradient(180deg, hsl(25 90% 15%) 0%, hsl(15 80% 20%) 50%, hsl(35 100% 30%) 100%)' }}
        transition={{ duration: 2 }}
      />

      {/* Massive flames */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-10%',
            width: `${10 + Math.random() * 40}px`,
            height: `${40 + Math.random() * 100}px`,
            background: `linear-gradient(0deg, hsl(${20 + Math.random() * 20} ${80 + Math.random() * 20}% ${40 + Math.random() * 20}%), transparent)`,
            filter: 'blur(3px)',
            borderRadius: '50% 50% 20% 20%',
          }}
          animate={{
            y: [0, -(100 + Math.random() * 300)],
            opacity: [0.8, 0],
            scaleX: [1, 0.5],
          }}
          transition={{
            duration: 1.5 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Center flash */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ background: 'radial-gradient(circle, hsl(40 100% 70% / 0.4), transparent 60%)' }}
      />

      <div className="absolute bottom-[15%] left-0 right-0 flex justify-center p-8">
        <TypewriterText text={text} textIndex={textIndex} />
      </div>
    </div>
  );
}

function MaduraiRevealScene({ textIndex }: { textIndex: number }) {
  const text = "You emerge at the other end of the forest. Before you stands an ancient Tamil city — majestic temples with towering gopurams, stone-carved streets, and the echoes of a once-great civilization...";

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(20,50%,10%)] via-[hsl(25,40%,15%)] to-[hsl(30,35%,8%)]" />

      {/* Temple gopurams (towers) */}
      {[15, 35, 50, 65, 85].map((x, i) => (
        <motion.div
          key={i}
          className="absolute bottom-[10%]"
          style={{
            left: `${x}%`,
            transform: 'translateX(-50%)',
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.2, duration: 1.5 }}
        >
          {/* Tower */}
          <div
            className="relative"
            style={{
              width: `${20 + (i === 2 ? 15 : 0)}px`,
              height: `${80 + (i === 2 ? 60 : Math.random() * 40)}px`,
              background: `linear-gradient(180deg, hsl(35 40% ${20 + i * 3}%), hsl(30 30% ${15 + i * 2}%))`,
              clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
            }}
          />
          {/* Dome */}
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
            style={{ background: `hsl(45 60% 40%)` }}
          />
        </motion.div>
      ))}

      {/* Tamil board */}
      <motion.div
        className="absolute top-[12%] left-1/2 -translate-x-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 100 }}
      >
        <div className="px-8 py-4 rounded-lg border-2 border-fire/40 bg-card/60 backdrop-blur-sm">
          <p className="text-4xl md:text-5xl font-display text-fire text-center" style={{ textShadow: '0 0 30px hsl(25 95% 55% / 0.6)' }}>
            மதுரை
          </p>
          <p className="text-sm text-fire/60 text-center mt-2 font-body tracking-widest uppercase">
            Madurai — The Ancient City
          </p>
        </div>
      </motion.div>

      {/* Embers floating */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`ember-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-fire/50"
          style={{ left: `${Math.random() * 100}%`, bottom: '10%' }}
          animate={{ y: [0, -(200 + Math.random() * 300)], opacity: [0.6, 0], x: [0, Math.random() * 50 - 25] }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      <div className="absolute bottom-[15%] left-0 right-0 flex justify-center p-8">
        <TypewriterText text={text} textIndex={textIndex} />
      </div>
    </div>
  );
}

function BurningCityScene({ textIndex }: { textIndex: number }) {
  const text = "But the city is ablaze! Flames consume the ancient structures, painting the sky in shades of crimson and gold. The heat is overwhelming, yet something pulls you deeper into the inferno...";

  return (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(180deg, hsl(10 60% 10%) 0%, hsl(20 70% 15%) 50%, hsl(30 80% 20%) 100%)',
            'linear-gradient(180deg, hsl(15 70% 15%) 0%, hsl(25 80% 20%) 50%, hsl(35 90% 25%) 100%)',
            'linear-gradient(180deg, hsl(10 60% 10%) 0%, hsl(20 70% 15%) 50%, hsl(30 80% 20%) 100%)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Flames everywhere */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 30}%`,
            width: `${8 + Math.random() * 25}px`,
            height: `${30 + Math.random() * 80}px`,
            background: `linear-gradient(0deg, hsl(${15 + Math.random() * 25} ${80 + Math.random() * 20}% ${35 + Math.random() * 25}%), transparent)`,
            filter: 'blur(2px)',
            borderRadius: '50% 50% 20% 20%',
          }}
          animate={{
            y: [0, -(30 + Math.random() * 80)],
            opacity: [0.7, 0],
            scaleX: [1, 0.3],
          }}
          transition={{
            duration: 1 + Math.random() * 1.5,
            repeat: Infinity,
            delay: Math.random() * 1.5,
          }}
        />
      ))}

      {/* Building silhouettes on fire */}
      {[10, 25, 45, 60, 80].map((x, i) => (
        <div
          key={i}
          className="absolute bottom-0"
          style={{
            left: `${x}%`,
            width: `${30 + Math.random() * 40}px`,
            height: `${60 + Math.random() * 80}px`,
            background: `linear-gradient(180deg, hsl(20 30% ${8 + Math.random() * 5}%), hsl(15 25% 5%))`,
            opacity: 0.8,
          }}
        />
      ))}

      {/* Heat distortion overlay */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at bottom, hsl(30 100% 50% / 0.08), transparent 60%)' }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      <div className="absolute bottom-[15%] left-0 right-0 flex justify-center p-8">
        <TypewriterText text={text} textIndex={textIndex} />
      </div>
    </div>
  );
}

function PalaceEntranceScene({ textIndex }: { textIndex: number }) {
  const text = "At the heart of the burning city stands the Royal Palace — its walls still defiant against the flames. Inside, amidst pillars of scorched stone, the Fire Statue blazes with an untamed, primal energy...";

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(15,50%,8%)] via-[hsl(20,40%,12%)] to-[hsl(25,50%,10%)]" />

      {/* Palace pillars */}
      {[20, 35, 50, 65, 80].map((x, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0"
          style={{
            left: `${x}%`,
            width: '16px',
            height: `${50 + i * 5}%`,
            background: `linear-gradient(180deg, hsl(25 30% 25%), hsl(20 25% 15%))`,
            borderRadius: '4px 4px 0 0',
          }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.15, duration: 1 }}
        />
      ))}

      {/* Fire statue glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 2 }}
      >
        <div className="w-full h-full relative">
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'radial-gradient(ellipse, hsl(25 95% 55% / 0.5), hsl(15 80% 40% / 0.2), transparent 70%)',
              boxShadow: '0 0 60px hsl(25 95% 55% / 0.4), 0 0 120px hsl(35 100% 50% / 0.2)',
            }}
          />
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(40 100% 70%), hsl(25 95% 55%), transparent)',
              boxShadow: '0 0 40px hsl(30 100% 55% / 0.7)',
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>

      <div className="absolute bottom-[12%] left-0 right-0 flex justify-center p-8">
        <TypewriterText text={text} textIndex={textIndex} />
      </div>
    </div>
  );
}
