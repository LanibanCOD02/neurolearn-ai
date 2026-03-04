import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, CheckCircle, ArrowRight, Sparkles, Target, BookOpen, Map, Download, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useCareerStage } from '@/context/CareerStageContext';
import { useTheme } from '@/context/ThemeContext';
// import SquaresBackground from '@/components/SquaresBackground';

const BackButton = ({ onClick, label = 'Back', theme }: { onClick: () => void; label?: string; theme: 'light' | 'dark' }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors mb-6",
      theme === 'dark'
        ? 'hover:bg-white/10 text-slate-300 hover:text-white'
        : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
    )}
  >
    <ArrowLeft className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

const DOMAINS = [
  "Artificial Intelligence", "Data Science", "Cybersecurity", "Web Development",
  "Quantum Computing", "Finance & Analytics", "Design & UI/UX", "Robotics", "Biotechnology"
];

export default function CareerGuidance() {
  const { user } = useAuth();
  const { setStage: setContextStage } = useCareerStage();
  const { theme } = useTheme();
  const [stage, setStage] = useState<'intro' | 'domain-select' | 'stage1-questions' | 'stage1-result' | 'stage2-questions' | 'final-result'>('intro');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [stage1Questions, setStage1Questions] = useState<any[]>([]);
  const [stage1Answers, setStage1Answers] = useState<any[]>([]);
  const [stage1Result, setStage1Result] = useState<any>(null);
  const [stage2Questions, setStage2Questions] = useState<any[]>([]);
  const [stage2Answers, setStage2Answers] = useState<any[]>([]);
  const [finalResult, setFinalResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Update context whenever local stage changes
  useEffect(() => {
    setContextStage(stage as any);
  }, [stage, setContextStage]);

  const handleDomainSelect = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter(d => d !== domain));
    } else if (selectedDomains.length < 3) {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const startStage1 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/career/stage1/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_domains: selectedDomains })
      });
      const data = await res.json();
      setStage1Questions(data);
      setStage('stage1-questions');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const submitStage1 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/career/stage1/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: stage1Answers })
      });
      const data = await res.json();
      setStage1Result(data);
      setStage('stage1-result');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startStage2 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/career/stage2/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ top_domains: stage1Result.top_domains })
      });
      const data = await res.json();
      setStage2Questions(data);
      setStage('stage2-questions');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const submitStage2 = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/career/stage2/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers: stage2Answers, 
          stage1_results: stage1Result,
          user_id: user?.id 
        })
      });
      const data = await res.json();
      setFinalResult(data);
      setStage('final-result');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background placeholder removed per user request */}
      {/* (SquaresBackground component deleted) */}

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
         <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto p-8">
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 mt-20"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-purple-500/20">
                <BrainCircuit className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl font-bold font-display bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                AI Career Intelligence
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Discover your perfect career path through our advanced AI-driven assessment. 
                We analyze your interests, aptitude, and cognitive patterns to build a personalized roadmap.
              </p>
              <button 
                onClick={() => setStage('domain-select')}
                className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
              >
                Start Discovery <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {stage === 'domain-select' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <BackButton onClick={() => setStage('intro')} theme={theme} />
              <h2 className="text-3xl font-bold text-center">Select 3 Domains of Interest</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DOMAINS.map(domain => (
                  <button
                    key={domain}
                    onClick={() => handleDomainSelect(domain)}
                    className={`p-6 rounded-2xl border transition-all text-left ${
                      selectedDomains.includes(domain) 
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <span className={`text-lg font-medium ${selectedDomains.includes(domain) ? 'text-cyan-400' : 'text-slate-300'}`}>
                      {domain}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={startStage1}
                  disabled={selectedDomains.length !== 3 || loading}
                  className="px-8 py-3 bg-cyan-600 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Generating...' : 'Next Step'} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'stage1-questions' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto space-y-8 relative"
            >
              <BackButton onClick={() => setStage('domain-select')} />
              <h2 className="text-2xl font-bold text-center text-slate-200 relative z-10">
                Finding Yourself
              </h2>

              {stage1Questions.map((q, idx) => (
                <div key={idx} className="bg-white/8 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4 relative z-10">
                  <h3 className="text-lg font-medium text-white">{q.question}</h3>
                  <div className="space-y-2">
                    {q.options.map((opt: string, oIdx: number) => (
                      <button
                        key={oIdx}
                        onClick={() => {
                          const newAnswers = [...stage1Answers];
                          const existingIdx = newAnswers.findIndex(a => a.question_id === q.id);
                          const answerObj: any = {
                            question_id: q.id,
                            selected_option: opt,
                            domain: q.domain
                          };
                          if (existingIdx >= 0) newAnswers[existingIdx] = answerObj;
                          else newAnswers.push(answerObj);
                          setStage1Answers(newAnswers);
                        }}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          stage1Answers.find(a => a.question_id === q.id)?.selected_option === opt
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-white/5 bg-black/20 hover:bg-white/5'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center">
                <BackButton onClick={() => setStage('domain-select')} theme={theme} />
                <button 
                  onClick={submitStage1}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  {loading ? 'Analyzing...' : 'Submit Assessment'}
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'stage2-questions' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto space-y-8 relative"
            >
              <BackButton onClick={() => setStage('stage1-result')} />
              <h2 className="text-2xl font-bold text-center text-slate-200 relative z-10">
                Aptitude & Readiness Check
              </h2>

              {stage2Questions.map((q, idx) => {
                const existing = stage2Answers.find(a => a.question_id === q.id);
                return (
                  <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-2 relative z-10">
                    <h3 className="text-lg font-medium text-white">{q.prompt}</h3>
                    {q.guidance && <p className="text-sm text-slate-400 italic">{q.guidance}</p>}
                    <textarea
                      value={existing?.answer || ''}
                      onChange={e => {
                        const newAnswers = [...stage2Answers];
                        const existingIdx = newAnswers.findIndex(a => a.question_id === q.id);
                        const answerObj: any = {
                          question_id: q.id,
                          prompt: q.prompt,
                          answer: e.target.value
                        };
                        if (existingIdx >= 0) newAnswers[existingIdx] = answerObj;
                        else newAnswers.push(answerObj);
                        setStage2Answers(newAnswers);
                      }}
                      className="w-full h-24 p-3 rounded-lg bg-black/20 text-white focus:outline-none"
                    />
                  </div>
                );
              })}

              <div className="flex justify-between items-center pt-4 relative z-10">
                <BackButton onClick={() => setStage('stage1-result')} theme={theme} />
                <button 
                  onClick={submitStage2}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  {loading ? 'Analyzing...' : 'Submit Assessment'}
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'stage1-result' && stage1Result && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-8 mt-10"
            >
              <BackButton onClick={() => setStage('stage1-questions')} label="Edit Responses" theme={theme} />
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold">Great Job! We've found your spark.</h2>
              <p className="text-slate-400 max-w-xl mx-auto">{stage1Result.message}</p>
              
              <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                {stage1Result.top_domains.map((domain: string) => (
                  <div key={domain} className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 rounded-2xl">
                    <h3 className="text-xl font-bold text-cyan-400 mb-2">{domain}</h3>
                    <div className="text-sm text-slate-500">High Compatibility</div>
                  </div>
                ))}
              </div>

              <button 
                onClick={startStage2}
                disabled={loading}
                className="px-8 py-3 bg-white text-black rounded-full font-bold mt-8 hover:scale-105 transition-transform"
              >
                {loading ? 'Preparing...' : 'Proceed to Aptitude Check'}
              </button>
            </motion.div>
          )}

          {stage === 'final-result' && finalResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12 pb-20"
            >
              <BackButton onClick={() => setStage('stage2-questions')} label="Edit Responses" theme={theme} />
              {/* Header */}
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold font-display">Your Career Blueprint</h2>
                <p className="text-slate-400">Based on your unique profile, here is your path to success.</p>
              </div>

              {/* Top Section: Domains & Score */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 bg-slate-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-4">Primary Domain</h3>
                  <div className="text-4xl font-bold text-white mb-2">{finalResult.primary_domain}</div>
                  <div className="text-lg text-cyan-400 mb-6">Secondary: {finalResult.secondary_domain}</div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${finalResult.compatibility_score}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                      />
                    </div>
                    <span className="text-2xl font-bold">{finalResult.compatibility_score}% Match</span>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-white/10 p-8 rounded-3xl backdrop-blur-xl flex flex-col justify-center items-center text-center">
                  <Target className="w-12 h-12 text-purple-400 mb-4" />
                  <div className="text-3xl font-bold text-white mb-1">{finalResult.estimated_time_to_job_ready}</div>
                  <div className="text-sm text-slate-400">Estimated Time to Job Ready</div>
                </div>
              </div>

              {/* Roadmap */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Map className="w-6 h-6 text-cyan-400" /> Strategic Roadmap
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['foundation', 'intermediate', 'advanced', 'placement_prep'].map((phase, idx) => (
                    <div key={phase} className="bg-white/5 border border-white/10 p-6 rounded-2xl relative group hover:border-cyan-500/30 transition-colors">
                      <div className="absolute top-4 right-4 text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors">0{idx + 1}</div>
                      <h4 className="text-lg font-bold capitalize mb-4 text-cyan-200">{phase.replace('_', ' ')}</h4>
                      <ul className="space-y-2">
                        {finalResult.roadmap[phase].map((item: string, i: number) => (
                          <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Courses */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-purple-400" /> Recommended Courses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {finalResult.recommended_courses.map((course: any, idx: number) => (
                    <div key={idx} className="flex gap-6 p-6 bg-slate-900/80 border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all">
                      <div className="w-24 h-24 bg-slate-800 rounded-xl flex-shrink-0 overflow-hidden">
                        <img 
                          src={`https://picsum.photos/seed/${course.title}/200/200`} 
                          alt={course.title}
                          className="w-full h-full object-cover opacity-80"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{course.title}</h4>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-4">{course.description}</p>
                        <div className="flex gap-2">
                          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/20">
                            {course.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="fixed bottom-8 right-8 flex gap-4">
                <button className="px-6 py-3 bg-slate-800 border border-white/10 rounded-full font-bold hover:bg-slate-700 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
