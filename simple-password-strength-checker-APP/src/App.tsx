/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, ShieldCheck, ShieldAlert, ShieldX, ArrowRight, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type StrengthLevel = 'Weak' | 'Medium' | 'Strong';

interface EvaluationResult {
  level: StrengthLevel;
  issues: string[];
  recommendations: string[];
  score: number;
}

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<{ cmd: string; result: EvaluationResult }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const evaluatePassword = (password: string): EvaluationResult => {
    const rules = [
      { name: 'Length (8+)', check: (p: string) => p.length >= 8 },
      { name: 'Uppercase', check: (p: string) => /[A-Z]/.test(p) },
      { name: 'Lowercase', check: (p: string) => /[a-z]/.test(p) },
      { name: 'Numbers', check: (p: string) => /[0-9]/.test(p) },
      { name: 'Special Characters', check: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
    ];

    const results = rules.map(rule => ({ name: rule.name, passed: rule.check(password) }));
    const score = results.filter(r => r.passed).length;
    const issues = results.filter(r => !r.passed).map(r => r.name);

    let level: StrengthLevel = 'Weak';
    if (score >= 5) level = 'Strong';
    else if (score >= 3) level = 'Medium';

    const recommendations: string[] = [];
    if (password.length < 10) recommendations.push('Increase length to 10+ characters.');
    if (issues.includes('Special Characters') || issues.includes('Numbers')) {
      recommendations.push('Add symbols and numbers for complexity.');
    }
    if (issues.includes('Uppercase') || issues.includes('Lowercase')) {
      recommendations.push('Mix upper and lower case letters.');
    }

    return { level, issues, recommendations, score };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const evalResult = evaluatePassword(input);
    setResult(evalResult);
    setHistory(prev => [{ cmd: input, result: evalResult }, ...prev].slice(0, 5));
    setInput('');
  };

  const getStrengthColor = (level: StrengthLevel) => {
    switch (level) {
      case 'Strong': return 'text-emerald-400';
      case 'Medium': return 'text-amber-400';
      case 'Weak': return 'text-rose-400';
    }
  };

  const getShieldIcon = (level: StrengthLevel) => {
    switch (level) {
      case 'Strong': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'Medium': return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'Weak': return <ShieldX className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono p-4 md:p-8 selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl font-bold tracking-tight uppercase">Security Terminal v1.0.4</h1>
          </div>
          <p className="text-xs text-white/40 italic">Simple Password Strength Checker — Lightweight & Educational</p>
        </header>

        {/* Main Terminal Window */}
        <div className="bg-[#141414] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
          {/* Window Controls */}
          <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            <span className="ml-2 text-[10px] uppercase tracking-widest text-white/20 font-bold">bash — password_check.py</span>
          </div>

          <div className="p-6 space-y-6">
            {/* Input Section */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-3 text-emerald-500">
                <span className="font-bold">user@cyber-tool:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="enter password..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/10"
                  autoFocus
                />
              </div>
              <p className="text-[10px] text-white/20 mt-2 uppercase tracking-tighter">Press Enter to evaluate</p>
            </form>

            {/* Current Result */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={result.score + result.level}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 border-l-2 border-white/5 pl-6 py-2"
                >
                  <div className="flex items-center gap-3">
                    {getShieldIcon(result.level)}
                    <span className="text-sm uppercase tracking-widest font-bold">Analysis Complete</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] uppercase text-white/30 mb-1">Strength Level</p>
                      <p className={`text-2xl font-bold ${getStrengthColor(result.level)}`}>
                        {result.level}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-white/30 mb-1">Security Score</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 w-8 rounded-full transition-colors duration-500 ${
                              i <= result.score ? getStrengthColor(result.level).replace('text-', 'bg-') : 'bg-white/5'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {result.issues.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase text-white/30 mb-2">Detected Issues</p>
                      <ul className="space-y-1">
                        {result.issues.map((issue) => (
                          <li key={issue} className="text-xs text-rose-400/80 flex items-center gap-2">
                            <span className="w-1 h-1 bg-rose-400 rounded-full" />
                            Missing: {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.recommendations.length > 0 && (
                    <div className="bg-white/5 p-4 rounded border border-white/5">
                      <p className="text-[10px] uppercase text-white/30 mb-2">Recommendations</p>
                      <ul className="space-y-1">
                        {result.recommendations.map((rec) => (
                          <li key={rec} className="text-xs text-emerald-400/80 flex items-center gap-2">
                            <ArrowRight className="w-3 h-3" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* History */}
            {history.length > 0 && (
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] uppercase text-white/20 mb-4 flex items-center gap-2">
                  <RefreshCcw className="w-3 h-3" />
                  Session History
                </p>
                <div className="space-y-3 opacity-50 hover:opacity-100 transition-opacity">
                  {history.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs border-b border-white/5 pb-2 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white/20">#</span>
                        <span className="text-white/40 truncate max-w-[150px]">{item.cmd}</span>
                      </div>
                      <span className={getStrengthColor(item.result.level)}>{item.result.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-white/5 rounded bg-white/2">
            <p className="text-[10px] uppercase text-white/30 mb-1">Ruleset</p>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Length, Case, Numbers, Symbols.
            </p>
          </div>
          <div className="p-4 border border-white/5 rounded bg-white/2">
            <p className="text-[10px] uppercase text-white/30 mb-1">Environment</p>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Python 3.x Logic Simulator
            </p>
          </div>
          <div className="p-4 border border-white/5 rounded bg-white/2">
            <p className="text-[10px] uppercase text-white/30 mb-1">Status</p>
            <p className="text-[11px] text-emerald-500/50 leading-relaxed flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              System Operational
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
