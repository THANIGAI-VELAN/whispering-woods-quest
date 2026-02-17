import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

type CinematicScene = 'ocean_reveal' | 'diving' | 'kumari_kandam' | 'temple_entrance' | 'done';

export function WaterChapterCinematic() {
  const { gamePhase, waterPhase, endCinematic } = useGameStore();
  const [scene, setScene] = useState<CinematicScene>('ocean_reveal');
  const [textIndex, setTextIndex] = useState(0);

  const isActive = gamePhase === 'cinematic' && waterPhase === 'cinematic_ocean';

  const advanceScene = useCallback(() => {
    switch (scene) {
      case 'ocean_reveal':
        setScene('diving');
        setTextIndex(0);
        break;
      case 'diving':
        setScene('kumari_kandam');
        setTextIndex(0);
        break;
      case 'kumari_kandam':
        setScene('temple_entrance');
        setTextIndex(0);
        break;
      case 'temple_entrance':
        endCinematic();
        break;
    }
  }, [scene, endCinematic]);

  // Auto-advance text typing
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => {
      setTextIndex((prev) => prev + 1);
    }, 40);
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
        {scene === 'ocean_reveal' && <OceanRevealScene textIndex={textIndex} />}
        {scene === 'diving' && <DivingScene textIndex={textIndex} />}
        {scene === 'kumari_kandam' && <KumariKandamScene textIndex={textIndex} />}
        {scene === 'temple_entrance' && <TempleEntranceScene textIndex={textIndex} />}

        {/* Click to continue */}
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

