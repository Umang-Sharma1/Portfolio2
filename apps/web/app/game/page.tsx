'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery } from '@apollo/client';
import { SUBMIT_SCORE } from '@/lib/graphql/mutations';
import { GET_TODAY_LEADERBOARD } from '@/lib/graphql/queries';

const MotionDiv = motion.div as any;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================================================
// ICONS
// ============================================================================

const Icons = {
  Activity: memo(({ className }: { className?: string }) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )),
  Trophy: memo(({ className }: { className?: string }) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )),
  Keyboard: memo(({ className }: { className?: string }) => (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10" />
    </svg>
  )),
  Play: memo(({ className }: { className?: string }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )),
  RotateCcw: memo(({ className }: { className?: string }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )),
};

// ============================================================================
// CODE SNIPPETS
// ============================================================================

const CODE_SNIPPETS: Record<string, string[]> = {
  EASY: [
    'const name = "Voyager";',
    'let count = 0;',
    'function hello() { return "world"; }',
    'const arr = [1, 2, 3];',
    'if (x > 10) { return true; }',
    'console.log("Hello World");',
    'const sum = a + b;',
    'for (let i = 0; i < n; i++) {}',
    'return items.length;',
    'const isValid = true;',
  ],
  MEDIUM: [
    'const fetchData = async () => await fetch(url);',
    'const sorted = arr.sort((a, b) => a - b);',
    'export default function App({ children }) {}',
    'const [state, setState] = useState(null);',
    'useEffect(() => { loadData(); }, []);',
    'const result = items.filter(x => x.active);',
    'interface Props { name: string; age: number }',
    'const handleClick = (e: MouseEvent) => {};',
    'return new Promise((resolve) => resolve(data));',
    'const mapped = users.map(u => u.name);',
  ],
  HARD: [
    'type Result<T> = { data: T; error: null } | { data: null; error: Error };',
    'const debounce = <T extends (...args: any[]) => void>(fn: T, ms: number) => {};',
    'const memoize = (fn: Function) => { const cache = new Map(); return fn; };',
    'async function* paginate<T>(fetcher: () => Promise<T[]>) { yield data; }',
    'const pipe = (...fns: Function[]) => (x: any) => fns.reduce((v, f) => f(v), x);',
    'export const withAuth = <P extends object>(Component: React.FC<P>) => {};',
    'const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));',
    'type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };',
  ],
  EXPERT: [
    'type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;',
    'const createStore = <S>(initialState: S) => { let state = initialState; const listeners = new Set<() => void>(); };',
    'function useDebounce<T>(value: T, delay: number): T { const [debouncedValue, setDebouncedValue] = useState(value); }',
    'const exhaustiveCheck = (param: never): never => { throw new Error(`Unhandled: ${param}`); };',
    'type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;',
  ],
};

