import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CelebrationAnimationProps {
  isVisible: boolean;
  message?: string;
  isHighPerformance?: boolean;
  onComplete?: () => void;
}

export default function CelebrationAnimation({ 
  isVisible, 
  message = "Yay! Correct Answer 🎉", 
  isHighPerformance = false,
  onComplete 
}: CelebrationAnimationProps) {

  useEffect(() => {
    if (isVisible) {
      // Trigger confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });

      fire(0.2, {
        spread: 60,
      });

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });

      // Auto fade out
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="relative">
            {/* Glowing Aura for High Performance */}
            {isHighPerformance && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-purple-500/30 blur-3xl rounded-full"
              />
            )}

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={`
                px-8 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl
                ${isHighPerformance 
                  ? 'bg-gradient-to-r from-yellow-500/20 to-purple-600/20 border-yellow-500/50 shadow-yellow-500/20' 
                  : 'bg-slate-900/80 border-cyan-500/50 shadow-cyan-500/20'
                }
              `}
            >
              <h2 className={`
                text-2xl md:text-4xl font-bold text-center
                ${isHighPerformance 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-purple-300' 
                  : 'text-white'
                }
              `}>
                {message}
              </h2>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
