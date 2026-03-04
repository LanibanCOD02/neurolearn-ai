import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, ShieldCheck, User, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ParallaxStarsBackground from '@/components/ParallaxStarsBackground';

export default function Login() {
  const { login } = useAuth();
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'invigilating' | 'verified' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('invigilating');
    setErrorMessage('');
    
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await login(email, password, role);
      setStatus('verified');
    } catch (err) {
      setStatus('error');
      if (role === 'admin') {
        setErrorMessage('Unauthorised attempt for teacher dashboard');
      } else {
        setErrorMessage('Wrong username or password retry again !!');
      }
      // Reset after error
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <ParallaxStarsBackground className="flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse" />
         <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto"
      >
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="NeuroLearn AI" className="h-32 w-auto object-contain mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          <p className="text-slate-400 text-sm tracking-widest uppercase">System Access Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4 p-1 bg-black/20 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                role === 'student' 
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                role === 'admin' 
                  ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Teacher
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="email" 
                placeholder="Identity / Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-200 outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="password" 
                placeholder="Access Code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-200 outline-none focus:border-purple-500/50 focus:bg-purple-500/5 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={status === 'invigilating' || status === 'verified'}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Initialize Session
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </form>

        {/* Status Overlay */}
        <AnimatePresence>
          {status !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-3xl p-6 text-center"
            >
              {status === 'invigilating' && (
                <>
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full" />
                    <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin" />
                    <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-cyan-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Invigilating Credentials</h3>
                  <p className="text-slate-400 text-sm font-mono animate-pulse">Verifying identity...</p>
                </>
              )}

              {status === 'verified' && (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {role === 'admin' ? 'Verified Admin' : 'Verified Student'}
                  </h3>
                  <p className="text-green-400 text-sm font-mono">
                    Redirecting to {role === 'admin' ? 'Teacher Dashboard' : 'Student Dashboard'}...
                  </p>
                </>
              )}

              {status === 'error' && (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6"
                  >
                    <XCircle className="w-12 h-12 text-red-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
                  <p className="text-red-400 text-sm font-bold px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
                    {errorMessage}
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ParallaxStarsBackground>
  );
}
