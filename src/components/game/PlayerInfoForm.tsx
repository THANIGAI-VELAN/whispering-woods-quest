import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function PlayerInfoForm() {
  const { gamePhase, setPlayerInfo, enterForest } = useGameStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [institution, setInstitution] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (gamePhase !== 'player-info') return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = name.trim();
    const trimmedInst = institution.trim();
    const ageNum = parseInt(age, 10);

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      newErrors.name = 'Please enter a valid name (2-100 characters)';
    }
    if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      newErrors.age = 'Please enter a valid age (10-120)';
    }
    if (!trimmedInst || trimmedInst.length < 2 || trimmedInst.length > 200) {
      newErrors.institution = 'Please enter a valid institution (2-200 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setPlayerInfo({
      name: name.trim(),
      age: parseInt(age, 10),
      institution: institution.trim(),
    });
    enterForest();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center mystical-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="max-w-lg w-full mx-4 p-8 rounded-2xl glass-panel"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-display text-foreground mb-3 shimmer-text">
              Before You Enter...
            </h2>
            <p className="text-muted-foreground font-body">
              The forest spirits need to know who dares to seek the truth within.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-display text-primary mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground 
                           font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 
                           focus:ring-primary/50 transition-all"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1 font-body">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-display text-primary mb-2">
                Your Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={10}
                max={120}
                placeholder="Enter your age"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground 
                           font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 
                           focus:ring-primary/50 transition-all"
              />
              {errors.age && (
                <p className="text-sm text-destructive mt-1 font-body">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-display text-primary mb-2">
                Your Institution
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                maxLength={200}
                placeholder="School, university, or organization"
                className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground 
                           font-body placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 
                           focus:ring-primary/50 transition-all"
              />
              {errors.institution && (
                <p className="text-sm text-destructive mt-1 font-body">{errors.institution}</p>
              )}
            </div>
          </div>

          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-8 py-4 text-lg font-display bg-primary text-primary-foreground 
                       rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg 
                       hover:shadow-primary/30"
          >
            Enter the Enchanted Forest
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
