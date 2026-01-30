export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AggregateAnalytics = {
  averageBounceRate: Scalars['Float']['output'];
  averageSessionDuration: Scalars['Float']['output'];
  topProjects: Array<TopProject>;
  topSkills: Array<TopSkill>;
  totalPageViews: Scalars['Int']['output'];
  totalProjectClicks: Scalars['Int']['output'];
  totalSkillViews: Scalars['Int']['output'];
  totalUniqueVisitors: Scalars['Int']['output'];
};

export type Analytics = {
  averageSessionDuration: Scalars['Float']['output'];
  bounceRate: Scalars['Float']['output'];
  countries: Array<CountryData>;
  createdAt: Scalars['String']['output'];
  devices: Devices;
  id: Scalars['ID']['output'];
  mostViewedProject?: Maybe<TopProject>;
  mostViewedSkill?: Maybe<TopSkill>;
  pageViews: PageViews;
  periodType: PeriodType;
  projectClicks: Array<ProjectClickData>;
  returningVisitors: Scalars['Int']['output'];
  skillViews: Array<SkillViewData>;
  timestamp: Scalars['String']['output'];
  trafficSources: TrafficSources;
  uniqueVisitors: Scalars['Int']['output'];
};

export type AnalyticsFilterInput = {
  dateFrom: Scalars['String']['input'];
  dateTo: Scalars['String']['input'];
  periodType?: InputMaybe<PeriodType>;
};

export type CategoryCount = {
  category: Scalars['String']['output'];
  count: Scalars['Int']['output'];
};

export type ContactMessage = {
  adminNotes?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  daysSinceCreation: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  isRecent: Scalars['Boolean']['output'];
  isSpam: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  name: Scalars['String']['output'];
  repliedAt?: Maybe<Scalars['String']['output']>;
  responseTime?: Maybe<Scalars['String']['output']>;
  spamScore: Scalars['Int']['output'];
  status: MessageStatus;
  subject?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type ContactMessageInput = {
  email: Scalars['String']['input'];
  message: Scalars['String']['input'];
  name: Scalars['String']['input'];
  subject?: InputMaybe<Scalars['String']['input']>;
};

export type CountryData = {
  country: Scalars['String']['output'];
  visits: Scalars['Int']['output'];
};

export type Devices = {
  desktop: Scalars['Int']['output'];
  mobile: Scalars['Int']['output'];
  tablet: Scalars['Int']['output'];
};

export type GameMode = 'EASY' | 'EXPERT' | 'HARD' | 'MEDIUM';

export type GameType = 'CODE_CHALLENGE' | 'MEMORY' | 'QUIZ' | 'TYPING';

export type LeaderboardConnection = {
  edges: Array<LeaderboardEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type LeaderboardEdge = {
  cursor: Scalars['String']['output'];
  node: LeaderboardEntry;
};

export type LeaderboardEntry = {
  accuracy: Scalars['Float']['output'];
  country?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  duration: Scalars['Int']['output'];
  gameMode: GameMode;
  gameType: GameType;
  grade: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAnonymous: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  level: Scalars['Int']['output'];
  mistakes: Scalars['Int']['output'];
  rank?: Maybe<Scalars['Int']['output']>;
  score: Scalars['Int']['output'];
  timestamp: Scalars['String']['output'];
  userId?: Maybe<Scalars['ID']['output']>;
  username: Scalars['String']['output'];
  wpm: Scalars['Int']['output'];
};

export type LeaderboardFilterInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  dateFrom?: InputMaybe<Scalars['String']['input']>;
  dateTo?: InputMaybe<Scalars['String']['input']>;
  gameMode?: InputMaybe<GameMode>;
  gameType?: InputMaybe<GameType>;
  isVerified?: InputMaybe<Scalars['Boolean']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type LeaderboardSortField = 'ACCURACY' | 'SCORE' | 'TIMESTAMP' | 'WPM';

export type LeaderboardSortInput = {
  field?: InputMaybe<LeaderboardSortField>;
  order?: InputMaybe<SortOrder>;
};

export type MessageStatus = 'ARCHIVED' | 'NEW' | 'READ' | 'REPLIED' | 'SPAM';

export type Mutation = {
  createProject: Project;
  createSkill: Skill;
  deleteMessage: MutationResponse;
  deleteProject: MutationResponse;
  deleteScore: MutationResponse;
  deleteSkill: MutationResponse;
  generateAnalytics: Analytics;
  markMessageAsSpam: ContactMessage;
  sendContactMessage: ContactMessage;
  submitScore: SubmitScoreResponse;
  syncSkillProjectCounts: MutationResponse;
  trackClick: MutationResponse;
  trackView: MutationResponse;
  updateMessageStatus: ContactMessage;
  updateProject: Project;
  updateSkill: Skill;
  verifyScore: LeaderboardEntry;
};

export type MutationCreateProjectArgs = {
  input: UpdateProjectInput;
};

export type MutationCreateSkillArgs = {
  input: UpdateSkillInput;
};

export type MutationDeleteMessageArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteProjectArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteScoreArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteSkillArgs = {
  id: Scalars['ID']['input'];
};

export type MutationGenerateAnalyticsArgs = {
  periodType: PeriodType;
};

export type MutationMarkMessageAsSpamArgs = {
  id: Scalars['ID']['input'];
};

export type MutationSendContactMessageArgs = {
  input: ContactMessageInput;
};

export type MutationSubmitScoreArgs = {
  input: SubmitScoreInput;
};

export type MutationTrackClickArgs = {
  input: TrackClickInput;
};

export type MutationTrackViewArgs = {
  input: TrackViewInput;
};

export type MutationUpdateMessageStatusArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMessageStatusInput;
};

export type MutationUpdateProjectArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
};