function OceanRevealScene({ textIndex }: { textIndex: number }) {
  const text = "The animals led you to the edge of the ancient forest... Before you stretches an infinite ocean, its waters dark and shimmering under a pale moon. Waves crash against moss-covered ruins half-swallowed by the sea.";
  const displayText = text.slice(0, textIndex);

  return (
    <div className="relative w-full h-full">
      {/* Ocean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(200,30%,8%)] via-[hsl(210,50%,12%)] to-[hsl(220,60%,18%)]" />
      
      {/* Animated waves */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[200%] left-[-50%] rounded-[50%]"
            style={{
              bottom: `${i * 8}%`,
              height: '120px',
              background: `linear-gradient(180deg, transparent, hsl(200 ${50 + i * 8}% ${15 + i * 3}% / ${0.3 + i * 0.1}))`,
            }}
            animate={{
              x: ['-5%', '5%', '-5%'],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 4 + i * 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <motion.div
        className="absolute top-[10%] right-[20%] w-20 h-20 rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(45 30% 85%) 0%, hsl(45 20% 70%) 50%, transparent 70%)',
          boxShadow: '0 0 60px hsl(45 30% 70% / 0.4), 0 0 120px hsl(45 30% 60% / 0.2)',
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Sparkles on water */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-water/60"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${50 + Math.random() * 40}%`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <motion.p
          className="text-xl md:text-2xl font-body leading-relaxed text-foreground/90 max-w-2xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textShadow: '0 0 20px hsl(200 80% 55% / 0.5)' }}
        >
          {displayText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            |
          </motion.span>
        </motion.p>
      </div>
    </div>
  );
}

function DivingScene({ textIndex }: { textIndex: number }) {
  const text = "You step into the cold waters... The ocean embraces you, pulling you deeper. Light fades above as luminous creatures guide your descent into the abyss.";
  const displayText = text.slice(0, textIndex);

  return (
    <div className="relative w-full h-full">
      {/* Deep water gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(210,40%,15%)] via-[hsl(220,50%,8%)] to-[hsl(230,60%,4%)]" />

      {/* Rising bubbles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-water/30"
          style={{
            width: `${4 + Math.random() * 12}px`,
            height: `${4 + Math.random() * 12}px`,
            left: `${Math.random() * 100}%`,
            background: `hsl(200 80% 55% / ${0.05 + Math.random() * 0.1})`,
          }}
          initial={{ bottom: '-10%', opacity: 0 }}
          animate={{
            bottom: '110%',
            opacity: [0, 0.6, 0],
            x: [0, Math.random() * 40 - 20, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Bioluminescent particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`bio-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${30 + Math.random() * 50}%`,
            background: `radial-gradient(circle, hsl(${180 + Math.random() * 40} 80% 60%) 0%, transparent 70%)`,
            boxShadow: `0 0 10px hsl(${180 + Math.random() * 40} 80% 60% / 0.5)`,
          }}
          animate={{
            x: [0, Math.random() * 30 - 15, 0],
            y: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Light rays from above */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`ray-${i}`}
          className="absolute top-0"
          style={{
            left: `${15 + i * 18}%`,
            width: '3px',
            height: '60%',
            background: `linear-gradient(180deg, hsl(200 60% 50% / 0.15), transparent)`,
            filter: 'blur(4px)',
            transformOrigin: 'top',
          }}
          animate={{ opacity: [0.2, 0.5, 0.2], rotate: [-2, 2, -2] }}
          transition={{ duration: 4 + i, repeat: Infinity }}
        />
      ))}

      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <motion.p
          className="text-xl md:text-2xl font-body leading-relaxed text-foreground/90 max-w-2xl text-center"
          style={{ textShadow: '0 0 20px hsl(200 80% 55% / 0.5)' }}
        >
          {displayText}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>
        </motion.p>
      </div>
    </div>
  );
}

function KumariKandamScene({ textIndex }: { textIndex: number }) {
  const text = "An ancient civilization emerges from the deep — colossal stone pillars carved with Tamil script rise from the ocean floor. Temples and palaces stretch endlessly, their grandeur untouched by time.";
  const displayText = text.slice(0, textIndex);

  return (
    <div className="relative w-full h-full">
      {/* Deep underwater with warm temple glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,50%,6%)] via-[hsl(210,40%,10%)] to-[hsl(200,35%,12%)]" />

      {/* Temple columns */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`col-${i}`}
          className="absolute bottom-0"
          style={{
            left: `${5 + i * 12}%`,
            width: '20px',
            height: `${40 + Math.random() * 30}%`,
            background: `linear-gradient(180deg, hsl(40 30% 25% / 0.6), hsl(40 20% 15% / 0.8))`,
            borderRadius: '4px 4px 0 0',
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.15, duration: 1.5 }}
        />
      ))}

      {/* Temple base structure */}
      <motion.div
        className="absolute bottom-[5%] left-[10%] right-[10%] h-[15%] rounded-t-lg"
        style={{
          background: 'linear-gradient(180deg, hsl(40 25% 20% / 0.7), hsl(40 20% 12% / 0.9))',
          borderTop: '2px solid hsl(45 40% 35% / 0.5)',
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      />

      {/* Tamil Board */}
      <motion.div
        className="absolute top-[15%] left-1/2 -translate-x-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 100 }}
      >
        <div className="px-8 py-4 rounded-lg border-2 border-water/40 bg-card/60 backdrop-blur-sm">
          <p className="text-4xl md:text-5xl font-display text-water text-center" style={{ textShadow: '0 0 30px hsl(200 80% 55% / 0.6)' }}>
            குமரிக்கண்டம்
          </p>
          <p className="text-sm text-water/60 text-center mt-2 font-body tracking-widest uppercase">
            Kumari Kandam — The Lost Land
          </p>
        </div>
      </motion.div>

      {/* Floating particles / debris */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-water/30"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      {/* Warm glow from temple */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, hsl(200 60% 40% / 0.15), transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Text */}
      <div className="absolute bottom-[15%] left-0 right-0 flex justify-center p-8">
        <motion.p
          className="text-lg md:text-xl font-body leading-relaxed text-foreground/85 max-w-2xl text-center"
          style={{ textShadow: '0 0 15px hsl(200 80% 55% / 0.4)' }}
        >
          {displayText}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>
        </motion.p>
      </div>
    </div>
  );
}

function TempleEntranceScene({ textIndex }: { textIndex: number }) {
  const text = "Deep within the sunken temple, a massive chamber opens before you. Water cascades from the ceiling in shimmering curtains. At the center, upon an altar of ancient stone, the Water Statue pulses with an ethereal blue light...";
  const displayText = text.slice(0, textIndex);

  return (
    <div className="relative w-full h-full">
      {/* Temple interior */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(210,40%,5%)] via-[hsl(200,45%,8%)] to-[hsl(200,50%,12%)]" />

      {/* Water curtains falling */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`curtain-${i}`}
          className="absolute top-0"
          style={{
            left: `${5 + i * 8}%`,
            width: '2px',
            height: '100%',
            background: `linear-gradient(180deg, hsl(200 70% 50% / 0.3), hsl(200 60% 40% / 0.1), hsl(200 70% 50% / 0.2))`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            backgroundPosition: ['0% 0%', '0% 100%'],
          }}
          transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() }}
        />
      ))}

      {/* Statue glow at center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 2, type: 'spring' }}
      >
        <div className="w-full h-full relative">
          {/* Statue silhouette */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'radial-gradient(ellipse, hsl(200 80% 55% / 0.4), hsl(200 70% 40% / 0.2), transparent 70%)',
              boxShadow: '0 0 60px hsl(200 80% 55% / 0.3), 0 0 120px hsl(200 70% 45% / 0.2)',
            }}
          />
          {/* Pulsing core */}
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(200 90% 70%), hsl(200 80% 55%), transparent)',
              boxShadow: '0 0 30px hsl(200 90% 60% / 0.6)',
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Text */}
      <div className="absolute bottom-[12%] left-0 right-0 flex justify-center p-8">
        <motion.p
          className="text-lg md:text-xl font-body leading-relaxed text-foreground/85 max-w-2xl text-center"
          style={{ textShadow: '0 0 15px hsl(200 80% 55% / 0.4)' }}
        >
          {displayText}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>
        </motion.p>
      </div>
    </div>
  );
}
