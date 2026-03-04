import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUOTES = [
  "Mistakes mean you're learning. Keep going 💪",
  "Every expert was once a beginner.",
  "Progress > Perfection.",
  "This is a step toward mastery.",
  "Growth happens outside comfort zones.",
  "Try again — your brain is building new connections.",
  "Learning is a journey, not a score.",
  "Small setbacks create big comebacks."
];

interface MotivationFeedbackProps {
  isVisible: boolean;
  onComplete?: () => void;
}

export default function MotivationFeedback({ isVisible, onComplete }: MotivationFeedbackProps) {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    if (isVisible) {
      // Pick random quote
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setQuote(randomQuote);

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
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="relative mx-4">
            {/* Soft Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-2xl rounded-full" />
            
            <div className="relative px-8 py-6 bg-slate-900/90 backdrop-blur-xl border border-orange-500/30 rounded-2xl shadow-2xl shadow-orange-500/10">
              <p className="text-lg md:text-xl font-medium text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-red-200 font-display tracking-wide">
                {quote}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
