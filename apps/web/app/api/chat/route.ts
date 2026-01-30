import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// TYPES
// ============================================================================

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

// ============================================================================
// PORTFOLIO KNOWLEDGE BASE
// ============================================================================

const PORTFOLIO_INFO = {
  name: 'Umang Sharma',
  title: 'Full Stack Developer',
  email: 'umang@example.com',
  location: 'India',

  skills: {
    frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
    backend: ['Node.js', 'Express', 'GraphQL', 'Apollo Server', 'REST APIs'],
    database: ['MongoDB', 'PostgreSQL', 'Redis', 'Prisma'],
    devops: ['Docker', 'AWS', 'CI/CD', 'GitHub Actions', 'Vercel'],
    tools: ['Git', 'VS Code', 'Figma', 'Postman', 'Jest'],
  },

  experience: `I'm a passionate Full Stack Developer with expertise in building modern web applications. 
I specialize in the MERN stack (MongoDB, Express, React, Node.js) and have extensive experience with TypeScript, 
GraphQL, and cloud technologies. I love creating performant, accessible, and visually appealing applications.`,

  projects: [
    {
      name: 'Portfolio Website',
      description:
        'A modern portfolio built with Next.js 14, TypeScript, Tailwind CSS, and Three.js for 3D visuals.',
      tech: ['Next.js', 'TypeScript', 'Tailwind', 'Three.js', 'Framer Motion'],
    },
    {
      name: 'E-Commerce Platform',
      description:
        'Full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard.',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
    },
    {
      name: 'Task Management App',
      description: 'Collaborative task management tool with real-time updates and team features.',
      tech: ['Next.js', 'GraphQL', 'PostgreSQL', 'Socket.io'],
    },
  ],

  contact: {
    email: 'umang@example.com',
    linkedin: 'linkedin.com/in/umang',
    github: 'github.com/umang',
    twitter: '@umang',
  },

  availability: 'I am currently open to freelance projects and full-time opportunities.',
};

// ============================================================================
// AI RESPONSE GENERATION
// ============================================================================

/**
 * Generate intelligent response based on user query
 */
