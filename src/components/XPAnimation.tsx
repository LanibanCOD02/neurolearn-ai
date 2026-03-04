import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface XPAnimationProps {
  isVisible: boolean;
  amount: number;
  onComplete?: () => void;
}

export default function XPAnimation({ 
  isVisible, 
  amount, 
  onComplete 
}: XPAnimationProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const controls = {
        value: 0
      };

      const animate = () => {
        const duration = 1500;
        const startTime = performance.now();

        const update = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out

          setCount(Math.floor(amount * ease));

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            if (onComplete) onComplete();
          }
        };

        requestAnimationFrame(update);
      };

      animate();
    }
  }, [isVisible, amount, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-20 right-8 z-50 pointer-events-none flex flex-col items-center gap-2"
        >
          {/* Glowing Aura */}
          <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full animate-pulse" />

          {/* Floating XP Text */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 flex items-center gap-2 px-6 py-3 bg-slate-900/90 border border-yellow-500/50 rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.3)] backdrop-blur-xl"
          >
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 font-mono tracking-wider">
              +{count} XP
            </span>
          </motion.div>

          {/* Particle Trail */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-20 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, x: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  y: -40, 
                  x: (Math.random() - 0.5) * 40 
                }}
                transition={{ 
                  duration: 1 + Math.random(), 
                  repeat: Infinity, 
                  delay: Math.random() * 0.5 
                }}
                className="absolute bottom-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_5px_rgba(234,179,8,0.8)]"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
