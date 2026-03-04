import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Award, Settings, Zap, Target } from 'lucide-react';

const badges = [
  { id: 1, name: 'Quantum Pioneer', icon: '⚛️', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 2, name: 'Neural Architect', icon: '🧠', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 3, name: 'Code Ninja', icon: '💻', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 4, name: 'Focus Master', icon: '🎯', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
];

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-white/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 p-8 flex items-end gap-6 translate-y-1/2 z-10">
          <div className="w-32 h-32 rounded-full border-4 border-slate-950 bg-slate-900 overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-500/0 transition-colors duration-300" />
            <User className="w-full h-full p-6 text-slate-400" />
          </div>
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white">Demo User</h2>
            <p className="text-slate-400">Level 5 • Neural Explorer</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
        {/* Stats */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Progress Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Level Progress</span>
                  <span className="text-slate-200">1,250 / 2,000 XP</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '62.5%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-black/20 rounded-xl border border-white/5 text-center">
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Courses</div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl border border-white/5 text-center">
                  <div className="text-2xl font-bold text-white">84%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Accuracy</div>
                </div>
                <div className="p-4 bg-black/20 rounded-xl border border-white/5 text-center">
                  <div className="text-2xl font-bold text-white">45h</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Time</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Badges Collection
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className={`p-4 rounded-xl border ${badge.color} flex flex-col items-center justify-center gap-2 aspect-square cursor-pointer transition-shadow hover:shadow-lg`}
                >
                  <span className="text-3xl filter drop-shadow-md">{badge.icon}</span>
                  <span className="text-xs font-medium text-center">{badge.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings / Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-400" />
              Preferences
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Notifications</span>
                <div className="w-10 h-6 bg-cyan-500/20 rounded-full relative border border-cyan-500/30">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Sound Effects</span>
                <div className="w-10 h-6 bg-cyan-500/20 rounded-full relative border border-cyan-500/30">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Public Profile</span>
                <div className="w-10 h-6 bg-slate-700 rounded-full relative border border-white/10">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full" />
                </div>
              </label>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Danger Zone
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Irreversible actions related to your account data.
            </p>
            <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