function generateResponse(message: string, history: ChatMessage[]): string {
  const lowerMessage = message.toLowerCase();

  // Skills related queries
  if (
    lowerMessage.includes('skill') ||
    lowerMessage.includes('technology') ||
    lowerMessage.includes('tech stack') ||
    lowerMessage.includes('what can you do') ||
    lowerMessage.includes('expertise')
  ) {
    return `**${PORTFOLIO_INFO.name}'s Technical Skills:**

**Frontend:**
${PORTFOLIO_INFO.skills.frontend.map((s) => `• ${s}`).join('\n')}

**Backend:**
${PORTFOLIO_INFO.skills.backend.map((s) => `• ${s}`).join('\n')}

**Database:**
${PORTFOLIO_INFO.skills.database.map((s) => `• ${s}`).join('\n')}

**DevOps & Tools:**
${PORTFOLIO_INFO.skills.devops.map((s) => `• ${s}`).join('\n')}

Would you like to know more about any specific technology or see related projects?`;
  }

  // Project related queries
  if (
    lowerMessage.includes('project') ||
    lowerMessage.includes('portfolio') ||
    lowerMessage.includes('work') ||
    lowerMessage.includes('built') ||
    lowerMessage.includes('created')
  ) {
    const projectsList = PORTFOLIO_INFO.projects
      .map((p) => `**${p.name}**\n${p.description}\n*Tech: ${p.tech.join(', ')}*`)
      .join('\n\n');

    return `**Featured Projects:**

${projectsList}

Want to learn more about any specific project? You can also view the full projects page for more details!`;
  }

  // Contact related queries
  if (
    lowerMessage.includes('contact') ||
    lowerMessage.includes('reach') ||
    lowerMessage.includes('email') ||
    lowerMessage.includes('hire') ||
    lowerMessage.includes('connect')
  ) {
    return `**Get in Touch with ${PORTFOLIO_INFO.name}:**

📧 **Email:** ${PORTFOLIO_INFO.contact.email}
💼 **LinkedIn:** ${PORTFOLIO_INFO.contact.linkedin}
🐙 **GitHub:** ${PORTFOLIO_INFO.contact.github}
🐦 **Twitter:** ${PORTFOLIO_INFO.contact.twitter}

${PORTFOLIO_INFO.availability}

You can also use the contact form on this website to send a message directly!`;
  }

  // Experience related queries
  if (
    lowerMessage.includes('experience') ||
    lowerMessage.includes('background') ||
    lowerMessage.includes('about') ||
    lowerMessage.includes('who')
  ) {
    return `**About ${PORTFOLIO_INFO.name}:**

${PORTFOLIO_INFO.experience}

**Current Status:** ${PORTFOLIO_INFO.availability}

Would you like to know more about my skills, projects, or how to get in touch?`;
  }

  // Availability queries
  if (
    lowerMessage.includes('available') ||
    lowerMessage.includes('freelance') ||
    lowerMessage.includes('job') ||
    lowerMessage.includes('opportunity')
  ) {
    return `**Availability:**

${PORTFOLIO_INFO.availability}

I'm interested in:
• Full-time remote positions
• Freelance/contract projects
• Open source collaborations
• Technical consulting

Feel free to reach out at **${PORTFOLIO_INFO.contact.email}** to discuss opportunities!`;
  }

  // Location queries
  if (
    lowerMessage.includes('location') ||
    lowerMessage.includes('where') ||
    lowerMessage.includes('based')
  ) {
    return `${PORTFOLIO_INFO.name} is based in **${PORTFOLIO_INFO.location}** and works with clients globally. 

I'm comfortable working with teams across different time zones and have experience in remote collaboration.

Interested in working together? Let's connect!`;
  }

  // Greeting responses
  if (lowerMessage.match(/^(hi|hello|hey|greetings|howdy)/)) {
    return `Hello! 👋 Welcome to ${PORTFOLIO_INFO.name}'s portfolio!

I'm here to help you learn more about:
• **Skills & Technologies** I work with
• **Projects** I've built
• **Experience** and background
• **How to get in touch**

What would you like to know?`;
  }

  // Thank you responses
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return `You're welcome! 😊 

Is there anything else you'd like to know about ${PORTFOLIO_INFO.name}? I'm happy to help with any questions about skills, projects, or how to get in touch.`;
  }

  // Resume/CV queries
  if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
    return `You can download ${PORTFOLIO_INFO.name}'s resume by clicking the **"Download Resume"** button in the hero section of this website.

The resume includes:
• Complete work history
• Technical skills breakdown
• Education & certifications
• Project highlights

Would you like to know more about any specific aspect of my background?`;
  }

  // Pricing queries
  if (
    lowerMessage.includes('price') ||
    lowerMessage.includes('rate') ||
    lowerMessage.includes('cost') ||
    lowerMessage.includes('charge')
  ) {
    return `For project inquiries and rate discussions, please reach out directly:

📧 **Email:** ${PORTFOLIO_INFO.contact.email}

Rates vary based on:
• Project scope and complexity
• Timeline requirements
• Type of engagement (hourly vs. fixed)

I'd be happy to discuss your specific needs and provide a custom quote!`;
  }

  // Default response for unrecognized queries
  return `I'd be happy to help! While I'm an AI assistant focused on ${PORTFOLIO_INFO.name}'s portfolio, I can answer questions about:

• **Skills** - Technical expertise and technologies
• **Projects** - Work samples and case studies  
• **Experience** - Background and qualifications
• **Contact** - How to get in touch

Could you rephrase your question or choose one of these topics?`;
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Generate response (in production, you could integrate OpenAI here)
    const response = generateResponse(message, history);

    // Simulate slight delay for more natural feel
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json({
    message: 'Chat API is running. Use POST to send messages.',
    status: 'healthy',
  });
}
