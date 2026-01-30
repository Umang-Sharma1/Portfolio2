import mongoose from 'mongoose';
import { config } from '../config';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { logger } from '../utils/logger';

const skills = [
  // FRONTEND (15 skills)
  {
    name: 'React',
    category: 'FRONTEND',
    proficiency: 95,
    yearsOfExperience: 3,
    projects: ['E-commerce Platform', 'Social Media Dashboard', 'Task Manager'],
  },
  {
    name: 'Next.js',
    category: 'FRONTEND',
    proficiency: 92,
    yearsOfExperience: 2,
    projects: ['Portfolio', 'Blog Platform'],
  },
  {
    name: 'TypeScript',
    category: 'FRONTEND',
    proficiency: 90,
    yearsOfExperience: 2.5,
    projects: ['Multiple Projects'],
  },
  {
    name: 'JavaScript',
    category: 'FRONTEND',
    proficiency: 95,
    yearsOfExperience: 3,
    projects: ['All Projects'],
  },
  {
    name: 'HTML5',
    category: 'FRONTEND',
    proficiency: 98,
    yearsOfExperience: 3,
    projects: [],
  },
  {
    name: 'CSS3',
    category: 'FRONTEND',
    proficiency: 95,
    yearsOfExperience: 3,
    projects: [],
  },
  {
    name: 'Tailwind CSS',
    category: 'FRONTEND',
    proficiency: 93,
    yearsOfExperience: 2,
    projects: [],
  },
  {
    name: 'Redux',
    category: 'FRONTEND',
    proficiency: 88,
    yearsOfExperience: 2,
    projects: [],
  },
  {
    name: 'Redux Toolkit',
    category: 'FRONTEND',
    proficiency: 90,
    yearsOfExperience: 1.5,
    projects: [],
  },
  {
    name: 'React Query',
    category: 'FRONTEND',
    proficiency: 85,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'Vue.js',
    category: 'FRONTEND',
    proficiency: 75,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'Sass/SCSS',
    category: 'FRONTEND',
    proficiency: 85,
    yearsOfExperience: 2,
    projects: [],
  },
  {
    name: 'Webpack',
    category: 'FRONTEND',
    proficiency: 80,
    yearsOfExperience: 1.5,
    projects: [],
  },
  {
    name: 'Vite',
    category: 'FRONTEND',
    proficiency: 85,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'Material-UI',
    category: 'FRONTEND',
    proficiency: 82,
    yearsOfExperience: 1.5,
    projects: [],
  },

  // BACKEND (15 skills)
  {
    name: 'Node.js',
    category: 'BACKEND',
    proficiency: 93,
    yearsOfExperience: 3,
    projects: [],
  },
  {
    name: 'Express.js',
    category: 'BACKEND',
    proficiency: 95,
    yearsOfExperience: 3,
    projects: [],
  },
  {
    name: 'GraphQL',
    category: 'BACKEND',
    proficiency: 88,
    yearsOfExperience: 1.5,
    projects: [],
  },
  {
    name: 'Apollo Server',
    category: 'BACKEND',
    proficiency: 87,
    yearsOfExperience: 1.5,
    projects: [],
  },
  {
    name: 'REST API',
    category: 'BACKEND',
    proficiency: 95,
    yearsOfExperience: 3,
    projects: [],
  },
  {
    name: '.NET Core',
    category: 'BACKEND',
    proficiency: 85,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'C#',
    category: 'BACKEND',
    proficiency: 82,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'Python',
    category: 'BACKEND',
    proficiency: 75,
    yearsOfExperience: 1.5,
    projects: [],
  },
  {
    name: 'FastAPI',
    category: 'BACKEND',
    proficiency: 70,
    yearsOfExperience: 0.5,
    projects: [],
  },
  {
    name: 'NestJS',
    category: 'BACKEND',
    proficiency: 78,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'Microservices',
    category: 'BACKEND',
    proficiency: 80,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'WebSockets',
    category: 'BACKEND',
    proficiency: 82,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'Socket.io',
    category: 'BACKEND',
    proficiency: 85,
    yearsOfExperience: 1.5,
    projects: [],
  },
  {
    name: 'JWT Authentication',
    category: 'BACKEND',
    proficiency: 90,
    yearsOfExperience: 2,
    projects: [],
  },
  {
    name: 'OAuth 2.0',
    category: 'BACKEND',
    proficiency: 83,
    yearsOfExperience: 1,
    projects: [],
  },

  // DATABASE (10 skills)
  {
    name: 'MongoDB',
    category: 'DATABASE',
    proficiency: 92,
    yearsOfExperience: 3,
    projects: [],
  },
  {
    name: 'Mongoose',
    category: 'DATABASE',
    proficiency: 93,
    yearsOfExperience: 3,
    projects: [],
  },
  {
    name: 'PostgreSQL',
    category: 'DATABASE',
    proficiency: 80,
    yearsOfExperience: 1.5,
    projects: [],
  },
  {
    name: 'MySQL',
    category: 'DATABASE',
    proficiency: 78,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'Redis',
    category: 'DATABASE',
    proficiency: 85,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'Prisma',
    category: 'DATABASE',
    proficiency: 75,
    yearsOfExperience: 0.5,
    projects: [],
  },
  {
    name: 'TypeORM',
    category: 'DATABASE',
    proficiency: 72,
    yearsOfExperience: 0.5,
    projects: [],
  },
  {
    name: 'SQL',
    category: 'DATABASE',
    proficiency: 82,
    yearsOfExperience: 2,
    projects: [],
  },
  {
    name: 'Database Design',
    category: 'DATABASE',
    proficiency: 85,
    yearsOfExperience: 2,
    projects: [],
  },
  {
    name: 'Database Optimization',
    category: 'DATABASE',
    proficiency: 80,
    yearsOfExperience: 1.5,
    projects: [],
  },

  // DEVOPS (8 skills)
  {
    name: 'Docker',
    category: 'DEVOPS',
    proficiency: 88,
    yearsOfExperience: 2,
    projects: [],
  },
  {
    name: 'Docker Compose',
    category: 'DEVOPS',
    proficiency: 87,
    yearsOfExperience: 2,
    projects: [],
  },
  {
    name: 'Git',
    category: 'DEVOPS',
    proficiency: 95,
    yearsOfExperience: 3,
    projects: [],
  },
  {
    name: 'GitHub Actions',
    category: 'DEVOPS',
    proficiency: 83,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'CI/CD',
    category: 'DEVOPS',
    proficiency: 82,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'AWS',
    category: 'DEVOPS',
    proficiency: 75,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'Vercel',
    category: 'DEVOPS',
    proficiency: 90,
    yearsOfExperience: 1.5,
    projects: [],
  },
  {
    name: 'Nginx',
    category: 'DEVOPS',
    proficiency: 70,
    yearsOfExperience: 0.5,
    projects: [],
  },

  // TOOLS (5 skills)
  {
    name: 'VS Code',
    category: 'TOOLS',
    proficiency: 98,
    yearsOfExperience: 3,
    projects: [],
  },
  {
    name: 'Postman',
    category: 'TOOLS',
    proficiency: 92,
    yearsOfExperience: 3,
    projects: [],
  },
  {
    name: 'Figma',
    category: 'TOOLS',
    proficiency: 75,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'Jira',
    category: 'TOOLS',
    proficiency: 80,
    yearsOfExperience: 1,
    projects: [],
  },
  {
    name: 'Slack',
    category: 'TOOLS',
    proficiency: 85,
    yearsOfExperience: 2,
    projects: [],
  },

  // LANGUAGES (2 skills)
  {
    name: 'Data Structures',
    category: 'LANGUAGES',
    proficiency: 90,
    yearsOfExperience: 2.5,
    projects: [],
  },
  {
    name: 'Algorithms',
    category: 'LANGUAGES',
    proficiency: 88,
    yearsOfExperience: 2.5,
    projects: [],
  },
];