type GameState = 'IDLE' | 'COUNTDOWN' | 'PLAYING' | 'FINISHED';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');
  const [countdown, setCountdown] = useState(3);
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [snippets, setSnippets] = useState<string[]>([]);
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [username, setUsername] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [completedSnippets, setCompletedSnippets] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const GAME_DURATION = 60; // 60 seconds

  const [submitScore] = useMutation(SUBMIT_SCORE);
  const { data: leaderboardData, refetch: refetchLeaderboard } = useQuery(GET_TODAY_LEADERBOARD, {
    variables: { gameType: 'TYPING', limit: 10 },
    fetchPolicy: 'cache-and-network',
  });

  const currentSnippet = snippets[currentSnippetIndex] || '';

  const shuffleSnippets = useCallback((diff: Difficulty) => {
    const pool = CODE_SNIPPETS[diff];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setSnippets(shuffled);
  }, []);

  const startGame = useCallback(() => {
    shuffleSnippets(difficulty);
    setGameState('COUNTDOWN');
    setCountdown(3);
    setTypedText('');
    setMistakes(0);
    setTotalCharsTyped(0);
    setCorrectChars(0);
    setWpm(0);
    setAccuracy(100);
    setCurrentSnippetIndex(0);
    setCompletedSnippets(0);
    setShowSubmit(false);
    setSubmitted(false);
    setElapsed(0);
  }, [difficulty, shuffleSnippets]);

  // Countdown
  useEffect(() => {
    if (gameState !== 'COUNTDOWN') return;
    if (countdown <= 0) {
      setGameState('PLAYING');
      setStartTime(Date.now());
      inputRef.current?.focus();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [gameState, countdown]);

  // Timer during gameplay
  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const sec = Math.floor((now - startTime) / 1000);
      setElapsed(sec);
      if (sec >= GAME_DURATION) {
        setGameState('FINISHED');
      }
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, startTime]);

  // Calculate WPM + accuracy during gameplay
  useEffect(() => {
    if (gameState !== 'PLAYING' || elapsed === 0) return;
    const minutes = elapsed / 60;
    const currentWpm = Math.round(correctChars / 5 / Math.max(minutes, 0.01));
    const currentAccuracy =
      totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 100;
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
  }, [elapsed, correctChars, totalCharsTyped, gameState]);

  // Final stats on finish
  useEffect(() => {
    if (gameState === 'FINISHED') {
      if (timerRef.current) clearInterval(timerRef.current);
      const minutes = GAME_DURATION / 60;
      const finalWpm = Math.round(correctChars / 5 / minutes);
      const finalAcc =
        totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 100;
      setWpm(finalWpm);
      setAccuracy(finalAcc);
      setShowSubmit(true);
    }
  }, [gameState, correctChars, totalCharsTyped]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'PLAYING') return;
    const val = e.target.value;
    const target = currentSnippet;

    // Check if the just-typed char is correct
    const lastCharIndex = val.length - 1;
    if (val.length > typedText.length) {
      setTotalCharsTyped((p) => p + 1);
      if (val[lastCharIndex] === target[lastCharIndex]) {
        setCorrectChars((p) => p + 1);
      } else {
        setMistakes((p) => p + 1);
      }
    }

    setTypedText(val);

    // Check if snippet is complete
    if (val === target) {
      setCompletedSnippets((p) => p + 1);
      setTypedText('');
      if (currentSnippetIndex + 1 < snippets.length) {
        setCurrentSnippetIndex((p) => p + 1);
      } else {
        // All snippets done, reshuffle
        shuffleSnippets(difficulty);
        setCurrentSnippetIndex(0);
      }
    }
  };

  const handleSubmitScore = async () => {
    if (!username.trim() || submitted) return;
    try {
      const difficultyMap: Record<Difficulty, string> = {
        EASY: 'EASY',
        MEDIUM: 'MEDIUM',
        HARD: 'HARD',
        EXPERT: 'EXPERT',
      };
      await submitScore({
        variables: {
          input: {
            username: username.trim(),
            wpm,
            accuracy,
            level: { EASY: 1, MEDIUM: 2, HARD: 3, EXPERT: 4 }[difficulty],
            duration: GAME_DURATION,
            mistakes,
            gameMode: difficultyMap[difficulty],
            gameType: 'TYPING',
            isAnonymous: false,
          },
        },
      });
      setSubmitted(true);
      refetchLeaderboard();
    } catch {
      // Silently fail
    }
  };

  const timeLeft = Math.max(GAME_DURATION - elapsed, 0);
  const progress = (elapsed / GAME_DURATION) * 100;

  const difficultyConfig: Record<Difficulty, { label: string; color: string; border: string }> = {
    EASY: { label: 'EASY', color: 'text-green-400', border: 'border-green-400/30' },
    MEDIUM: { label: 'MEDIUM', color: 'text-vision-cyan', border: 'border-vision-cyan/30' },
    HARD: { label: 'HARD', color: 'text-vision-orange', border: 'border-vision-orange/30' },
    EXPERT: { label: 'EXPERT', color: 'text-vision-crimson', border: 'border-vision-crimson/30' },
  };

  return (
    <div className="relative min-h-screen py-32 px-6 overflow-hidden bg-stone-50 dark:bg-space-black transition-colors">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full cyber-grid" />
        <MotionDiv
          animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-vision-cyan/5 rounded-full blur-[160px]"
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full glassmorphism border border-vision-cyan/20 text-vision-cyan bg-vision-cyan/5">
            <Icons.Keyboard className="w-4 h-4" />
            <span className="text-[10px] font-mono font-black tracking-[0.5em] uppercase">
              Typing_Challenge
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase italic text-slate-900 dark:text-text-dark">
            Code{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-vision-cyan to-vision-orange">
              Sprint.
            </span>
          </h1>
          <p className="text-lg font-bold text-slate-600 dark:text-text-dark/40 italic max-w-md mx-auto">
            Type code snippets as fast as you can. 60 seconds. No mercy.
          </p>
        </MotionDiv>

        {/* IDLE State */}
        <AnimatePresence mode="wait">
          {gameState === 'IDLE' && (
            <MotionDiv
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Difficulty Select */}
              <div className="flex justify-center gap-4 flex-wrap">
                {(['EASY', 'MEDIUM', 'HARD', 'EXPERT'] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={cn(
                      'px-8 py-3 rounded-2xl text-[10px] font-mono font-black uppercase tracking-[0.4em] border-2 transition-all duration-300',
                      difficulty === d
                        ? `${difficultyConfig[d].color} ${difficultyConfig[d].border} bg-current/10 scale-105 shadow-lg`
                        : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/30 hover:text-slate-700 dark:hover:text-white/60'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Start Button */}
              <div className="flex justify-center">
                <button
                  onClick={startGame}
                  className="group flex items-center gap-4 px-16 py-5 rounded-[2rem] bg-vision-cyan text-space-black font-mono font-black text-sm uppercase tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(var(--glow-cyan),0.3)] hover:shadow-[0_20px_50px_rgba(var(--glow-cyan),0.4)]"
                >
                  <Icons.Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Launch_Mission
                </button>
              </div>

              {/* Leaderboard */}
              <div className="p-8 rounded-[3rem] glassmorphism border-[0.5px] border-slate-200 dark:border-white/5 shadow-xl bg-slate-50/30 dark:bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-6">
                  <Icons.Trophy className="text-vision-orange" />
                  <span className="text-[10px] font-mono font-black text-vision-orange uppercase tracking-[0.5em]">
                    Today&apos;s Leaderboard
                  </span>
                </div>
                <div className="space-y-3">
                  {leaderboardData?.todayLeaderboard?.length > 0 ? (
                    leaderboardData.todayLeaderboard.slice(0, 10).map((entry: any, i: number) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={cn(
                              'text-sm font-mono font-black w-8 text-center',
                              i === 0
                                ? 'text-vision-orange'
                                : i === 1
                                  ? 'text-slate-400'
                                  : i === 2
                                    ? 'text-amber-700'
                                    : 'text-slate-500 dark:text-white/20'
                            )}
                          >
                            #{i + 1}
                          </span>
                          <span className="text-sm font-mono font-bold text-slate-800 dark:text-text-dark">
                            {entry.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-mono font-black uppercase tracking-wider">
                          <span className="text-vision-cyan">{entry.wpm} WPM</span>
                          <span className="text-slate-400 dark:text-white/30">
                            {entry.accuracy}%
                          </span>
                          <span
                            className={cn(
                              entry.gameMode === 'EASY'
                                ? 'text-green-400'
                                : entry.gameMode === 'MEDIUM'
                                  ? 'text-vision-cyan'
                                  : entry.gameMode === 'HARD'
                                    ? 'text-vision-orange'
                                    : 'text-vision-crimson'
                            )}
                          >
                            {entry.gameMode}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-sm font-mono text-slate-400 dark:text-white/20 italic">
                      No scores yet today. Be the first!
                    </div>
                  )}
                </div>
              </div>
            </MotionDiv>
          )}

          {/* Countdown */}
          {gameState === 'COUNTDOWN' && (
            <MotionDiv
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <MotionDiv
                key={countdown}
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="text-9xl font-display font-black text-vision-cyan text-glow-cyan"
              >
                {countdown || 'GO!'}
              </MotionDiv>
              <p className="text-[10px] font-mono font-black text-slate-500 dark:text-white/20 uppercase tracking-[0.6em] mt-8">
                Prepare your fingers...
              </p>
            </MotionDiv>
          )}

          {/* Playing */}
          {gameState === 'PLAYING' && (
            <MotionDiv
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Stats Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-[2rem] glassmorphism border-[0.5px] border-slate-200 dark:border-white/5 shadow-lg">
                <div className="flex items-center gap-8">
                  <div className="space-y-1">
                    <div className="text-[8px] font-mono font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">
                      WPM
                    </div>
                    <div className="text-2xl font-display font-black text-vision-cyan tabular-nums">
                      {wpm}
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/5" />
                  <div className="space-y-1">
                    <div className="text-[8px] font-mono font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">
                      Accuracy
                    </div>
                    <div className="text-2xl font-display font-black text-vision-orange tabular-nums">
                      {accuracy}%
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/5" />
                  <div className="space-y-1">
                    <div className="text-[8px] font-mono font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">
                      Errors
                    </div>
                    <div className="text-2xl font-display font-black text-vision-crimson tabular-nums">
                      {mistakes}
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/5" />
                  <div className="space-y-1">
                    <div className="text-[8px] font-mono font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">
                      Lines
                    </div>
                    <div className="text-2xl font-display font-black text-green-400 tabular-nums">
                      {completedSnippets}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-[8px] font-mono font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">
                    Time
                  </div>
                  <div
                    className={cn(
                      'text-3xl font-display font-black tabular-nums',
                      timeLeft <= 10
                        ? 'text-vision-crimson animate-pulse'
                        : 'text-slate-900 dark:text-text-dark'
                    )}
                  >
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                <MotionDiv
                  className={cn(
                    'h-full rounded-full',
                    timeLeft <= 10
                      ? 'bg-vision-crimson shadow-[0_0_10px_rgba(var(--glow-crimson),0.5)]'
                      : 'bg-vision-cyan shadow-[0_0_10px_rgba(var(--glow-cyan),0.5)]'
                  )}
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Code Display */}
              <div className="p-8 md:p-12 rounded-[3rem] glassmorphism border-[0.5px] border-slate-200 dark:border-white/5 shadow-xl bg-slate-50/30 dark:bg-white/[0.01] relative overflow-hidden">
                {/* Corner brackets */}
                <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-vision-crimson/20 rounded-tl-lg pointer-events-none" />
                <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-vision-cyan/20 rounded-br-lg pointer-events-none" />

                {/* The code snippet to type */}
                <div
                  className="mb-8 font-mono text-lg md:text-xl leading-relaxed select-none"
                  aria-hidden="true"
                >
                  {currentSnippet.split('').map((char, i) => {
                    let colorClass = 'text-slate-400 dark:text-white/20';
                    if (i < typedText.length) {
                      colorClass =
                        typedText[i] === char
                          ? 'text-vision-cyan'
                          : 'text-vision-crimson bg-vision-crimson/20 rounded';
                    }
                    return (
                      <span
                        key={i}
                        className={cn(
                          'font-bold transition-colors duration-75',
                          colorClass,
                          i === typedText.length && 'border-l-2 border-vision-cyan animate-pulse'
                        )}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>

                {/* Hidden input for capturing text */}
                <input
                  ref={inputRef}
                  type="text"
                  value={typedText}
                  onChange={handleInput}
                  className="absolute opacity-0 w-0 h-0"
                  autoFocus
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  onBlur={() => inputRef.current?.focus()}
                />

                <div className="flex items-center gap-4 text-[9px] font-mono font-black text-slate-400 dark:text-white/15 uppercase tracking-[0.4em]">
                  <Icons.Activity className="text-vision-cyan animate-pulse w-3 h-3" />
                  <span>
                    Snippet {currentSnippetIndex + 1} / {snippets.length}
                  </span>
                  <span className="ml-auto">{difficultyConfig[difficulty].label}</span>
                </div>
              </div>

              {/* Click to focus hint */}
              <div className="text-center text-[10px] font-mono text-slate-400 dark:text-white/20 italic">
                Click anywhere on the code area to keep typing
              </div>
            </MotionDiv>
          )}

          {/* Finished */}
          {gameState === 'FINISHED' && (
            <MotionDiv
              key="finished"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Results Card */}
              <div className="p-8 md:p-12 rounded-[3rem] glassmorphism border-[0.5px] border-slate-200 dark:border-white/5 shadow-xl bg-slate-50/30 dark:bg-white/[0.01] text-center space-y-8">
                <div className="text-[10px] font-mono font-black text-vision-crimson uppercase tracking-[0.6em]">
                  Mission_Complete
                </div>
                <h2 className="text-6xl md:text-8xl font-display font-black text-slate-900 dark:text-text-dark">
                  {wpm} <span className="text-3xl text-vision-cyan">WPM</span>
                </h2>

                <div className="flex justify-center gap-12 flex-wrap">
                  <div className="space-y-1">
                    <div className="text-[9px] font-mono text-slate-400 dark:text-white/20 uppercase tracking-widest font-black">
                      Accuracy
                    </div>
                    <div className="text-3xl font-display font-black text-vision-orange">
                      {accuracy}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] font-mono text-slate-400 dark:text-white/20 uppercase tracking-widest font-black">
                      Errors
                    </div>
                    <div className="text-3xl font-display font-black text-vision-crimson">
                      {mistakes}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] font-mono text-slate-400 dark:text-white/20 uppercase tracking-widest font-black">
                      Lines
                    </div>
                    <div className="text-3xl font-display font-black text-green-400">
                      {completedSnippets}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] font-mono text-slate-400 dark:text-white/20 uppercase tracking-widest font-black">
                      Mode
                    </div>
                    <div
                      className={cn(
                        'text-3xl font-display font-black',
                        difficultyConfig[difficulty].color
                      )}
                    >
                      {difficulty}
                    </div>
                  </div>
                </div>

                {/* Grade */}
                <div className="inline-block px-8 py-3 rounded-2xl glassmorphism border border-vision-cyan/20">
                  <span className="text-[10px] font-mono font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.4em]">
                    Grade:{' '}
                  </span>
                  <span
                    className={cn(
                      'text-2xl font-display font-black',
                      wpm >= 80
                        ? 'text-vision-cyan'
                        : wpm >= 60
                          ? 'text-green-400'
                          : wpm >= 40
                            ? 'text-vision-orange'
                            : 'text-vision-crimson'
                    )}
                  >
                    {wpm >= 100 ? 'S+' : wpm >= 80 ? 'A' : wpm >= 60 ? 'B' : wpm >= 40 ? 'C' : 'D'}
                  </span>
                </div>
              </div>

              {/* Submit Score */}
              {showSubmit && !submitted && (
                <MotionDiv
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-[3rem] glassmorphism border-[0.5px] border-slate-200 dark:border-white/5 shadow-lg"
                >
                  <div className="text-[10px] font-mono font-black text-vision-cyan uppercase tracking-[0.5em] mb-6">
                    Submit to Leaderboard
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter callsign..."
                      maxLength={20}
                      className="flex-1 bg-slate-100/50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-mono font-bold text-slate-900 dark:text-text-dark placeholder:text-slate-400 dark:placeholder:text-white/15 outline-none focus:border-vision-cyan/50 transition-colors"
                    />
                    <button
                      onClick={handleSubmitScore}
                      disabled={!username.trim()}
                      className="px-8 py-4 rounded-2xl bg-vision-cyan text-space-black font-mono font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_10px_25px_rgba(var(--glow-cyan),0.2)]"
                    >
                      Submit
                    </button>
                  </div>
                </MotionDiv>
              )}

              {submitted && (
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm font-mono font-bold text-vision-cyan"
                >
                  Score submitted to the leaderboard!
                </MotionDiv>
              )}

              {/* Retry */}
              <div className="flex justify-center">
                <button
                  onClick={startGame}
                  className="group flex items-center gap-3 px-12 py-4 rounded-2xl border-2 border-vision-cyan/30 text-vision-cyan font-mono font-black text-[11px] uppercase tracking-[0.4em] hover:bg-vision-cyan/10 hover:border-vision-cyan/50 transition-all"
                >
                  <Icons.RotateCcw className="group-hover:-rotate-180 transition-transform duration-500" />
                  Try_Again
                </button>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
