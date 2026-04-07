'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ─── Voyager Signal Icon ─────────────────────────────────────────────────────
// A stylised uplink / transmission node: antenna V-base + radiating arcs + dot

const VoyagerIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Inner arc */}
    <path d="M9 13.5 A4.5 4.5 0 0 1 15 13.5" strokeWidth="1.6" />
    {/* Outer arc */}
    <path d="M6.5 11 A7.5 7.5 0 0 1 17.5 11" strokeWidth="1.4" strokeOpacity="0.7" />
    {/* Far arc */}
    <path d="M4 8.5 A10.5 10.5 0 0 1 20 8.5" strokeWidth="1.2" strokeOpacity="0.4" />
    {/* Antenna V-legs down from node */}
    <path d="M12 17.5 L8.5 21" strokeWidth="1.6" />
    <path d="M12 17.5 L15.5 21" strokeWidth="1.6" />
    {/* Node dot */}
    <circle cx="12" cy="17" r="1.6" fill="currentColor" strokeWidth="0" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Enhanced portfolio knowledge base
const KNOWLEDGE = {
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'GraphQL',
    'MongoDB',
    'Three.js',
    'Tailwind CSS',
    'Docker',
    'AWS',
    'Python',
    'PostgreSQL',
  ],
  projects: [
    {
      name: 'Portfolio Website',
      tech: 'Next.js, Three.js, GraphQL, Framer Motion',
      description: 'This immersive portfolio with Voyager OS design language',
    },
    {
      name: 'API Backend',
      tech: 'Node.js, Express, MongoDB, GraphQL',
      description:
        'Full-featured GraphQL API with authentication, analytics, and game leaderboards',
    },
  ],
  experience: [
    'Full-stack development with modern web technologies',
    'Building scalable APIs and microservices',
    'Creating immersive 3D web experiences',
    'Cloud infrastructure with AWS and Docker',
  ],
  contact:
    'You can reach out through the Contact page, connect on LinkedIn, or check out my GitHub repositories.',
  about:
    'A passionate full-stack developer focused on creating immersive digital experiences with cutting-edge web technologies. Currently open to new opportunities.',
  game: 'Try the Code Sprint typing game! Navigate to /game to test your coding speed against the leaderboard.',
  sections: {
    home: 'The home page features a 3D hero scene, skills overview with holographic cards, project showcase, experience timeline, and contact form.',
    skills:
      'The Skills page shows a comprehensive breakdown of all technologies and tools I work with, organized by category.',
    projects:
      'The Projects page displays all my work with detailed modals showing architecture, tech stack, and performance metrics.',
    contact:
      'The Contact page has a secure transmission form with real-time validation and a Voyager OS terminal aesthetic.',
  },
};

