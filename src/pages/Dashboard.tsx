import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Zap, 
  Brain, 
  Target, 
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const data = [
  { name: 'Mon', xp: 400, focus: 240 },
  { name: 'Tue', xp: 300, focus: 139 },
  { name: 'Wed', xp: 200, focus: 980 },
  { name: 'Thu', xp: 278, focus: 390 },
  { name: 'Fri', xp: 189, focus: 480 },
  { name: 'Sat', xp: 239, focus: 380 },
  { name: 'Sun', xp: 349, focus: 430 },
];

const StatCard = ({ title, value, icon: Icon, color, trend, theme }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02, translateY: -5 }}
    className={cn(
      "p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group transition-all duration-300",
      theme === 'dark'
        ? 'bg-white/5 border border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-cyan-500/10'
        : 'bg-slate-100/50 border border-slate-200/50 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-300/10'
    )}
  >
    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500", color)} />
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className={cn(
          "text-sm font-medium",
          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
        )}>{title}</p>
        <h3 className={cn(
          "text-3xl font-bold mt-1 font-display",
          theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
        )}>{value}</h3>
      </div>
      <div className={cn(
        "p-3 rounded-xl group-hover:scale-110 transition-transform duration-300",
        theme === 'dark'
          ? 'bg-white/5 border border-white/10'
          : 'bg-slate-200/50 border border-slate-300/50',
        color.replace('bg-', 'text-')
      )}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs font-medium">
      <span className="text-emerald-400 flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        {trend}
      </span>
      <span className={cn(
        theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
      )}>vs last week</span>
    </div>
  </motion.div>
);

