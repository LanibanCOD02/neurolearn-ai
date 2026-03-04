import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import CelebrationAnimation from '../components/CelebrationAnimation';
import XPAnimation from '../components/XPAnimation';
import MotivationFeedback from '../components/MotivationFeedback';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "What is the primary function of a qubit in quantum computing?",
    options: [
      "To store classical bits (0 or 1)",
      "To exist in superposition of states",
      "To increase processing speed linearly",
      "To replace traditional transistors"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    text: "Which neural network architecture is best suited for image recognition?",
    options: [
      "Recurrent Neural Networks (RNN)",
      "Convolutional Neural Networks (CNN)",
      "Generative Adversarial Networks (GAN)",
      "Long Short-Term Memory (LSTM)"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "In orbital mechanics, what is the 'Hohmann Transfer' used for?",
    options: [
      "Landing on a planet",
      "Efficiently moving between two orbits",
      "Escaping a black hole",
      "Docking with a space station"
    ],
    correctAnswer: 1
  }
];

export default function Assessment() {
  const [step, setStep] = useState<'intro' | 'generating' | 'quiz' | 'analyzing' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // Animation States
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [isHighPerformance, setIsHighPerformance] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [xpAmount, setXpAmount] = useState(0);
  const [showMotivation, setShowMotivation] = useState(false);
  const [shakeCard, setShakeCard] = useState(false);
  const [showCorrectHint, setShowCorrectHint] = useState(false);

  const startAssessment = () => {
    setStep('generating');
    setTimeout(() => setStep('quiz'), 2000);
  };

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    const isCorrect = index === mockQuestions[currentQuestion].correctAnswer;
    let newScore = score;
    
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
      // Trigger Celebration for correct answer
      setCelebrationMessage("Yay! Correct Answer 🎉");
      setIsHighPerformance(false);
      setShowCelebration(true);
    } else {
      // Wrong answer logic
      setShowMotivation(true);
      setShakeCard(true);
      
      // Reset shake after animation
      setTimeout(() => setShakeCard(false), 500);

      // Show correct hint after 1 second
      setTimeout(() => setShowCorrectHint(true), 1000);
    }
    
    setTimeout(() => {
      if (currentQuestion < mockQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowCelebration(false); // Hide celebration before next question
        setShowMotivation(false);
        setShowCorrectHint(false); // Reset hint
      } else {
        setStep('analyzing');
        setTimeout(() => {
            setStep('result');
            handleResult(newScore);
        }, 2500);
      }
    }, 2500); // Increased delay to let animation play a bit
  };

  const handleResult = (finalScore: number) => {
    const percentage = (finalScore / mockQuestions.length) * 100;
    
    // Trigger XP Animation
    setXpAmount(finalScore * 150); // Example XP calculation
    setShowXP(true);

    // Trigger High Performance Celebration
    if (percentage > 80) {
      setTimeout(() => {
        setCelebrationMessage("Outstanding Performance! 🚀");
        setIsHighPerformance(true);
        setShowCelebration(true);
      }, 500);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center relative overflow-hidden">
      <CelebrationAnimation 
        isVisible={showCelebration} 
        message={celebrationMessage} 
        isHighPerformance={isHighPerformance}
        onComplete={() => setShowCelebration(false)}
      />
      
      <XPAnimation 
        isVisible={showXP} 
        amount={xpAmount} 
        onComplete={() => setShowXP(false)}
      />

      <MotivationFeedback 
        isVisible={showMotivation} 
        onComplete={() => setShowMotivation(false)} 
      />

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-2xl p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl"
          >
            <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
              <Brain className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">AI Skill Assessment</h2>
            <p className="text-slate-400 mb-8">
              Our neural engine will generate a personalized quiz based on your current knowledge graph.
              This helps identify weak nodes and optimize your learning path.
            </p>
            <button 
              onClick={startAssessment}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform"
            >
              Initialize Assessment
            </button>
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div 
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
              <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin" />
              <Brain className="absolute inset-0 m-auto w-12 h-12 text-cyan-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-mono text-cyan-400">GENERATING NEURAL PATHWAYS...</h3>
            <p className="text-slate-500 text-sm mt-2">Analyzing cognitive patterns</p>
          </motion.div>
        )}

        {step === 'quiz' && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={shakeCard ? { x: [0, -10, 10, -10, 10, 0] } : { opacity: 1, x: 0 }}
            transition={shakeCard ? { duration: 0.4 } : {}}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-3xl p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-slate-400 text-sm font-mono">
                QUESTION {currentQuestion + 1}/{mockQuestions.length}
              </span>
              <div className="flex gap-1">
                {mockQuestions.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-8 rounded-full transition-colors ${
                      i <= currentQuestion ? 'bg-cyan-500' : 'bg-slate-700'
                    }`} 
                  />
                ))}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">
              {mockQuestions[currentQuestion].text}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {mockQuestions[currentQuestion].options.map((option, index) => {
                const isCorrectAnswer = index === mockQuestions[currentQuestion].correctAnswer;
                const showPulse = showCorrectHint && isCorrectAnswer;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedOption !== null}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group ${
                      selectedOption === index 
                        ? index === mockQuestions[currentQuestion].correctAnswer
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'bg-red-500/20 border-red-500/50 text-red-400'
                        : showPulse 
                          ? 'bg-green-500/10 border-green-500/50 text-green-400 ring-2 ring-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-pulse'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/30 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center relative z-10">
                      <span className="font-medium">{option}</span>
                      {selectedOption === index && (
                        index === mockQuestions[currentQuestion].correctAnswer 
                          ? <CheckCircle className="w-5 h-5" />
                          : <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 'analyzing' && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-md bg-slate-800/50 rounded-full h-2 mb-8 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
              />
            </div>
            <h3 className="text-xl font-mono text-purple-400">UPDATING BRAIN TWIN...</h3>
            <p className="text-slate-500 text-sm mt-2">Recalibrating skill nodes</p>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-2xl p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl"
          >
            <div className="w-32 h-32 mx-auto mb-6 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                <motion.circle 
                  cx="64" cy="64" r="60" 
                  stroke="#22d3ee" 
                  strokeWidth="8" 
                  fill="transparent"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * (score / mockQuestions.length))}
                  initial={{ strokeDashoffset: 377 }}
                  animate={{ strokeDashoffset: 377 - (377 * (score / mockQuestions.length)) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute text-3xl font-bold text-white">
                {Math.round((score / mockQuestions.length) * 100)}%
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Assessment Complete</h2>
            <p className="text-slate-400 mb-8">
              Your knowledge graph has been updated. We've identified new focus areas in 
              <span className="text-cyan-400"> Neural Networks</span>.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-sm text-slate-500">XP Earned</div>
                <div className="text-xl font-bold text-yellow-400">+450 XP</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-sm text-slate-500">New Level</div>
                <div className="text-xl font-bold text-purple-400">Level 6</div>
              </div>
            </div>

            <button 
              onClick={() => setStep('intro')}
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium text-white transition-colors"
            >
              Return to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
