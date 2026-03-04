import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  FlaskConical, 
  Bot, 
  User, 
  Settings, 
  LogOut,
  BrainCircuit,
  Activity,
  Compass,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ParallaxStarsBackground from './ParallaxStarsBackground';
import { useAuth } from '@/context/AuthContext';
import { useCareerStage } from '@/context/CareerStageContext';
import { useTheme } from '@/context/ThemeContext';
import LanguageSelector from './LanguageSelector';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Compass, label: 'Career Guidance', path: '/career-guidance' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: Activity, label: 'Assessment', path: '/assessment' },
  { icon: FlaskConical, label: 'Virtual Labs', path: '/labs' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { stage } = useCareerStage();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect if not authenticated (simple check)
  React.useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, location, navigate]);

  if (!isAuthenticated) return <>{children}</>;

  return (
    <div className={cn(
      "flex h-screen overflow-hidden font-sans selection:bg-cyan-500/30 relative",
      theme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-white text-slate-900'
    )}>
      <div className="absolute inset-0 z-0">
        <ParallaxStarsBackground speed={0.5} />
      </div>
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: sidebarOpen ? 256 : 64, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "flex-shrink-0 backdrop-blur-xl flex flex-col z-30 relative overflow-hidden",
          theme === 'dark'
            ? 'border-r border-white/10 bg-slate-900/50'
            : 'border-r border-slate-200 bg-slate-50'
        )}
      >
        {/* Fixed NeuroLearn Header with Toggle */}
        <div className={cn(
          "z-40 p-3 flex items-center justify-between gap-2 flex-shrink-0 h-16",
          theme === 'dark'
            ? 'border-b border-white/10'
            : 'border-b border-slate-200'
        )}>
          <div className="flex items-center gap-3 flex-1 min-w-0 justify-center">
            {sidebarOpen ? (
              <>
                <img src="/logo.png" alt="NeuroLearn" className="h-8 w-auto object-contain" />
                <span className={cn(
                  "font-bold text-sm truncate tracking-wide",
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                )}>NeuroLearn</span>
              </>
            ) : (
              <img src="/logo.png" alt="NeuroLearn" className="h-6 w-auto object-contain" />
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-300 hover:text-white flex-shrink-0"
            title={sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                title={!sidebarOpen ? item.label : ''}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden whitespace-nowrap ${
                  isActive 
                    ? "text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] border border-cyan-500/20" 
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-cyan-500/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 relative z-10 transition-transform duration-300 flex-shrink-0 group-hover:scale-110", isActive && "animate-pulse")} />
                {sidebarOpen && <span className="font-medium relative z-10 tracking-wide">{item.label}</span>}
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            );
          })}
          
          {/* Career Navigation Submenu */}
          {location.pathname === '/career-guidance' && sidebarOpen && stage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/10 space-y-2"
            >
              <p className="text-xs font-bold text-slate-500 uppercase px-4 mb-3">Career Steps</p>
              {[
                { id: 'intro', label: 'Intro' },
                { id: 'domain-select', label: 'Domain Select' },
                { id: 'stage1-questions', label: 'Finding Yourself' },
                { id: 'stage1-result', label: 'Results' },
                { id: 'stage2-questions', label: 'Aptitude Check' },
                { id: 'final-result', label: 'Career Path' }
              ].map(step => (
                <div key={step.id} className="relative">
                  <button
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      stage === step.id
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {stage === step.id && <ChevronRight className="w-4 h-4" />}
                    <span>{step.label}</span>
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </nav>

        {user?.role === 'admin' && sidebarOpen && (
          <div className="px-4 mt-2">
            <Link
              to="/teacher"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                location.pathname === '/teacher'
                  ? "text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)] border border-purple-500/20"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
              )}
            >
              <BrainCircuit className={cn("w-5 h-5 relative z-10 transition-transform duration-300 flex-shrink-0", location.pathname === '/teacher' && "animate-pulse")} />
              <span className="font-medium relative z-10 tracking-wide">Teacher</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        )}

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <header className={cn(
          "h-16 flex items-center justify-between px-4 sm:px-8 backdrop-blur-md z-20",
          theme === 'dark'
            ? 'border-b border-white/10 bg-slate-900/30'
            : 'border-b border-slate-200 bg-slate-50/50'
        )}>
          <div className="flex items-center gap-4">
            <h1 className={cn(
              "text-lg font-medium font-display tracking-wider",
              theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
            )}>
              {sidebarItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSelector />
            <button
              onClick={toggleTheme}
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 group",
                theme === 'dark'
                  ? 'bg-slate-800 border-white/10 hover:bg-slate-700 hover:border-yellow-500/30'
                  : 'bg-slate-200 border-slate-300 hover:bg-slate-100 hover:border-yellow-500/30'
              )}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-400 group-hover:rotate-90 transition-transform duration-500" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 group-hover:rotate-90 transition-transform duration-500" />
              )}
            </button>
            <div className={cn(
              "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm",
              theme === 'dark'
                ? 'bg-white/5 border border-white/10'
                : 'bg-slate-200/50 border border-slate-300'
            )}>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className={cn(
                "text-xs font-medium",
                theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
              )}>System Online</span>
            </div>
            <button className={cn(
              "w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 group",
              theme === 'dark'
                ? 'bg-slate-800 border-white/10 hover:bg-slate-700 hover:border-cyan-500/30'
                : 'bg-slate-200 border-slate-300 hover:bg-slate-100 hover:border-cyan-500/30'
            )}>
              <Settings className={cn(
                "w-4 h-4 group-hover:rotate-90 transition-transform duration-500",
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              )} />
            </button>
            <div className={cn(
              "hidden sm:flex items-center gap-3 pl-3 sm:pl-4",
              theme === 'dark' ? 'border-l border-white/10' : 'border-l border-slate-300'
            )}>
              <div className="text-right hidden sm:block">
                <div className={cn(
                  "text-sm font-medium",
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                )}>{user?.name}</div>
                <div className={cn(
                  "text-xs capitalize",
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                )}>{user?.role} • Lvl {user?.level}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 border border-white/20 shadow-lg shadow-purple-500/20" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className={cn(
          "flex-1 overflow-y-auto p-8 z-10",
          theme === 'dark'
            ? 'scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent'
            : 'scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-50/50'
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
