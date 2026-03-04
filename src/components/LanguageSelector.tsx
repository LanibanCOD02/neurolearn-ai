import React, { useState, useEffect } from 'react';
import { useLanguage, languages } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { Globe, BookOpen, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LanguageSelector() {
  const { language, setLanguage, simplify, setSimplify } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm hover:transition-colors",
          theme === 'dark'
            ? 'bg-white/5 border border-white/10 hover:bg-white/10'
            : 'bg-slate-200/50 border border-slate-300/50 hover:bg-slate-200/70'
        )}
      >
        <Globe className="w-4 h-4 text-cyan-400" />
        <span className={cn(
          "text-xs font-medium uppercase",
          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
        )}>{language}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={cn(
              "absolute top-full right-0 mt-2 w-64 backdrop-blur-xl rounded-xl shadow-2xl p-4 flex flex-col gap-4",
              theme === 'dark'
                ? 'bg-slate-900/95 border border-white/10'
                : 'bg-slate-50/95 border border-slate-300/30'
            )}
          >
            <div>
              <h4 className={cn(
                "text-xs font-bold uppercase mb-2 tracking-wider",
                theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
              )}>Language</h4>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors flex items-center justify-between",
                      language === lang.code 
                        ? (theme === 'dark'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-cyan-100 text-cyan-700 border border-cyan-300/50'
                          )
                        : (theme === 'dark'
                            ? 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                          )
                    )}
                  >
                    {lang.name}
                    {language === lang.code && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            <div className={cn(
              "pt-4",
              theme === 'dark' ? 'border-t border-white/10' : 'border-t border-slate-300/30'
            )}>
              <h4 className={cn(
                "text-xs font-bold uppercase mb-2 tracking-wider",
                theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
              )}>Accessibility</h4>
              <button
                onClick={() => setSimplify(!simplify)}
                className={cn(
                  "w-full px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors flex items-center justify-between",
                  simplify
                    ? (theme === 'dark'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-purple-100 text-purple-700 border border-purple-300/50'
                      )
                    : (theme === 'dark'
                        ? 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                      )
                )}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Simplify Content</span>
                </div>
                {simplify && <Check className="w-3 h-3" />}
              </button>
              <p className={cn(
                "text-[10px] mt-2 leading-relaxed",
                theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
              )}>
                Automatically simplifies complex terms for easier understanding. Ideal for beginners.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