export type MutationUpdateSkillArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSkillInput;
};

export type MutationVerifyScoreArgs = {
  id: Scalars['ID']['input'];
};

export type MutationResponse = {
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type PageInfo = {
  currentPage: Scalars['Int']['output'];
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
  totalPages: Scalars['Int']['output'];
};

export type PageViews = {
  contact: Scalars['Int']['output'];
  home: Scalars['Int']['output'];
  projects: Scalars['Int']['output'];
  skills: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type PeriodType = 'DAILY' | 'HOURLY' | 'MONTHLY' | 'WEEKLY';

export type Project = {
  category: ProjectCategory;
  challenges?: Maybe<Scalars['String']['output']>;
  clicks: ProjectClicks;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  durationFormatted?: Maybe<Scalars['String']['output']>;
  featured: Scalars['Boolean']['output'];
  features?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['ID']['output'];
  images: ProjectImages;
  isRecent: Scalars['Boolean']['output'];
  learnings?: Maybe<Scalars['String']['output']>;
  links: ProjectLinks;
  metrics: ProjectMetrics;
  popularityScore?: Maybe<Scalars['Float']['output']>;
  relatedSkills: Array<Skill>;
  slug: Scalars['String']['output'];
  status: ProjectStatus;
  technologies: Array<Scalars['String']['output']>;
  timeline: ProjectTimeline;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  views: Scalars['Int']['output'];
};

export type ProjectCategory = 'BACKEND' | 'DATABASE' | 'FRONTEND' | 'FULLSTACK';

export type ProjectClickData = {
  clicks: ProjectClicks;
  projectId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type ProjectClicks = {
  demo: Scalars['Int']['output'];
  github: Scalars['Int']['output'];
  live: Scalars['Int']['output'];
};

export type ProjectConnection = {
  edges: Array<ProjectEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ProjectEdge = {
  cursor: Scalars['String']['output'];
  node: Project;
};

export type ProjectFilterInput = {
  category?: InputMaybe<ProjectCategory>;
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  minViews?: InputMaybe<Scalars['Int']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProjectStatus>;
  technologies?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ProjectImages = {
  banner?: Maybe<Scalars['String']['output']>;
  screenshots: Array<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type ProjectImagesInput = {
  banner?: InputMaybe<Scalars['String']['input']>;
  screenshots?: InputMaybe<Array<Scalars['String']['input']>>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
};

export type ProjectLinks = {
  demo?: Maybe<Scalars['String']['output']>;
  documentation?: Maybe<Scalars['String']['output']>;
  github?: Maybe<Scalars['String']['output']>;
  live?: Maybe<Scalars['String']['output']>;
};

export type ProjectLinksInput = {
  demo?: InputMaybe<Scalars['String']['input']>;
  documentation?: InputMaybe<Scalars['String']['input']>;
  github?: InputMaybe<Scalars['String']['input']>;
  live?: InputMaybe<Scalars['String']['input']>;
};

export type ProjectMetrics = {
  contributors?: Maybe<Scalars['Int']['output']>;
  downloads?: Maybe<Scalars['Int']['output']>;
  forks?: Maybe<Scalars['Int']['output']>;
  stars?: Maybe<Scalars['Int']['output']>;
};

export type ProjectMetricsInput = {
  contributors?: InputMaybe<Scalars['Int']['input']>;
  downloads?: InputMaybe<Scalars['Int']['input']>;
  forks?: InputMaybe<Scalars['Int']['input']>;
  stars?: InputMaybe<Scalars['Int']['input']>;
};

export type ProjectSortField = 'CLICKS' | 'CREATED_AT' | 'TITLE' | 'VIEWS';

export type ProjectSortInput = {
  field?: InputMaybe<ProjectSortField>;
  order?: InputMaybe<SortOrder>;
};

export type ProjectStatus = 'ARCHIVED' | 'COMPLETED' | 'IN_PROGRESS' | 'PLANNING';

export type ProjectTimeline = {
  duration?: Maybe<Scalars['Int']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
};

export type ProjectTimelineInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  aggregateAnalytics: AggregateAnalytics;
  analytics: Array<Analytics>;
  contactMessages: Array<ContactMessage>;
  featuredProjects: Array<Project>;
  leaderboard: LeaderboardConnection;
  pendingMessages: Array<ContactMessage>;
  personalBest?: Maybe<LeaderboardEntry>;
  playerRank?: Maybe<Scalars['Int']['output']>;
  project?: Maybe<Project>;
  projectById?: Maybe<Project>;
  projects: ProjectConnection;
  projectsByCategory: ProjectConnection;
  recentAnalytics: Array<Analytics>;
  searchProjects: ProjectConnection;
  searchSkills: SkillConnection;
  skill?: Maybe<Skill>;
  skillCategories: Array<Scalars['String']['output']>;
  skills: SkillConnection;
  spamStats: SpamStats;
  stats: Stats;
  todayLeaderboard: Array<LeaderboardEntry>;
  topSkillsByCategory: Array<Skill>;
  trendingProjects: Array<Project>;
  trendingSkills: Array<Skill>;
};

export type QueryAggregateAnalyticsArgs = {
  dateFrom: Scalars['String']['input'];
  dateTo: Scalars['String']['input'];
};

export type QueryAnalyticsArgs = {
  filter: AnalyticsFilterInput;
};

export type QueryContactMessagesArgs = {
  pagination?: InputMaybe<PaginationInput>;
  status?: InputMaybe<MessageStatus>;
};

export type QueryFeaturedProjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryLeaderboardArgs = {
  filter?: InputMaybe<LeaderboardFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<LeaderboardSortInput>;
};

export type QueryPersonalBestArgs = {
  gameType: GameType;
  username: Scalars['String']['input'];
};

export type QueryPlayerRankArgs = {
  id: Scalars['ID']['input'];
};

export type QueryProjectArgs = {
  slug: Scalars['String']['input'];
};

export type QueryProjectByIdArgs = {
  id: Scalars['ID']['input'];
};

export type QueryProjectsArgs = {
  filter?: InputMaybe<ProjectFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<ProjectSortInput>;
};

export type QueryProjectsByCategoryArgs = {
  category: ProjectCategory;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryRecentAnalyticsArgs = {
  days?: InputMaybe<Scalars['Int']['input']>;
};

export type QuerySearchProjectsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};

export type QuerySearchSkillsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};

export type QuerySkillArgs = {
  id: Scalars['ID']['input'];
};

export type QuerySkillsArgs = {
  filter?: InputMaybe<SkillFilterInput>;
  pagination?: InputMaybe<PaginationInput>;
  sort?: InputMaybe<SkillSortInput>;
};

export type QueryTodayLeaderboardArgs = {
  gameType: GameType;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTopSkillsByCategoryArgs = {
  category: SkillCategory;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTrendingProjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type QueryTrendingSkillsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type Skill = {
  category: SkillCategory;
  color?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  experienceLevel: Scalars['String']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastUsedDate?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  proficiency: Scalars['Int']['output'];
  proficiencyLevel: Scalars['String']['output'];
  projectCount: Scalars['Int']['output'];
  relatedProjects: Array<Project>;
  relatedSkills: Array<Scalars['String']['output']>;
  status: SkillStatus;
  updatedAt: Scalars['String']['output'];
  views: Scalars['Int']['output'];
  yearsOfExperience: Scalars['Float']['output'];
};

export type SkillCategory = 'BACKEND' | 'DATABASE' | 'DEVOPS' | 'FRONTEND' | 'LANGUAGES' | 'TOOLS';

export type SkillConnection = {
  edges: Array<SkillEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SkillEdge = {
  cursor: Scalars['String']['output'];
  node: Skill;
};

export type SkillFilterInput = {
  category?: InputMaybe<SkillCategory>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  maxProficiency?: InputMaybe<Scalars['Int']['input']>;
  minProficiency?: InputMaybe<Scalars['Int']['input']>;
  searchTerm?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<SkillStatus>;
};

export type SkillSortField = 'NAME' | 'PROFICIENCY' | 'PROJECT_COUNT' | 'VIEWS';

export type SkillSortInput = {
  field?: InputMaybe<SkillSortField>;
  order?: InputMaybe<SortOrder>;
};

export type SkillStatus = 'ARCHIVED' | 'EXPERT' | 'LEARNING' | 'PROFICIENT';

export type SkillViewData = {
  name: Scalars['String']['output'];
  skillId: Scalars['ID']['output'];
  views: Scalars['Int']['output'];
};

export type SortOrder = 'ASC' | 'DESC';

export type SpamStats = {
  spam: Scalars['Int']['output'];
  spamRate: Scalars['String']['output'];
  total: Scalars['Int']['output'];
};

export type Stats = {
  leetcodeProblems: Scalars['Int']['output'];
  leetcodeRating: Scalars['Int']['output'];
  projectsByCategory: Array<CategoryCount>;
  skillsByCategory: Array<CategoryCount>;
  topTechnologies: Array<TechnologyCount>;
  totalClicks: Scalars['Int']['output'];
  totalProjects: Scalars['Int']['output'];
  totalSkills: Scalars['Int']['output'];
  totalViews: Scalars['Int']['output'];
  yearsOfExperience: Scalars['Float']['output'];
};

export type SubmitScoreInput = {
  accuracy: Scalars['Float']['input'];
  duration: Scalars['Int']['input'];
  gameMode: GameMode;
  gameType: GameType;
  isAnonymous?: InputMaybe<Scalars['Boolean']['input']>;
  level: Scalars['Int']['input'];
  mistakes: Scalars['Int']['input'];
  username: Scalars['String']['input'];
  wpm: Scalars['Int']['input'];
};

export type SubmitScoreResponse = {
  entry?: Maybe<LeaderboardEntry>;
  isPersonalBest: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  rank?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type TechnologyCount = {
  count: Scalars['Int']['output'];
  technology: Scalars['String']['output'];
};

export type TopProject = {
  clicks: Scalars['Int']['output'];
  projectId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type TopSkill = {
  name: Scalars['String']['output'];
  skillId: Scalars['ID']['output'];
  views: Scalars['Int']['output'];
};

export type TrackClickInput = {
  clickType: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
};

export type TrackViewInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  device?: InputMaybe<Scalars['String']['input']>;
  page: Scalars['String']['input'];
  projectId?: InputMaybe<Scalars['ID']['input']>;
  referrer?: InputMaybe<Scalars['String']['input']>;
  skillId?: InputMaybe<Scalars['ID']['input']>;
};

export type TrafficSources = {
  direct: Scalars['Int']['output'];
  referral: Scalars['Int']['output'];
  search: Scalars['Int']['output'];
  social: Scalars['Int']['output'];
};

export type UpdateMessageStatusInput = {
  adminNotes?: InputMaybe<Scalars['String']['input']>;
  status: MessageStatus;
};

export type UpdateProjectInput = {
  category?: InputMaybe<ProjectCategory>;
  challenges?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  features?: InputMaybe<Array<Scalars['String']['input']>>;
  images?: InputMaybe<ProjectImagesInput>;
  learnings?: InputMaybe<Scalars['String']['input']>;
  links?: InputMaybe<ProjectLinksInput>;
  metrics?: InputMaybe<ProjectMetricsInput>;
  status?: InputMaybe<ProjectStatus>;
  technologies?: InputMaybe<Array<Scalars['String']['input']>>;
  timeline?: InputMaybe<ProjectTimelineInput>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSkillInput = {
  category?: InputMaybe<SkillCategory>;
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  proficiency?: InputMaybe<Scalars['Int']['input']>;
  relatedSkills?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<SkillStatus>;
  yearsOfExperience?: InputMaybe<Scalars['Float']['input']>;
};
