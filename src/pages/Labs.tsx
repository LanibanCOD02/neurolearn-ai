import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Play, Save, Settings, Code2, FlaskConical } from 'lucide-react';

export default function Labs() {
  const [code, setCode] = useState(`// Quantum Circuit Simulation
function createQubit() {
  return {
    state: [1, 0], // |0>
    measure: () => Math.random() > 0.5 ? 1 : 0
  };
}

const q1 = createQubit();
console.log("Qubit created in state |0>");
console.log("Measurement:", q1.measure());`);

  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const runCode = () => {
    setRunning(true);
    setOutput([]);
    
    // Mock execution
    setTimeout(() => {
      setOutput([
        "> Initializing Quantum Environment...",
        "> Allocating Qubits...",
        "> Applying Hadamard Gate...",
        "> Measurement Result: |1>",
        "> Simulation Complete (12ms)"
      ]);
      setRunning(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Editor */}
      <div className="lg:col-span-2 flex flex-col bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <span className="font-medium text-slate-200">main.js</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
              <Save className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={runCode}
              disabled={running}
              className="flex items-center gap-2 px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              Run
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full bg-[#0f172a] text-slate-300 font-mono text-sm p-6 resize-none outline-none leading-relaxed selection:bg-cyan-500/30"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Output / Visualization */}
      <div className="flex flex-col gap-6">
        <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-200 text-sm">Console Output</span>
          </div>
          <div className="flex-1 p-4 font-mono text-sm space-y-2 overflow-y-auto">
            {output.length === 0 && !running && (
              <span className="text-slate-600 italic">Ready to execute...</span>
            )}
            {running && (
              <div className="flex items-center gap-2 text-cyan-400">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                Compiling...
              </div>
            )}
            {output.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-green-400"
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="h-64 bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <FlaskConical className="w-6 h-6 text-purple-400 opacity-50" />
          </div>
          <h3 className="font-semibold text-slate-200 mb-2">Visualizer</h3>
          <div className="flex items-center justify-center h-full">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-2 border-dashed border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 border-2 border-dashed border-purple-500/30 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
