'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Inline SVG icons to avoid dependency issues
const MessageSquareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
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
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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
    fill="currentColor"
    stroke="none"
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Portfolio knowledge base for smart responses
const PORTFOLIO_KNOWLEDGE = {
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
  ],
  projects: [
    {
      name: 'Portfolio Website',
      tech: 'Next.js, Three.js, GraphQL',
      description: 'This very website you are exploring',
    },
    {
      name: 'API Backend',
      tech: 'Node.js, Express, MongoDB',
      description: 'RESTful and GraphQL API services',
    },
  ],
  contact: 'You can reach out through the contact form or connect on LinkedIn and GitHub',
  about:
    'A passionate full-stack developer focused on creating immersive digital experiences with cutting-edge web technologies',
};

const generateResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('skill') ||
    lowerMessage.includes('tech') ||
    lowerMessage.includes('stack')
  ) {
    return `🚀 SKILL MATRIX ONLINE: ${PORTFOLIO_KNOWLEDGE.skills.join(' • ')}. All systems operational and ready for deployment.`;
  }

  if (
    lowerMessage.includes('project') ||
    lowerMessage.includes('work') ||
    lowerMessage.includes('portfolio')
  ) {
    return `📡 PROJECT DATABASE ACCESSED: ${PORTFOLIO_KNOWLEDGE.projects.map((p) => `${p.name} (${p.tech})`).join(' | ')}. More intel available in the Projects sector.`;
  }

  if (
    lowerMessage.includes('contact') ||
    lowerMessage.includes('reach') ||
    lowerMessage.includes('hire') ||
    lowerMessage.includes('email')
  ) {
    return `📨 COMMUNICATION CHANNEL: ${PORTFOLIO_KNOWLEDGE.contact}. Navigate to the Contact sector for direct transmission.`;
  }

  if (
    lowerMessage.includes('who') ||
    lowerMessage.includes('about') ||
    lowerMessage.includes('tell me')
  ) {
    return `👨‍🚀 VOYAGER PROFILE: ${PORTFOLIO_KNOWLEDGE.about}. Explore the Skills and Projects sectors for mission details.`;
  }

  if (
    lowerMessage.includes('hello') ||
    lowerMessage.includes('hi') ||
    lowerMessage.includes('hey')
  ) {
    return `👋 GREETINGS, VOYAGER! Welcome to Mission Control. I can assist with: Skills • Projects • Contact • About. What sector shall we explore?`;
  }

  if (lowerMessage.includes('help')) {
    return `🆘 NAVIGATION ASSIST: Ask me about skills, projects, how to contact, or learn more about the developer. I'm here to guide your journey through this digital space.`;
  }

  return `🛸 SIGNAL RECEIVED. I can provide intel on: Skills & Technologies • Projects & Work • Contact Information • About the Developer. What interests you, Voyager?`;
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

    // Simulate typing delay for more natural feel
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500));

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
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 bg-space-dark/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-neon-cyan/20"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-white">
                  Mission Control
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <XIcon />
              </button>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-neon-cyan/20 scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">🛸</div>
                  <p className="text-gray-400 text-sm mb-4">Welcome, Voyager! How can I assist?</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="text-[10px] px-3 py-1.5 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/20 rounded-full text-neon-cyan transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-neon-cyan text-space-black rounded-br-sm'
                        : 'bg-white/5 text-gray-200 border border-white/10 rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-black/40 border-t border-white/10 flex gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your command..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 bg-neon-cyan text-space-black rounded-full flex items-center justify-center hover:bg-neon-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                <SendIcon />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-space-dark/90 backdrop-blur-xl rounded-full flex items-center justify-center text-neon-cyan border border-neon-cyan/30 shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:border-neon-cyan/50 transition-colors"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
          {isOpen ? <XIcon /> : <MessageSquareIcon />}
        </motion.div>
      </motion.button>
    </div>
  );
};