const generateResponse = (message: string): string => {
  const lower = message.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|greetings|sup|yo)\b/.test(lower)) {
    return 'GREETINGS, VOYAGER. Welcome to Mission Control. I can brief you on: Skills, Projects, Experience, Contact info, or help you Navigate the site. What sector?';
  }

  // Skills
  if (/skill|tech|stack|language|framework|tool/.test(lower)) {
    return `SKILL MATRIX — Core Arsenal: ${KNOWLEDGE.skills.join(' · ')}. Navigate to the Skills sector for the full manifest.`;
  }

  // Projects
  if (/project|work|portfolio|build|made|create/.test(lower)) {
    return `PROJECT DATABASE — ${KNOWLEDGE.projects.map((p) => `${p.name} [${p.tech}]`).join(' | ')}. Open the Projects sector for architecture details and live demos.`;
  }

  // Experience
  if (/experience|background|career|job|history/.test(lower)) {
    return `FLIGHT LOG — ${KNOWLEDGE.experience.join(' · ')}. Check the Timeline section on the home page for the full career trajectory.`;
  }

  // Contact
  if (/contact|reach|hire|email|connect|message/.test(lower)) {
    return `COMM CHANNEL — ${KNOWLEDGE.contact} Navigate to /contact for the secure transmission form.`;
  }

  // About
  if (/who|about|tell me|yourself|you/.test(lower)) {
    return `VOYAGER PROFILE — ${KNOWLEDGE.about}`;
  }

  // Game
  if (/game|play|typing|speed|challenge|sprint/.test(lower)) {
    return `MISSION AVAILABLE — ${KNOWLEDGE.game}`;
  }

  // Navigation
  if (/navigate|go to|where|find|page|section|home/.test(lower)) {
    return 'NAVIGATION — Home (/) · Skills (/skills) · Projects (/projects) · Contact (/contact) · Code Sprint (/game). The home page has sections: Hero, Skills Overview, Projects, Timeline, and Contact.';
  }

  // Design
  if (/design|theme|ui|ux|style|voyager/.test(lower)) {
    return 'DESIGN SYSTEM — Voyager OS uses: vision-cyan (#22D3EE), vision-crimson (#E11D48), vision-orange (#FB923C). Features glassmorphism, corner brackets, mono typography, and a space-command aesthetic throughout.';
  }

  // Help
  if (/help|command|option|what can/.test(lower)) {
    return 'MISSION CONTROL — Available queries: Skills · Projects · Experience · Contact · About · Game · Navigation · Design. Ask anything about the portfolio!';
  }

  // Thank you
  if (/thank|thanks|cheers|appreciate/.test(lower)) {
    return 'ACKNOWLEDGED. Happy to assist, Voyager. Any other sector to explore?';
  }

  return 'SIGNAL RECEIVED. I can provide intel on: Skills · Projects · Experience · Contact · About · Game · Navigation. What interests you, Voyager?';
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

    const response = generateResponse(userMessage.content);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const quickQuestions = [
    'What skills do you have?',
    'Tell me about projects',
    'How can I contact you?',
    'Play CodeSprint',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* ── Chat Window ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-20 right-0 w-[22rem] md:w-[26rem] overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(34,211,238,0.1)] bg-[#050810] border border-white/[0.06]"
          >
            {/* Scan grid overlay */}
            <div className="absolute inset-0 cyber-grid opacity-[0.06] pointer-events-none" />

            {/* HUD corner brackets */}
            <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-vision-cyan/40 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-4 right-16 w-5 h-5 border-t-2 border-r-2 border-vision-crimson/30 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-[70px] left-4 w-5 h-5 border-b-2 border-l-2 border-vision-cyan/20 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-[70px] right-4 w-5 h-5 border-b-2 border-r-2 border-vision-crimson/20 rounded-br-lg pointer-events-none" />

            {/* ── Header ── */}
            <div className="relative px-5 py-4 border-b border-white/[0.06] bg-black/50 backdrop-blur-xl">
              {/* Gradient accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-vision-cyan/40 to-transparent" />

              <div className="flex items-center justify-between">
                {/* Left: Logo + info */}
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-vision-cyan/20 to-black/60 border border-vision-cyan/30 flex items-center justify-center shadow-[0_0_16px_rgba(34,211,238,0.2)]">
                    <span className="text-[13px] font-display font-black italic text-vision-cyan relative z-10">
                      V
                    </span>
                    {/* Online dot */}
                    <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-[#050810] shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                  </div>

                  <div>
                    <div className="text-[9px] font-mono font-black tracking-[0.4em] uppercase text-white/70 mb-1">
                      Mission Control
                    </div>
                    {/* Signal waveform bars */}
                    <div className="flex items-end gap-[2.5px] h-3.5">
                      {[3, 7, 5, 10, 4, 8, 5, 3, 7].map((h, i) => (
                        <div
                          key={i}
                          className="w-[2px] rounded-full bg-vision-cyan origin-bottom"
                          style={{
                            height: `${h}px`,
                            animation: `audioBar 1.2s ease-in-out infinite`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                      <span className="ml-1.5 text-[7px] font-mono text-vision-cyan/60 tracking-wider self-end pb-px">
                        UPLINK ACTIVE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: session ID + close */}
                <div className="flex items-center gap-2">
                  <div className="text-[7px] font-mono text-white/20 tracking-wider">
                    SID#{sessionId}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-7 w-7 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-vision-crimson/20 hover:border-vision-crimson/40 flex items-center justify-center text-white/30 hover:text-vision-crimson transition-all"
                    aria-label="Close"
                  >
                    <XIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {/* Empty state */}
              {messages.length === 0 && (
                <div className="text-center py-6 space-y-5">
                  {/* Orbital animation */}
                  <div className="relative w-14 h-14 mx-auto">
                    <div
                      className="absolute inset-0 rounded-full border border-vision-cyan/25 animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                    <div
                      className="absolute inset-[4px] rounded-full border border-vision-crimson/20 animate-spin"
                      style={{ animationDuration: '5s', animationDirection: 'reverse' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[13px] font-display font-black italic text-vision-cyan">
                        V
                      </span>
                    </div>
                    {/* Orbit dot */}
                    <div
                      className="absolute w-2 h-2 rounded-full bg-vision-cyan shadow-[0_0_6px_rgba(34,211,238,0.9)] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin"
                      style={{ animationDuration: '3.5s', transformOrigin: '0 28px' }}
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-mono font-black text-white/20 tracking-[0.4em] uppercase">
                      Voyager OS // v2.1
                    </p>
                    <p className="text-[10px] font-mono text-white/35 mt-1">
                      Mission Control Online — awaiting query
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 px-2">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="text-left text-[9px] px-3 py-2 rounded-xl font-mono font-black uppercase tracking-wider border border-vision-cyan/10 text-white/30 hover:text-vision-cyan hover:bg-vision-cyan/[0.06] hover:border-vision-cyan/30 transition-all flex items-center gap-2"
                      >
                        <span className="text-vision-cyan/40 text-[10px]">&gt;</span>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message list */}
              {messages.map((msg) => (
                <MotionDiv
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, x: msg.role === 'user' ? 6 : -6 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}
                >
                  {/* Label row */}
                  <div
                    className={cn(
                      'flex items-center gap-1.5 mb-1 px-1',
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <span className="text-[7px] font-mono font-black tracking-[0.3em] uppercase text-white/25">
                      {msg.role === 'user' ? '» YOU' : 'V// CTRL'}
                    </span>
                    <span className="text-[6px] font-mono text-white/15">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </span>
                  </div>

                  {/* Bubble */}
                  <div
                    className={cn(
                      'max-w-[88%] px-4 py-3 text-[11px] font-mono leading-[1.6]',
                      msg.role === 'user'
                        ? 'bg-vision-cyan/15 border border-vision-cyan/25 text-white/85 rounded-[1.2rem] rounded-br-md shadow-[0_0_20px_rgba(34,211,238,0.06)]'
                        : 'bg-white/[0.03] border border-white/[0.06] border-l-2 border-l-vision-cyan/35 text-white/60 rounded-[1.2rem] rounded-bl-md'
                    )}
                  >
                    {msg.content}
                  </div>
                </MotionDiv>
              ))}

              {/* Typing indicator — frequency bars */}
              {isTyping && (
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start"
                >
                  <div className="bg-white/[0.03] border border-white/[0.06] border-l-2 border-l-vision-cyan/35 px-4 py-3 rounded-[1.2rem] rounded-bl-md">
                    <div className="flex items-end gap-[3px] h-4">
                      {[3, 7, 5, 9, 4, 8, 3, 6, 4].map((h, i) => (
                        <div
                          key={i}
                          className="w-[2px] rounded-full bg-vision-cyan/60 origin-bottom"
                          style={{
                            height: `${h}px`,
                            animation: `audioBar 0.9s ease-in-out infinite`,
                            animationDelay: `${i * 0.07}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </MotionDiv>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ── */}
            <form
              onSubmit={handleSubmit}
              className="relative p-3 bg-black/40 border-t border-white/[0.05] flex gap-2 items-center"
            >
              {/* Gradient top line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-vision-cyan/20 to-transparent" />

              <div className="flex-1 relative flex items-center">
                <span className="absolute left-3 text-vision-cyan/40 font-mono text-[11px] font-black select-none pointer-events-none">
                  &gt;
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter query..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-vision-cyan/40 rounded-xl pl-7 pr-4 py-2.5 text-[11px] font-mono text-white/80 placeholder-white/20 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="h-10 px-3.5 bg-vision-cyan/10 border border-vision-cyan/20 hover:bg-vision-cyan/20 hover:border-vision-cyan/40 rounded-xl flex items-center gap-1.5 text-vision-cyan disabled:opacity-20 disabled:cursor-not-allowed transition-all text-[8px] font-mono font-black tracking-wider whitespace-nowrap"
              >
                <SendIcon />
                <span>SEND</span>
              </button>
            </form>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* ── Toggle Beacon Button ──────────────────────────── */}
      {/* Wrapper sized to contain the hexagon (56×56 ≈ w-14×h-14 but hex needs no overflow) */}
      <div className="relative w-[60px] h-[60px] flex items-center justify-center">
        {/* Soft glow bloom behind hex — animates breathing */}
        <MotionDiv
          animate={
            isOpen
              ? { opacity: 0.35, scale: 1 }
              : { opacity: [0.25, 0.55, 0.25], scale: [1, 1.2, 1] }
          }
          transition={{ duration: 2.8, repeat: isOpen ? 0 : Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 blur-xl pointer-events-none"
          style={{
            background: isOpen
              ? 'radial-gradient(circle, rgba(225,29,72,0.55) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(34,211,238,0.55) 0%, transparent 70%)',
          }}
        />

        {/* Hexagon button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-[52px] h-[52px] flex items-center justify-center bg-[#050810] overflow-hidden"
          style={{
            clipPath: 'polygon(50% 0%, 97% 25%, 97% 75%, 50% 100%, 3% 75%, 3% 25%)',
          }}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {/* Hex SVG border — drawn inside so it's not clipped */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 52 52">
            <polygon
              points="26,1 51,14 51,38 26,51 1,38 1,14"
              fill="none"
              stroke={isOpen ? 'rgba(225,29,72,0.45)' : 'rgba(34,211,238,0.35)'}
              strokeWidth="1"
            />
          </svg>

          {/* Inner radial tint */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isOpen
                ? 'radial-gradient(circle at 50% 50%, rgba(225,29,72,0.08) 0%, transparent 70%)'
                : 'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.07) 0%, transparent 70%)',
            }}
          />

          <AnimatePresence mode="wait">
            {isOpen ? (
              <MotionDiv
                key="x"
                initial={{ rotate: -60, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 60, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="text-vision-crimson relative z-10"
              >
                <XIcon />
              </MotionDiv>
            ) : (
              <MotionDiv
                key="icon"
                initial={{ rotate: 60, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -60, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="text-vision-cyan relative z-10 drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]"
              >
                <VoyagerIcon />
              </MotionDiv>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};
