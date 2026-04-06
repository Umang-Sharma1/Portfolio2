import mongoose from 'mongoose';
import { config } from '../config';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { logger } from '../utils/logger';

// ============================================================================
// IMAGE MAPPING — Project images by category and type
// ============================================================================

// ============================================================================
// PER-PROJECT CURATED IMAGES — Each project gets topic-specific photos
// ============================================================================
const PROJECT_IMAGES: Record<string, string[]> = {
  // FRONTEND ─────────────────────────────────────────────────────────────────
  'E-Commerce Platform': [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80', // colorful shopping bags
    'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1400&q=80', // cart + products
  ],
  'Social Media Dashboard': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80', // analytics charts
    'https://images.unsplash.com/photo-1460925895917-aaf4b0cdc4c0?auto=format&fit=crop&w=1400&q=80', // data on screens
  ],
  'Task Management App': [
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1400&q=80', // to-do list paper
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1400&q=80', // kanban sticky notes
  ],
  'Weather App': [
    'https://images.unsplash.com/photo-1504256065176-a574d1e1c2d9?auto=format&fit=crop&w=1400&q=80', // weather visualization
    'https://images.unsplash.com/photo-1530908295418-a12e326966ba?auto=format&fit=crop&w=1400&q=80', // storm clouds forecast
  ],
  'Movie Database': [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80', // cinema theater
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=80', // film/cinema scene
  ],
  'Portfolio Website': [
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1400&q=80', // developer at iMac
    'https://images.unsplash.com/photo-1563062682-87e74d06d8f6?auto=format&fit=crop&w=1400&q=80', // creative portfolio
  ],
  'Recipe Finder': [
    'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1400&q=80', // cooking ingredients
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1400&q=80', // recipe/food flat lay
  ],
  'Music Player': [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1400&q=80', // vintage audio mixer
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1400&q=80', // over-ear headphones
  ],
  'Calculator App': [
    'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=1400&q=80', // calculator device
    'https://images.unsplash.com/photo-1516321165247-4aa89a48be72?auto=format&fit=crop&w=1400&q=80', // coding / formula
  ],
  'Quiz Application': [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80', // student studying
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80', // university / exam
  ],
  'Note Taking App': [
    'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1400&q=80', // open notebook + pen
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1400&q=80', // notes on paper
  ],
  'Expense Tracker': [
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=80', // budget spreadsheet
    'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=1400&q=80', // financial planning
  ],
  'Pomodoro Timer': [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80', // focused work session
    'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=1400&q=80', // desktop timer clock
  ],
  'Color Palette Generator': [
    'https://images.unsplash.com/photo-1522869635100-ce306e08ef5e?auto=format&fit=crop&w=1400&q=80', // color swatches
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80', // design palette tools
  ],
  'URL Shortener Frontend': [
    'https://images.unsplash.com/photo-1558002038-1ad5b87d72b3?auto=format&fit=crop&w=1400&q=80', // web browser interface
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80', // url / link concept
  ],

  // BACKEND ──────────────────────────────────────────────────────────────────
  'REST API for Blog': [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80', // server room
    'https://images.unsplash.com/photo-1599658880436-c61792e70660?auto=format&fit=crop&w=1400&q=80', // code / backend
  ],
  'Real-time Chat Server': [
    'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?auto=format&fit=crop&w=1400&q=80', // chat bubbles UI
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=80', // people messaging
  ],
  'Authentication Service': [
    'https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&w=1400&q=80', // security lock graphic
    'https://images.unsplash.com/photo-1526374965328-7f5ae4e8822d?auto=format&fit=crop&w=1400&q=80', // binary / security code
  ],
  'File Upload Service': [
    'https://images.unsplash.com/photo-1536100503868-fc700145dc75?auto=format&fit=crop&w=1400&q=80', // cloud storage upload
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1400&q=80', // cloud computing
  ],
  'Payment Gateway Integration': [
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80', // credit card payment
    'https://images.unsplash.com/photo-1579532537998-f3c2fbf7141d?auto=format&fit=crop&w=1400&q=80', // fintech / finance
  ],
  'Email Service': [
    'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1400&q=80', // email inbox UI
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80', // email compose
  ],
  'Notification System': [
    'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=1400&q=80', // phone notifications
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80', // push alert bell
  ],
  'API Gateway': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80', // network data center
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80', // server rack
  ],
  'Job Queue System': [
    'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?auto=format&fit=crop&w=1400&q=80', // workflow automation
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80', // queue / pipeline
  ],
  'Search Service': [
    'https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=1400&q=80', // magnifier over data
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80', // search interface
  ],

  // FULLSTACK ────────────────────────────────────────────────────────────────
  'Enterprise Portfolio': [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80', // code editor
    'https://images.unsplash.com/photo-1460925895917-aaf4b0cdc4c0?auto=format&fit=crop&w=1400&q=80', // analytics monitor
  ],
  'Social Network Platform': [
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1400&q=80', // social media mosaic
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1400&q=80', // connected people
  ],
  'Project Management Tool': [
    'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1400&q=80', // kanban project board
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80', // team collaborating
  ],
  'Learning Management System': [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80', // online learning
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80', // e-learning platform
  ],
  'Food Delivery App': [
    'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1400&q=80', // restaurant food
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=80', // delivery rider
  ],
  'Job Portal': [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80', // job interview
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80', // office / career
  ],
  'Booking System': [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80', // hotel room
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80', // travel booking
  ],
  'CRM System': [
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80', // business / CRM
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80', // team meeting
  ],
  'Inventory Management': [
    'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80', // warehouse shelves
    'https://images.unsplash.com/photo-1481437156560-3205f6a55735?auto=format&fit=crop&w=1400&q=80', // logistics / packaged
  ],
  'Blog Platform': [
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80', // blogging / laptop
    'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=1400&q=80', // writing workshop
  ],
  'Event Management System': [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80', // conference hall
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80', // live event crowd
  ],
  'Forum Application': [
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1400&q=80', // online discussion
    'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=80', // community talk
  ],

  // DATABASE ─────────────────────────────────────────────────────────────────
  'Database Migration Tool': [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80', // server room
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80', // database code
  ],
  'Database Backup System': [
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1400&q=80', // cloud backup
    'https://images.unsplash.com/photo-1536100503868-fc700145dc75?auto=format&fit=crop&w=1400&q=80', // data archive
  ],
  'Query Optimizer': [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80', // data pipeline
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80', // database server
  ],
};

