'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// Inline SVG icons
const MessageSquareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
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
    width="14"
    height="14"
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
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-20 right-0 w-80 md:w-96 overflow-hidden rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/10 bg-white dark:bg-space-black glassmorphism"
          >
            {/* Header */}
            <div className="p-4 px-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-black/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-xl bg-vision-cyan/10 flex items-center justify-center text-vision-cyan border border-vision-cyan/20">
                  <span className="text-[10px] font-display font-black italic">V</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono font-black tracking-[0.3em] uppercase text-slate-800 dark:text-text-dark">
                    Mission Control
                  </div>
                  <div className="flex items-center gap-1.5 text-[8px] font-mono font-black text-vision-cyan tracking-widest uppercase">
                    <div className="w-1.5 h-1.5 bg-vision-cyan rounded-full animate-pulse" />
                    Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-400 dark:text-white/30 hover:text-vision-crimson"
                aria-label="Close chat"
              >
                <XIcon />
              </button>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center py-6 space-y-4">
                  <div className="text-3xl">🛸</div>
                  <p className="text-xs font-mono font-bold text-slate-500 dark:text-white/30">
                    Welcome, Voyager. How can I assist?
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="text-[9px] px-3 py-1.5 rounded-full font-mono font-black uppercase tracking-wider border border-vision-cyan/20 text-vision-cyan/60 hover:text-vision-cyan hover:bg-vision-cyan/10 hover:border-vision-cyan/40 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <MotionDiv
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] px-4 py-3 text-xs font-mono font-bold leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-vision-cyan text-space-black rounded-[1.2rem] rounded-br-md shadow-[0_4px_12px_rgba(var(--glow-cyan),0.2)]'
                        : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-text-dark/80 border border-slate-200 dark:border-white/5 rounded-[1.2rem] rounded-bl-md'
                    )}
                  >
                    {msg.content}
                  </div>
                </MotionDiv>
              ))}

              {isTyping && (
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 px-4 py-3 rounded-[1.2rem] rounded-bl-md">
                    <div className="flex gap-1.5">
                      {[0, 150, 300].map((delay) => (
                        <span
                          key={delay}
                          className="w-1.5 h-1.5 bg-vision-cyan rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </MotionDiv>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-slate-50/80 dark:bg-black/30 border-t border-slate-100 dark:border-white/5 flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter command..."
                className="flex-1 bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-slate-800 dark:text-text-dark placeholder-slate-400 dark:placeholder-white/15 focus:outline-none focus:border-vision-cyan/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-vision-cyan text-space-black rounded-xl flex items-center justify-center hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-[0_4px_12px_rgba(var(--glow-cyan),0.2)]"
              >
                <SendIcon />
              </button>
            </form>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-vision-cyan border border-vision-cyan/20 shadow-[0_0_25px_rgba(var(--glow-cyan),0.15)] hover:border-vision-cyan/40 transition-all glassmorphism bg-white/80 dark:bg-space-black/80 backdrop-blur-xl"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <XIcon /> : <MessageSquareIcon />}
        </motion.div>
      </motion.button>
    </div>
  );
};