const BrainTwin = () => {
  return (
    <div className="relative w-full h-[300px] flex items-center justify-center group cursor-pointer">
      {/* Animated Rings */}
      <div className="absolute w-64 h-64 border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite] group-hover:border-cyan-500/40 transition-colors" />
      <div className="absolute w-48 h-48 border border-purple-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse] group-hover:border-purple-500/40 transition-colors" />
      <div className="absolute w-32 h-32 border border-emerald-500/20 rounded-full animate-[spin_8s_linear_infinite] group-hover:border-emerald-500/40 transition-colors" />
      
      {/* Core Brain */}
      <div className="relative z-10">
        <Brain className="w-24 h-24 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-pulse group-hover:scale-110 transition-transform duration-500" />
      </div>

      {/* Nodes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"
          animate={{
            x: Math.cos(i * (Math.PI / 4)) * 100,
            y: Math.sin(i * (Math.PI / 4)) * 100,
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
      
      {/* Connecting Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1="50%"
            y1="50%"
            x2={`${50 + Math.cos(i * (Math.PI / 4)) * 30}%`}
            y2={`${50 + Math.sin(i * (Math.PI / 4)) * 30}%`}
            stroke="rgba(168, 85, 247, 0.2)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </svg>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-mono text-cyan-400/80 bg-black/40 px-3 py-1 rounded-full border border-cyan-500/20 backdrop-blur-sm group-hover:bg-cyan-500/10 transition-colors">
        NEURAL SYNC: 98.4%
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const { localize, language, simplify } = useLanguage();
  const { theme } = useTheme();
  const [texts, setTexts] = useState({
    welcome: "Welcome back,",
    performance: "Your cognitive performance is peaking today.",
    analyze: "Analyze Skills",
    start: "Start Learning",
    totalXp: "Total XP",
    focusTime: "Focus Time",
    knowledgeNodes: "Knowledge Nodes",
    accuracy: "Avg. Accuracy",
    learningVelocity: "Learning Velocity",
    brainTwin: "AI Brain Twin",
    liveSync: "Live Sync",
    memoryRetention: "Memory Retention",
    cognitiveLoad: "Cognitive Load",
    optimal: "Optimal",
    high: "High"
  });

  useEffect(() => {
    const translate = async () => {
      const newTexts = { ...texts };
      // Parallelize translation requests
      const keys = Object.keys(texts) as (keyof typeof texts)[];
      await Promise.all(keys.map(async (key) => {
        newTexts[key] = await localize(texts[key]);
      }));
      setTexts(newTexts);
    };
    translate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, simplify]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className={cn(
            "text-3xl font-bold mb-2 font-display",
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          )}>
            {texts.welcome} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{user?.name || 'User'}</span>
          </h2>
          <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{texts.performance}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/assessment" className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 group border",
            theme === 'dark'
              ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border-cyan-500/20'
              : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700 border-cyan-300'
          )}>
            <Activity className="w-4 h-4 group-hover:animate-pulse" />
            {texts.analyze}
          </Link>
          <Link to="/courses" className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all hover:scale-105 flex items-center gap-2",
            theme === 'dark'
              ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/25'
              : 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/25'
          )}>
            {texts.start}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={texts.totalXp} 
          value={user?.xp?.toLocaleString() || "12,450"} 
          icon={Zap} 
          color="bg-yellow-500" 
          trend="+12%"
          theme={theme}
        />
        <StatCard 
          title={texts.focusTime} 
          value="4h 12m" 
          icon={Target} 
          color="bg-cyan-500" 
          trend="+8%"
          theme={theme}
        />
        <StatCard 
          title={texts.knowledgeNodes} 
          value="84" 
          icon={Brain} 
          color="bg-purple-500" 
          trend="+3"
          theme={theme}
        />
        <StatCard 
          title={texts.accuracy} 
          value="94%" 
          icon={Activity} 
          color="bg-emerald-500" 
          trend="+2%"
          theme={theme}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className={cn(
          "p-6 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-colors",
          theme === 'dark'
            ? 'bg-white/5 border border-white/10'
            : 'bg-slate-100/50 border border-slate-200/50'
        )}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={cn(
              "text-lg font-semibold flex items-center gap-2",
              theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
            )}>
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              {texts.learningVelocity}
            </h3>
            <select className={cn(
              "rounded-lg px-3 py-1 text-sm outline-none transition-colors",
              theme === 'dark'
                ? 'bg-black/20 border border-white/10 text-slate-400 focus:border-cyan-500/50'
                : 'bg-slate-200 border border-slate-300 text-slate-700 focus:border-cyan-500/50'
            )}>
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#ffffff10' : '#e2e8f010'} vertical={false} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
                    borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: theme === 'dark' ? '#e2e8f0' : '#1e293b' }}
                  cursor={{ stroke: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="xp" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                <Area type="monotone" dataKey="focus" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brain Twin Section */}
        <div className={cn(
          "p-6 rounded-2xl backdrop-blur-sm flex flex-col hover:border-white/20 transition-colors",
          theme === 'dark'
            ? 'bg-white/5 border border-white/10'
            : 'bg-slate-100/50 border border-slate-200/50'
        )}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={cn(
              "text-lg font-semibold flex items-center gap-2",
              theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
            )}>
              <Brain className="w-5 h-5 text-purple-400" />
              {texts.brainTwin}
            </h3>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border animate-pulse",
              theme === 'dark'
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-green-100 text-green-700 border-green-300'
            )}>
              {texts.liveSync}
            </span>
          </div>
          <div className={cn(
            "flex-1 flex items-center justify-center rounded-xl border relative overflow-hidden group",
            theme === 'dark'
              ? 'bg-black/20 border-white/5'
              : 'bg-slate-50/50 border-slate-300/30'
          )}>
             <div className={cn(
               "absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] opacity-50 group-hover:opacity-100 transition-opacity duration-500",
               theme === 'dark'
                ? 'from-purple-900/20 via-transparent to-transparent'
                : 'from-purple-200/20 via-transparent to-transparent'
             )} />
             <BrainTwin />
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{texts.memoryRetention}</span>
              <span className="text-cyan-400">{texts.high} (92%)</span>
            </div>
            <div className={cn(
              "w-full h-1.5 rounded-full overflow-hidden",
              theme === 'dark' ? 'bg-white/10' : 'bg-slate-300/30'
            )}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>{texts.cognitiveLoad}</span>
              <span className="text-purple-400">{texts.optimal}</span>
            </div>
            <div className={cn(
              "w-full h-1.5 rounded-full overflow-hidden",
              theme === 'dark' ? 'bg-white/10' : 'bg-slate-300/30'
            )}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.5, delay: 0.7 }}
                className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