function getProjectImages(title: string, category: string): string[] {
  // Per-project curated images — exact title match (highest priority)
  if (PROJECT_IMAGES[title]) {
    return PROJECT_IMAGES[title];
  }

  const lowerTitle = title.toLowerCase();

  // Keyword-based fallbacks (for any future projects not in PROJECT_IMAGES)
  if (lowerTitle.includes('commerce') || lowerTitle.includes('shop'))
    return ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('dashboard') || lowerTitle.includes('analytics'))
    return ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1460925895917-aaf4b0cdc4c0?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('task') || lowerTitle.includes('kanban'))
    return ['https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('weather'))
    return ['https://images.unsplash.com/photo-1504256065176-a574d1e1c2d9?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1530908295418-a12e326966ba?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('movie') || lowerTitle.includes('music') || lowerTitle.includes('media'))
    return ['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('portfolio') || lowerTitle.includes('enterprise'))
    return ['https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('finance') || lowerTitle.includes('expense') || lowerTitle.includes('payment'))
    return ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1579532537998-f3c2fbf7141d?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('note') || lowerTitle.includes('timer') || lowerTitle.includes('pomodoro'))
    return ['https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('color') || lowerTitle.includes('design'))
    return ['https://images.unsplash.com/photo-1522869635100-ce306e08ef5e?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('chat') || lowerTitle.includes('social') || lowerTitle.includes('network'))
    return ['https://images.unsplash.com/photo-1611532736579-6b16e2b50449?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('auth') || lowerTitle.includes('security'))
    return ['https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8822d?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('file') || lowerTitle.includes('backup') || lowerTitle.includes('cloud'))
    return ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1536100503868-fc700145dc75?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('email') || lowerTitle.includes('notification'))
    return ['https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('api') || lowerTitle.includes('gateway') || lowerTitle.includes('server'))
    return ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('search'))
    return ['https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('learning') || lowerTitle.includes('course') || lowerTitle.includes('lms'))
    return ['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('food') || lowerTitle.includes('delivery') || lowerTitle.includes('restaurant'))
    return ['https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('job') || lowerTitle.includes('career') || lowerTitle.includes('recruit'))
    return ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('booking') || lowerTitle.includes('hotel') || lowerTitle.includes('travel'))
    return ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80'];
  if (lowerTitle.includes('database') || lowerTitle.includes('query') || lowerTitle.includes('migration'))
    return ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1400&q=80'];

  // Category-level defaults
  if (category === 'FRONTEND') return ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1551085254-e96b210db58a?auto=format&fit=crop&w=1400&q=80'];
  if (category === 'BACKEND') return ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80'];
  if (category === 'FULLSTACK') return ['https://images.unsplash.com/photo-1460925895917-aaf4b0cdc4c0?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80'];
  if (category === 'DATABASE') return ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80'];

  return ['https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80', 'https://images.unsplash.com/photo-1460925895917-aaf4b0cdc4c0?auto=format&fit=crop&w=1400&q=80'];
}

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

// ============================================================================
// ARCHITECTURE GENERATOR — Per-category node/connection templates
// ============================================================================
function generateArchitecture(category: string, technologies: string[]) {
  const tech = (i: number) => technologies[i] || technologies[0] || 'Technology';

  const templates: Record<string, { nodes: any[]; connections: any[] }> = {
    FRONTEND: {
      nodes: [
        { id: 'user',     label: 'User',           type: 'external',  description: 'End user interacting with the UI',               technologies: [],                position: { x: 50,  y: 200 } },
        { id: 'ui',       label: 'UI Layer',        type: 'frontend',  description: `Component-based interface built with ${tech(0)}`, technologies: [tech(0)],          position: { x: 200, y: 200 } },
        { id: 'state',    label: 'State Mgmt',      type: 'service',   description: `Application state via ${tech(1) || 'Context'}`,   technologies: [tech(1)],          position: { x: 370, y: 130 } },
        { id: 'router',   label: 'Router',          type: 'service',   description: 'Client-side routing and navigation',             technologies: ['React Router'],     position: { x: 370, y: 270 } },
        { id: 'api',      label: 'REST / GraphQL',  type: 'api',       description: 'HTTP API calls to backend services',             technologies: ['Axios', 'Fetch'],   position: { x: 530, y: 200 } },
        { id: 'cdn',      label: 'CDN / Hosting',   type: 'external',  description: 'Static asset delivery and edge caching',         technologies: ['Vercel', 'Netlify'],position: { x: 200, y: 340 } },
      ],
      connections: [
        { from: 'user',   to: 'ui',     label: 'Interacts',  type: 'sync' },
        { from: 'ui',     to: 'state',  label: 'Read/Write', type: 'sync' },
        { from: 'ui',     to: 'router', label: 'Navigate',   type: 'sync' },
        { from: 'ui',     to: 'api',    label: 'HTTP',       type: 'async', animated: true },
        { from: 'cdn',    to: 'ui',     label: 'Assets',     type: 'sync' },
      ],
    },
    BACKEND: {
      nodes: [
        { id: 'client',   label: 'Client',          type: 'external',  description: 'Browser or mobile client sending requests',      technologies: [],                  position: { x: 50,  y: 200 } },
        { id: 'gateway',  label: 'API Gateway',     type: 'api',       description: `REST/GraphQL endpoint built with ${tech(0)}`,     technologies: [tech(0)],           position: { x: 200, y: 200 } },
        { id: 'auth',     label: 'Auth Service',    type: 'auth',      description: 'JWT validation and session management',          technologies: ['JWT', 'bcrypt'],    position: { x: 370, y: 100 } },
        { id: 'service',  label: 'Business Logic',  type: 'backend',   description: `Core application services using ${tech(1)}`,     technologies: [tech(1)],           position: { x: 370, y: 200 } },
        { id: 'db',       label: 'Database',        type: 'database',  description: 'Primary data persistence layer',                 technologies: ['MongoDB'],          position: { x: 530, y: 200 } },
        { id: 'cache',    label: 'Cache',           type: 'cache',     description: 'Redis in-memory cache for fast reads',           technologies: ['Redis'],            position: { x: 530, y: 320 } },
      ],
      connections: [
        { from: 'client',  to: 'gateway', label: 'HTTP/WS',  type: 'sync',     animated: true },
        { from: 'gateway', to: 'auth',    label: 'Validate', type: 'sync' },
        { from: 'gateway', to: 'service', label: 'Dispatch', type: 'sync' },
        { from: 'service', to: 'db',      label: 'Query',    type: 'async',    animated: true },
        { from: 'service', to: 'cache',   label: 'Cache',    type: 'cache' },
      ],
    },
    FULLSTACK: {
      nodes: [
        { id: 'browser',  label: 'Browser',         type: 'external',  description: 'User-facing web interface',                      technologies: [],                  position: { x: 50,  y: 200 } },
        { id: 'frontend', label: 'Frontend',        type: 'frontend',  description: `SSR/SPA built with ${tech(0)}`,                  technologies: [tech(0), tech(1)],  position: { x: 190, y: 200 } },
        { id: 'api',      label: 'API Layer',       type: 'api',       description: `GraphQL/REST API with ${tech(2) || 'Node.js'}`,  technologies: [tech(2)],           position: { x: 340, y: 200 } },
        { id: 'auth',     label: 'Auth',            type: 'auth',      description: 'Authentication & authorization',                 technologies: ['JWT', 'OAuth'],    position: { x: 340, y: 100 } },
        { id: 'db',       label: 'Database',        type: 'database',  description: 'Persistent data storage',                       technologies: ['MongoDB', 'Redis'], position: { x: 490, y: 150 } },
        { id: 'storage',  label: 'Storage',         type: 'service',   description: 'File and media asset storage',                   technologies: ['S3', 'Cloudinary'], position: { x: 490, y: 280 } },
        { id: 'deploy',   label: 'Deployment',      type: 'external',  description: 'CI/CD pipeline and cloud hosting',               technologies: ['Docker', 'Vercel'], position: { x: 190, y: 340 } },
      ],
      connections: [
        { from: 'browser',  to: 'frontend', label: 'HTTPS',    type: 'sync' },
        { from: 'frontend', to: 'api',      label: 'GraphQL',  type: 'async', animated: true },
        { from: 'api',      to: 'auth',     label: 'Validate', type: 'sync' },
        { from: 'api',      to: 'db',       label: 'Query',    type: 'async', animated: true },
        { from: 'api',      to: 'storage',  label: 'Upload',   type: 'async' },
        { from: 'deploy',   to: 'frontend', label: 'Deploy',   type: 'sync' },
      ],
    },
    DATABASE: {
      nodes: [
        { id: 'app',      label: 'Application',     type: 'backend',   description: 'Application tier sending queries',               technologies: [],                  position: { x: 50,  y: 200 } },
        { id: 'orm',      label: 'ORM / Driver',    type: 'service',   description: `Data access layer using ${tech(0)}`,             technologies: [tech(0)],           position: { x: 200, y: 200 } },
        { id: 'primary',  label: 'Primary DB',      type: 'database',  description: 'Primary read/write database node',               technologies: [tech(1) || 'MongoDB'],position:{ x: 380, y: 130 } },
        { id: 'replica',  label: 'Read Replica',    type: 'database',  description: 'Read-only replica for scaling queries',          technologies: [tech(1) || 'MongoDB'],position:{ x: 380, y: 270 } },
        { id: 'cache',    label: 'Query Cache',     type: 'cache',     description: 'Redis cache for frequent query results',         technologies: ['Redis'],            position: { x: 540, y: 200 } },
        { id: 'backup',   label: 'Backup Store',    type: 'external',  description: 'Scheduled snapshot backups',                     technologies: ['S3'],               position: { x: 540, y: 340 } },
      ],
      connections: [
        { from: 'app',     to: 'orm',     label: 'Model',   type: 'sync' },
        { from: 'orm',     to: 'primary', label: 'Write',   type: 'async', animated: true },
        { from: 'orm',     to: 'replica', label: 'Read',    type: 'async', animated: true },
        { from: 'orm',     to: 'cache',   label: 'Cache',   type: 'cache' },
        { from: 'primary', to: 'backup',  label: 'Snapshot',type: 'async' },
      ],
    },
  };

  return templates[category] || templates.FULLSTACK;
}

// Helper function to enrich project data with all required fields
interface RawProject {
  title: string;
  tagline?: string;
  description: string;
  category: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  features: string[];
  featured: boolean;
  challenges?: string;
  learnings?: string;
  metrics?: any;
  timeline?: any;
  order?: number;
}

function enrichProjectData(project: RawProject, index: number): any {
  const {
    title,
    description,
    category,
    technologies,
    githubUrl,
    liveUrl,
    features,
    featured,
  } = project;

  // Default metrics based on featured status
  const defaultMetrics = featured
    ? { stars: Math.floor(Math.random() * 1800 + 800), forks: Math.floor(Math.random() * 400 + 150) }
    : { stars: Math.floor(Math.random() * 600 + 150), forks: Math.floor(Math.random() * 200 + 50) };

  // Default timeline - assume 3-6 months duration
  const startDate = new Date(2022, Math.floor(Math.random() * 9), Math.floor(Math.random() * 20 + 1));
  const endDate = new Date(
    startDate.getTime() + (Math.random() * 60 + 90) * 24 * 60 * 60 * 1000
  );
  const duration = Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

  return {
    title,
    tagline: project.tagline || `${title} - ${technologies.slice(0, 2).join(' & ')}`,
    description,
    category,
    technologies,
    githubUrl,
    liveUrl: liveUrl || undefined,
    features,
    featured,
    challenges:
      project.challenges ||
      `Managing complexity in ${category.toLowerCase()} development while ensuring code quality and performance.`,
    learnings:
      project.learnings ||
      `Improved skills in ${technologies.slice(0, 3).join(', ')} and best practices for ${category.toLowerCase()} development.`,
    metrics: project.metrics || {
      stars: defaultMetrics.stars,
      forks: defaultMetrics.forks,
      downloads: Math.floor(defaultMetrics.stars * 3),
      contributors: featured ? Math.floor(Math.random() * 5 + 4) : Math.floor(Math.random() * 3 + 1),
      commits: Math.floor(duration * 1.5 + 50),
    },
    timeline: project.timeline || {
      startDate,
      endDate,
      duration,
    },
    architecture: generateArchitecture(category, technologies),
    order: project.order !== undefined ? project.order : index,
  };
}

const projects = [
  // FRONTEND (15 projects)
  {
    title: 'E-Commerce Platform',
    tagline: 'Full-featured online store with seamless payment and order management',
    description:
      'Full-featured e-commerce platform with product catalog, shopping cart, payment integration, and order management. Features advanced filtering, real-time inventory updates, and multi-currency support.',
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
      'Multi-currency support',
      'Wishlist functionality',
      'Customer reviews',
    ],
    challenges: 'Managing complex state across multiple shopping flows and handling real-time inventory updates without race conditions.',
    learnings: 'Mastered Redux for complex state management, implemented optimistic updates for better UX, and learned payment gateway integration best practices.',
    metrics: { stars: 1250, forks: 350, downloads: 5400, contributors: 8, commits: 245 },
    timeline: { startDate: new Date('2022-03-15'), endDate: new Date('2022-09-20'), duration: 189 },
    order: 1,
    featured: true,
  },
  {
    title: 'Social Media Dashboard',
    tagline: 'Real-time analytics dashboard for social media performance tracking',
    description:
      'Analytics dashboard for social media metrics with real-time data visualization and interactive charts. Supports multiple social platforms with customizable widgets and detailed performance insights.',
    category: 'FRONTEND',
    technologies: ['React', 'Chart.js', 'Tailwind CSS', 'Axios'],
    githubUrl: 'https://github.com/umangsharma/social-dashboard',
    features: ['Real-time metrics', 'Interactive charts', 'Data filtering', 'Export to PDF', 'Multi-platform support', 'Custom dashboards', 'Trend analysis'],
    challenges: 'Handling real-time data updates while maintaining performance with large datasets and ensuring smooth animations on interactive charts.',
    learnings: 'Developed expertise in Chart.js customization, implemented efficient data polling mechanisms, and learned responsive design patterns.',
    metrics: { stars: 890, forks: 210, downloads: 3200, contributors: 5, commits: 178 },
    timeline: { startDate: new Date('2022-04-10'), endDate: new Date('2022-07-15'), duration: 96 },
    order: 2,
    featured: true,
  },
  {
    title: 'Task Management App',
    tagline: 'Modern task manager with drag-and-drop and real-time collaboration',
    description:
      'Collaborative task management application with drag-and-drop interface and real-time updates. Built with React and Redux Toolkit for state management, supporting team collaboration and task prioritization.',
    category: 'FRONTEND',
    technologies: ['React', 'Redux Toolkit', 'DnD Kit', 'Tailwind CSS'],
    githubUrl: 'https://github.com/umangsharma/task-manager',
    liveUrl: 'https://taskmanager-demo.vercel.app',
    features: [
      'Drag-and-drop tasks',
      'Real-time collaboration',
      'Task prioritization',
      'Due date reminders',
      'Team comments',
      'Activity history',
    ],
    challenges: 'Implementing smooth drag-and-drop with React, managing collaborative state across users, and handling real-time updates efficiently.',
    learnings: 'Mastered DnD Kit library, learned about optimistic updates, and improved understanding of real-time synchronization patterns.',
    metrics: { stars: 1050, forks: 280, downloads: 4100, contributors: 6, commits: 210 },
    timeline: { startDate: new Date('2022-05-20'), endDate: new Date('2022-10-10'), duration: 143 },
    order: 4,
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
    tagline: 'Beautiful portfolio showcase with blog integration and modern design',
    description: 'Personal portfolio website with blog, project showcase, and contact form. Built with Next.js for optimal performance and SEO. Features dark mode, responsive design, and fast page loads.',
    category: 'FRONTEND',
    technologies: ['Next.js', 'Tailwind CSS', 'MDX'],
    githubUrl: 'https://github.com/umangsharma/portfolio',
    liveUrl: 'https://umangsharma.dev',
    features: ['Project showcase', 'Blog posts', 'Contact form', 'SEO optimized', 'Dark mode', 'Fast performance', 'Mobile responsive'],
    challenges: 'Creating an efficient blog system with MDX, optimizing images and content for SEO, and ensuring fast page loads across all devices.',
    learnings: 'Mastered Next.js static generation, image optimization techniques, and understanding of SEO best practices for personal brands.',
    metrics: { stars: 2100, forks: 480, downloads: 8900, contributors: 12, commits: 356 },
    timeline: { startDate: new Date('2021-08-01'), endDate: new Date('2022-02-28'), duration: 211 },
    order: 3,
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
    tagline: 'Robust blogging API with authentication and file management',
    description:
      'RESTful API for a blogging platform with authentication, CRUD operations, and file uploads. Built with Express.js and MongoDB, featuring JWT-based security, role-based access control, and comprehensive documentation.',
    category: 'BACKEND',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Multer'],
    githubUrl: 'https://github.com/umangsharma/blog-api',
    features: [
      'User authentication',
      'Post CRUD',
      'Image uploads',
      'Comment system',
      'Search functionality',
      'Rate limiting',
      'API documentation',
    ],
    challenges: 'Designing scalable API architecture, handling file uploads securely, and implementing efficient database queries for large datasets.',
    learnings: 'Mastered RESTful API design principles, learned about JWT security best practices, and improved database query optimization skills.',
    metrics: { stars: 1420, forks: 320, downloads: 5600, contributors: 7, commits: 268 },
    timeline: { startDate: new Date('2022-02-01'), endDate: new Date('2022-08-15'), duration: 195 },
    order: 5,
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
    tagline: 'Production-ready portfolio with advanced features and DevOps integration',
    description:
      'This portfolio - Enterprise-level fullstack application with Next.js, GraphQL, and MongoDB. Features Redis caching, Docker containerization, advanced indexing strategies, rate limiting, and complete CI/CD pipeline for production deployment.',
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
      'Advanced analytics',
      'Admin dashboard',
    ],
    challenges: 'Architecting scalable fullstack solution, implementing efficient caching strategies, setting up automated deployment pipeline, and optimizing database queries.',
    learnings: 'Gained expertise in GraphQL, containerization with Docker, CI/CD best practices, and building production-ready applications with performance optimization.',
    metrics: { stars: 3200, forks: 650, downloads: 12500, contributors: 15, commits: 487 },
    timeline: { startDate: new Date('2021-06-01'), endDate: new Date('2022-12-31'), duration: 579 },
    order: 6,
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
    // Enrich project data first
    const enrichedProjects = projects.map((project, index) => enrichProjectData(project as RawProject, index));
    
    const insertedProjects = [];
    for (const projectData of enrichedProjects) {
      // Get images based on project title and category
      const screenshotUrls = getProjectImages(projectData.title, projectData.category);
      
      const project = await Project.create({
        ...projectData,
        status: 'COMPLETED', // Add status field
        links: {
          github: projectData.githubUrl,
          live: projectData.liveUrl || undefined,
        },
        images: {
          thumbnail: screenshotUrls[0], // Use first image as thumbnail
          screenshots: screenshotUrls, // Use all images as screenshots
          banner: screenshotUrls[0], // Use first image as banner
          logo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80', // Default project icon
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