const projects = [
  // FRONTEND (15 projects)
  {
    title: 'E-Commerce Platform',
    description:
      'Full-featured e-commerce platform with product catalog, shopping cart, payment integration, and order management.',
    category: 'FRONTEND',
    technologies: ['React', 'Redux', 'Stripe', 'Tailwind CSS', 'React Router'],
    githubUrl: 'https://github.com/umangsharma/ecommerce-platform',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    features: [
      'Product search and filtering',
      'Shopping cart management',
      'Secure payment processing',
      'Order tracking',
      'Responsive design',
    ],
    featured: true,
  },
  {
    title: 'Social Media Dashboard',
    description:
      'Analytics dashboard for social media metrics with real-time data visualization and interactive charts.',
    category: 'FRONTEND',
    technologies: ['React', 'Chart.js', 'Tailwind CSS', 'Axios'],
    githubUrl: 'https://github.com/umangsharma/social-dashboard',
    features: ['Real-time metrics', 'Interactive charts', 'Data filtering', 'Export to PDF'],
    featured: true,
  },
  {
    title: 'Task Management App',
    description:
      'Collaborative task management application with drag-and-drop interface and real-time updates.',
    category: 'FRONTEND',
    technologies: ['React', 'Redux Toolkit', 'DnD Kit', 'Tailwind CSS'],
    githubUrl: 'https://github.com/umangsharma/task-manager',
    liveUrl: 'https://taskmanager-demo.vercel.app',
    features: [
      'Drag-and-drop tasks',
      'Real-time collaboration',
      'Task prioritization',
      'Due date reminders',
    ],
    featured: false,
  },
  {
    title: 'Weather App',
    description:
      'Weather forecast application with location-based weather data and 7-day predictions.',
    category: 'FRONTEND',
    technologies: ['React', 'OpenWeather API', 'CSS Modules'],
    githubUrl: 'https://github.com/umangsharma/weather-app',
    features: ['Current weather', '7-day forecast', 'Location search', 'Weather alerts'],
    featured: false,
  },
  {
    title: 'Movie Database',
    description: 'Movie search and discovery platform with ratings, reviews, and recommendations.',
    category: 'FRONTEND',
    technologies: ['React', 'TMDB API', 'Styled Components'],
    githubUrl: 'https://github.com/umangsharma/movie-db',
    features: ['Movie search', 'Detailed information', 'User ratings', 'Watchlist'],
    featured: false,
  },
  {
    title: 'Portfolio Website',
    description: 'Personal portfolio website with blog, project showcase, and contact form.',
    category: 'FRONTEND',
    technologies: ['Next.js', 'Tailwind CSS', 'MDX'],
    githubUrl: 'https://github.com/umangsharma/portfolio',
    liveUrl: 'https://umangsharma.dev',
    features: ['Project showcase', 'Blog posts', 'Contact form', 'SEO optimized'],
    featured: true,
  },
  {
    title: 'Recipe Finder',
    description:
      'Recipe search application with filtering by ingredients, cuisine type, and dietary restrictions.',
    category: 'FRONTEND',
    technologies: ['React', 'Spoonacular API', 'Bootstrap'],
    githubUrl: 'https://github.com/umangsharma/recipe-finder',
    features: ['Recipe search', 'Ingredient filtering', 'Nutritional info', 'Save favorites'],
    featured: false,
  },
  {
    title: 'Music Player',
    description: 'Web-based music player with playlist management and audio visualization.',
    category: 'FRONTEND',
    technologies: ['React', 'Web Audio API', 'Tailwind CSS'],
    githubUrl: 'https://github.com/umangsharma/music-player',
    features: [
      'Play/pause/skip controls',
      'Playlist management',
      'Audio visualization',
      'Volume control',
    ],
    featured: false,
  },
  {
    title: 'Calculator App',
    description: 'Advanced calculator with scientific functions and calculation history.',
    category: 'FRONTEND',
    technologies: ['React', 'Math.js', 'CSS'],
    githubUrl: 'https://github.com/umangsharma/calculator',
    features: ['Basic operations', 'Scientific functions', 'History tracking', 'Keyboard support'],
    featured: false,
  },
  {
    title: 'Quiz Application',
    description: 'Interactive quiz app with multiple categories, timer, and scoring system.',
    category: 'FRONTEND',
    technologies: ['React', 'Context API', 'Tailwind CSS'],
    githubUrl: 'https://github.com/umangsharma/quiz-app',
    features: ['Multiple categories', 'Timer functionality', 'Score tracking', 'Leaderboard'],
    featured: false,
  },
  {
    title: 'Note Taking App',
    description: 'Simple note-taking application with markdown support and local storage.',
    category: 'FRONTEND',
    technologies: ['React', 'Marked.js', 'LocalStorage'],
    githubUrl: 'https://github.com/umangsharma/notes-app',
    features: ['Create/edit notes', 'Markdown support', 'Search notes', 'Auto-save'],
    featured: false,
  },
  {
    title: 'Expense Tracker',
    description: 'Personal finance tracker with budget management and spending analytics.',
    category: 'FRONTEND',
    technologies: ['React', 'Chart.js', 'Tailwind CSS'],
    githubUrl: 'https://github.com/umangsharma/expense-tracker',
    features: ['Track expenses', 'Budget setting', 'Category-wise analysis', 'Monthly reports'],
    featured: false,
  },
  {
    title: 'Pomodoro Timer',
    description: 'Productivity timer using the Pomodoro Technique with customizable intervals.',
    category: 'FRONTEND',
    technologies: ['React', 'CSS', 'Web Notifications API'],
    githubUrl: 'https://github.com/umangsharma/pomodoro',
    features: ['Customizable timer', 'Break intervals', 'Session tracking', 'Notifications'],
    featured: false,
  },
  {
    title: 'Color Palette Generator',
    description: 'Tool for generating and saving color palettes with various formats.',
    category: 'FRONTEND',
    technologies: ['React', 'Chroma.js', 'Tailwind CSS'],
    githubUrl: 'https://github.com/umangsharma/color-palette',
    features: ['Generate palettes', 'Copy color codes', 'Export formats', 'Save favorites'],
    featured: false,
  },
  {
    title: 'URL Shortener Frontend',
    description: 'Frontend interface for URL shortening service with analytics dashboard.',
    category: 'FRONTEND',
    technologies: ['Vue.js', 'Vuex', 'Tailwind CSS'],
    githubUrl: 'https://github.com/umangsharma/url-shortener-ui',
    features: ['Shorten URLs', 'Custom aliases', 'Click analytics', 'QR code generation'],
    featured: false,
  },

  // BACKEND (10 projects)
  {
    title: 'REST API for Blog',
    description:
      'RESTful API for a blogging platform with authentication, CRUD operations, and file uploads.',
    category: 'BACKEND',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Multer'],
    githubUrl: 'https://github.com/umangsharma/blog-api',
    features: [
      'User authentication',
      'Post CRUD',
      'Image uploads',
      'Comment system',
      'Search functionality',
    ],
    featured: true,
  },
  {
    title: 'Real-time Chat Server',
    description: 'WebSocket-based chat server supporting multiple rooms and private messaging.',
    category: 'BACKEND',
    technologies: ['Node.js', 'Socket.io', 'Express', 'MongoDB'],
    githubUrl: 'https://github.com/umangsharma/chat-server',
    features: [
      'Real-time messaging',
      'Multiple rooms',
      'Private chats',
      'User presence',
      'Message history',
    ],
    featured: true,
  },
  {
    title: 'Authentication Service',
    description: 'Microservice for user authentication with OAuth, JWT, and refresh tokens.',
    category: 'BACKEND',
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'JWT'],
    githubUrl: 'https://github.com/umangsharma/auth-service',
    features: [
      'JWT authentication',
      'OAuth integration',
      'Refresh tokens',
      'Rate limiting',
      'Email verification',
    ],
    featured: false,
  },
  {
    title: 'File Upload Service',
    description: 'Scalable file upload and management service with cloud storage integration.',
    category: 'BACKEND',
    technologies: ['Node.js', 'Express', 'AWS S3', 'Multer'],
    githubUrl: 'https://github.com/umangsharma/file-upload',
    features: [
      'Multiple file uploads',
      'Cloud storage',
      'File compression',
      'Access control',
      'CDN integration',
    ],
    featured: false,
  },
  {
    title: 'Payment Gateway Integration',
    description: 'Backend service integrating multiple payment gateways with webhook handling.',
    category: 'BACKEND',
    technologies: ['Node.js', 'Express', 'Stripe', 'PayPal', 'MongoDB'],
    githubUrl: 'https://github.com/umangsharma/payment-service',
    features: [
      'Multiple payment methods',
      'Webhook handling',
      'Transaction logging',
      'Refund processing',
    ],
    featured: false,
  },
  {
    title: 'Email Service',
    description: 'Microservice for sending transactional and marketing emails with templates.',
    category: 'BACKEND',
    technologies: ['Node.js', 'Express', 'SendGrid', 'Redis', 'Bull'],
    githubUrl: 'https://github.com/umangsharma/email-service',
    features: ['Email templates', 'Queue management', 'Delivery tracking', 'Bounce handling'],
    featured: false,
  },
  {
    title: 'Notification System',
    description:
      'Multi-channel notification service supporting email, SMS, and push notifications.',
    category: 'BACKEND',
    technologies: ['Node.js', 'Express', 'Firebase', 'Twilio', 'MongoDB'],
    githubUrl: 'https://github.com/umangsharma/notification-service',
    features: ['Multi-channel delivery', 'Template management', 'Scheduling', 'Analytics'],
    featured: false,
  },
  {
    title: 'API Gateway',
    description: 'Centralized API gateway with rate limiting, caching, and request transformation.',
    category: 'BACKEND',
    technologies: ['Node.js', 'Express', 'Redis', 'Nginx'],
    githubUrl: 'https://github.com/umangsharma/api-gateway',
    features: ['Request routing', 'Rate limiting', 'Response caching', 'Load balancing'],
    featured: false,
  },
  {
    title: 'Job Queue System',
    description: 'Background job processing system with priority queues and retry logic.',
    category: 'BACKEND',
    technologies: ['Node.js', 'Bull', 'Redis', 'MongoDB'],
    githubUrl: 'https://github.com/umangsharma/job-queue',
    features: ['Priority queues', 'Retry logic', 'Job scheduling', 'Progress tracking'],
    featured: false,
  },
  {
    title: 'Search Service',
    description: 'Full-text search service with advanced filtering and relevance scoring.',
    category: 'BACKEND',
    technologies: ['Node.js', 'Elasticsearch', 'Express', 'MongoDB'],
    githubUrl: 'https://github.com/umangsharma/search-service',
    features: ['Full-text search', 'Faceted search', 'Autocomplete', 'Search analytics'],
    featured: false,
  },

  // FULLSTACK (12 projects)
  {
    title: 'Enterprise Portfolio',
    description:
      'This portfolio - Enterprise-level MERN stack application with GraphQL, Redis caching, and advanced features.',
    category: 'FULLSTACK',
    technologies: ['Next.js', 'TypeScript', 'Apollo GraphQL', 'MongoDB', 'Redis', 'Docker'],
    githubUrl: 'https://github.com/umangsharma/enterprise-portfolio',
    liveUrl: 'https://umangsharma.dev',
    features: [
      'GraphQL API',
      'Redis caching',
      'MongoDB with indexes',
      'Rate limiting',
      'CI/CD pipeline',
      'Docker deployment',
    ],
    featured: true,
  },
  {
    title: 'Social Network Platform',
    description:
      'Full-featured social networking platform with posts, comments, likes, and real-time messaging.',
    category: 'FULLSTACK',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Redis'],
    githubUrl: 'https://github.com/umangsharma/social-network',
    features: [
      'User profiles',
      'Posts and comments',
      'Real-time chat',
      'Notifications',
      'Friend system',
    ],
    featured: true,
  },
  {
    title: 'Project Management Tool',
    description:
      'Collaborative project management application with Kanban boards, Gantt charts, and team collaboration.',
    category: 'FULLSTACK',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'WebSockets'],
    githubUrl: 'https://github.com/umangsharma/project-manager',
    features: [
      'Kanban boards',
      'Gantt charts',
      'Team collaboration',
      'Time tracking',
      'File sharing',
    ],
    featured: true,
  },
  {
    title: 'Learning Management System',
    description:
      'Online learning platform with courses, quizzes, progress tracking, and video streaming.',
    category: 'FULLSTACK',
    technologies: ['React', 'Node.js', 'MongoDB', 'AWS S3', 'Stripe'],
    githubUrl: 'https://github.com/umangsharma/lms',
    features: [
      'Course management',
      'Video lessons',
      'Quizzes',
      'Progress tracking',
      'Certificates',
    ],
    featured: false,
  },
  {
    title: 'Food Delivery App',
    description:
      'Food ordering and delivery platform with restaurant management and real-time order tracking.',
    category: 'FULLSTACK',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Socket.io', 'Google Maps API'],
    githubUrl: 'https://github.com/umangsharma/food-delivery',
    features: [
      'Restaurant listings',
      'Menu management',
      'Order placement',
      'Real-time tracking',
      'Payment integration',
    ],
    featured: false,
  },
  {
    title: 'Job Portal',
    description: 'Job search and recruitment platform connecting employers and job seekers.',
    category: 'FULLSTACK',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Elasticsearch'],
    githubUrl: 'https://github.com/umangsharma/job-portal',
    features: [
      'Job listings',
      'Resume builder',
      'Application tracking',
      'Company profiles',
      'Advanced search',
    ],
    featured: false,
  },
  {
    title: 'Booking System',
    description:
      'Hotel and flight booking system with availability calendar and payment processing.',
    category: 'FULLSTACK',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'SendGrid'],
    githubUrl: 'https://github.com/umangsharma/booking-system',
    features: [
      'Search and filter',
      'Booking calendar',
      'Payment processing',
      'Email confirmations',
      'Reviews',
    ],
    featured: false,
  },
  {
    title: 'CRM System',
    description: 'Customer relationship management system with lead tracking and sales pipeline.',
    category: 'FULLSTACK',
    technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Redis', 'Chart.js'],
    githubUrl: 'https://github.com/umangsharma/crm-system',
    features: [
      'Lead management',
      'Sales pipeline',
      'Contact database',
      'Email integration',
      'Analytics',
    ],
    featured: false,
  },
  {
    title: 'Inventory Management',
    description: 'Warehouse and inventory management system with stock tracking and reporting.',
    category: 'FULLSTACK',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'PDF Generation'],
    githubUrl: 'https://github.com/umangsharma/inventory-mgmt',
    features: [
      'Stock tracking',
      'Order management',
      'Barcode scanning',
      'Reports',
      'Low stock alerts',
    ],
    featured: false,
  },
  {
    title: 'Blog Platform',
    description:
      'Full-featured blogging platform with markdown editor, comments, and SEO optimization.',
    category: 'FULLSTACK',
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'MDX', 'Next-SEO'],
    githubUrl: 'https://github.com/umangsharma/blog-platform',
    features: ['Markdown editor', 'SEO optimized', 'Comments', 'Tags and categories', 'RSS feed'],
    featured: false,
  },
  {
    title: 'Event Management System',
    description:
      'Platform for creating, managing, and attending events with ticketing and check-in.',
    category: 'FULLSTACK',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'QR Code'],
    githubUrl: 'https://github.com/umangsharma/event-manager',
    features: ['Event creation', 'Ticket sales', 'QR code tickets', 'Check-in system', 'Analytics'],
    featured: false,
  },
  {
    title: 'Forum Application',
    description: 'Discussion forum with threads, replies, user reputation, and moderation tools.',
    category: 'FULLSTACK',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Elasticsearch'],
    githubUrl: 'https://github.com/umangsharma/forum-app',
    features: [
      'Thread creation',
      'Nested replies',
      'User reputation',
      'Moderation tools',
      'Search',
    ],
    featured: false,
  },

  // DATABASE (3 projects)
  {
    title: 'Database Migration Tool',
    description: 'Tool for migrating data between different database systems with schema mapping.',
    category: 'DATABASE',
    technologies: ['Node.js', 'MongoDB', 'PostgreSQL', 'MySQL', 'TypeScript'],
    githubUrl: 'https://github.com/umangsharma/db-migration',
    features: [
      'Schema mapping',
      'Data transformation',
      'Validation',
      'Rollback support',
      'Progress tracking',
    ],
    featured: true,
  },
  {
    title: 'Database Backup System',
    description:
      'Automated backup and restore system for MongoDB with scheduling and cloud storage.',
    category: 'DATABASE',
    technologies: ['Node.js', 'MongoDB', 'AWS S3', 'Cron', 'Compression'],
    githubUrl: 'https://github.com/umangsharma/db-backup',
    features: [
      'Scheduled backups',
      'Cloud storage',
      'Compression',
      'Restore functionality',
      'Email alerts',
    ],
    featured: false,
  },
  {
    title: 'Query Optimizer',
    description:
      'Tool for analyzing and optimizing database queries with performance recommendations.',
    category: 'DATABASE',
    technologies: ['Node.js', 'MongoDB', 'PostgreSQL', 'Explain Plans'],
    githubUrl: 'https://github.com/umangsharma/query-optimizer',
    features: [
      'Query analysis',
      'Performance metrics',
      'Index recommendations',
      'Query rewriting',
      'Benchmarking',
    ],
    featured: false,
  },
];

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB');

    // Clear existing data
    await Skill.deleteMany({});
    await Project.deleteMany({});
    logger.info('Cleared existing data');

    // Insert skills
    const insertedSkills = await Skill.insertMany(skills);
    logger.info(`Inserted ${insertedSkills.length} skills`);

    // Insert projects one by one to trigger pre-save hooks for slug generation
    const insertedProjects = [];
    for (const projectData of projects) {
      const project = await Project.create({
        ...projectData,
        status: 'COMPLETED', // Add status field
        links: {
          github: (projectData as any).githubUrl,
          live: (projectData as any).liveUrl,
        },
      });
      insertedProjects.push(project);
    }
    logger.info(`Inserted ${insertedProjects.length} projects`);

    logger.info('Database seeding completed successfully!');
    logger.info(`Total Skills: ${insertedSkills.length}`);
    logger.info(`Total Projects: ${insertedProjects.length}`);
    logger.info(`Featured Projects: ${insertedProjects.filter((p) => p.featured).length}`);

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
