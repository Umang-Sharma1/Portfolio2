// Project Types
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  technologies: string[];
  featured: boolean;
  links: ProjectLinks;
  images: ProjectImages;
  metrics?: ProjectMetrics;
  timeline: ProjectTimeline;
  views: number;
  clicks: ProjectClicks;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectLinks {
  github?: string;
  live?: string;
  demo?: string;
  docs?: string;
}

export interface ProjectImages {
  thumbnail: string;
  screenshots?: string[];
  banner?: string;
}

export interface ProjectMetrics {
  stars?: number;
  forks?: number;
  downloads?: number;
  contributors?: number;
}

export interface ProjectTimeline {
  startDate: Date;
  endDate?: Date;
  duration?: number;
}

export interface ProjectClicks {
  github: number;
  live: number;
  demo: number;
}

export enum ProjectCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  FULLSTACK = 'FULLSTACK',
  MOBILE = 'MOBILE',
  DATABASE = 'DATABASE',
  DEVOPS = 'DEVOPS',
  AI_ML = 'AI_ML',
  OTHER = 'OTHER',
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  MAINTAINED = 'MAINTAINED',
  ARCHIVED = 'ARCHIVED',
}

// Skill Types
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  yearsOfExperience: number;
  status: SkillStatus;
  projectCount: number;
  relatedSkills: string[];
  icon?: string;
  color?: string;
  views: number;
  lastUsedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum SkillCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  DEVOPS = 'DEVOPS',
  TOOLS = 'TOOLS',
  LANGUAGES = 'LANGUAGES',
  FRAMEWORKS = 'FRAMEWORKS',
  TESTING = 'TESTING',
  OTHER = 'OTHER',
}

export enum SkillStatus {
  LEARNING = 'LEARNING',
  PROFICIENT = 'PROFICIENT',
  EXPERT = 'EXPERT',
  ARCHIVED = 'ARCHIVED',
}

// Contact Message Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: MessageStatus;
  isSpam: boolean;
  spamScore: number;
  ipAddress?: string;
  userAgent?: string;
  adminNotes?: string;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum MessageStatus {
  NEW = 'NEW',
  READ = 'READ',
  REPLIED = 'REPLIED',
  SPAM = 'SPAM',
  ARCHIVED = 'ARCHIVED',
}

// Analytics Types
export interface Analytics {
  id: string;
  timestamp: Date;
  periodType: PeriodType;
  pageViews: PageViews;
  projectClicks: ProjectClick[];
  skillViews: SkillView[];
  uniqueVisitors: number;
  returningVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  trafficSources: TrafficSources;
  devices: DeviceBreakdown;
  countries: Map<string, number>;
  createdAt: Date;
}

export interface PageViews {
  home: number;
  projects: number;
  skills: number;
  contact: number;
  about: number;
  total: number;
}

export interface ProjectClick {
  projectId: string;
  title: string;
  clicks: number;
}

export interface SkillView {
  skillId: string;
  name: string;
  views: number;
}

export interface TrafficSources {
  direct: number;
  search: number;
  social: number;
  referral: number;
}

export interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
}

export enum PeriodType {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

// Leaderboard Types
export interface LeaderboardEntry {
  id: string;
  username: string;
  wpm: number;
  accuracy: number;
  score: number;
  level: number;
  duration: number;
  mistakes: number;
  gameMode: GameMode;
  gameType: GameType;
  country?: string;
  isVerified: boolean;
  ipAddress?: string;
  timestamp: Date;
  createdAt: Date;
}

export enum GameMode {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT',
}

export enum GameType {
  TYPING = 'TYPING',
  QUIZ = 'QUIZ',
  CODE_CHALLENGE = 'CODE_CHALLENGE',
  MEMORY = 'MEMORY',
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

// Pagination Types
export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  currentPage: number;
  totalPages: number;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface Edge<T> {
  node: T;
  cursor: string;
}

// Filter Types
export interface ProjectFilter {
  category?: ProjectCategory;
  status?: ProjectStatus;
  featured?: boolean;
  technologies?: string[];
  search?: string;
  minViews?: number;
}

export interface SkillFilter {
  category?: SkillCategory;
  status?: SkillStatus;
  minProficiency?: number;
  search?: string;
}

export interface LeaderboardFilter {
  gameType?: GameType;
  gameMode?: GameMode;
  country?: string;
  username?: string;
  isVerified?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

// Sort Types
export interface SortInput {
  field: string;
  order: SortOrder;
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// User Types (for authentication)
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// GraphQL Context
export interface GraphQLContext {
  user?: User;
  ip?: string;
  userAgent?: string;
  loaders?: {
    projectLoader: unknown;
    skillLoader: unknown;
    // Add other loaders as needed
  };
}
