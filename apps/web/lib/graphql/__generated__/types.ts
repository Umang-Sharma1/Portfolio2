import type { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
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
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AggregateAnalytics = {
  __typename?: 'AggregateAnalytics';
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
  __typename?: 'Analytics';
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
  __typename?: 'CategoryCount';
  category: Scalars['String']['output'];
  count: Scalars['Int']['output'];
};

export type ContactMessage = {
  __typename?: 'ContactMessage';
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
  __typename?: 'CountryData';
  country: Scalars['String']['output'];
  visits: Scalars['Int']['output'];
};

export type Devices = {
  __typename?: 'Devices';
  desktop: Scalars['Int']['output'];
  mobile: Scalars['Int']['output'];
  tablet: Scalars['Int']['output'];
};

export type GameMode = 'EASY' | 'EXPERT' | 'HARD' | 'MEDIUM';

export type GameType = 'CODE_CHALLENGE' | 'MEMORY' | 'QUIZ' | 'TYPING';

export type LeaderboardConnection = {
  __typename?: 'LeaderboardConnection';
  edges: Array<LeaderboardEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type LeaderboardEdge = {
  __typename?: 'LeaderboardEdge';
  cursor: Scalars['String']['output'];
  node: LeaderboardEntry;
};

export type LeaderboardEntry = {
  __typename?: 'LeaderboardEntry';
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
  __typename?: 'Mutation';
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
  __typename?: 'MutationResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  currentPage: Scalars['Int']['output'];
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
  totalPages: Scalars['Int']['output'];
};

export type PageViews = {
  __typename?: 'PageViews';
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
  __typename?: 'Project';
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
  __typename?: 'ProjectClickData';
  clicks: ProjectClicks;
  projectId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type ProjectClicks = {
  __typename?: 'ProjectClicks';
  demo: Scalars['Int']['output'];
  github: Scalars['Int']['output'];
  live: Scalars['Int']['output'];
};

export type ProjectConnection = {
  __typename?: 'ProjectConnection';
  edges: Array<ProjectEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ProjectEdge = {
  __typename?: 'ProjectEdge';
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
  __typename?: 'ProjectImages';
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
  __typename?: 'ProjectLinks';
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
  __typename?: 'ProjectMetrics';
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
  __typename?: 'ProjectTimeline';
  duration?: Maybe<Scalars['Int']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
};

export type ProjectTimelineInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
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
  __typename?: 'Skill';
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
  __typename?: 'SkillConnection';
  edges: Array<SkillEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SkillEdge = {
  __typename?: 'SkillEdge';
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
  __typename?: 'SkillViewData';
  name: Scalars['String']['output'];
  skillId: Scalars['ID']['output'];
  views: Scalars['Int']['output'];
};

export type SortOrder = 'ASC' | 'DESC';

export type SpamStats = {
  __typename?: 'SpamStats';
  spam: Scalars['Int']['output'];
  spamRate: Scalars['String']['output'];
  total: Scalars['Int']['output'];
};

export type Stats = {
  __typename?: 'Stats';
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
  __typename?: 'SubmitScoreResponse';
  entry?: Maybe<LeaderboardEntry>;
  isPersonalBest: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  rank?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type TechnologyCount = {
  __typename?: 'TechnologyCount';
  count: Scalars['Int']['output'];
  technology: Scalars['String']['output'];
};

export type TopProject = {
  __typename?: 'TopProject';
  clicks: Scalars['Int']['output'];
  projectId: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type TopSkill = {
  __typename?: 'TopSkill';
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
  __typename?: 'TrafficSources';
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

export type SendContactMessageMutationVariables = Exact<{
  input: ContactMessageInput;
}>;

export type SendContactMessageMutation = {
  sendContactMessage: {
    id: string;
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    status: MessageStatus;
    isSpam: boolean;
    spamScore: number;
    isRecent: boolean;
    daysSinceCreation: number;
    createdAt: string;
    updatedAt: string;
  } & { __typename?: 'ContactMessage' };
} & { __typename?: 'Mutation' };

export type SubmitScoreMutationVariables = Exact<{
  input: SubmitScoreInput;
}>;

export type SubmitScoreMutation = {
  submitScore: {
    success: boolean;
    message: string;
    rank?: number | null;
    isPersonalBest: boolean;
    entry?:
      | ({
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
          isAnonymous: boolean;
          country?: string | null;
          isVerified: boolean;
          grade: string;
          rank?: number | null;
          timestamp: string;
          createdAt: string;
        } & { __typename?: 'LeaderboardEntry' })
      | null;
  } & { __typename?: 'SubmitScoreResponse' };
} & { __typename?: 'Mutation' };

export type TrackViewMutationVariables = Exact<{
  input: TrackViewInput;
}>;

export type TrackViewMutation = {
  trackView: { success: boolean; message: string } & { __typename?: 'MutationResponse' };
} & { __typename?: 'Mutation' };

export type TrackClickMutationVariables = Exact<{
  input: TrackClickInput;
}>;

export type TrackClickMutation = {
  trackClick: { success: boolean; message: string } & { __typename?: 'MutationResponse' };
} & { __typename?: 'Mutation' };

export type CreateProjectMutationVariables = Exact<{
  input: UpdateProjectInput;
}>;

export type CreateProjectMutation = {
  createProject: {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: ProjectCategory;
    status: ProjectStatus;
    featured: boolean;
    technologies: Array<string>;
    createdAt: string;
  } & { __typename?: 'Project' };
} & { __typename?: 'Mutation' };

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateProjectInput;
}>;

export type UpdateProjectMutation = {
  updateProject: {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: ProjectCategory;
    status: ProjectStatus;
    featured: boolean;
    technologies: Array<string>;
    updatedAt: string;
  } & { __typename?: 'Project' };
} & { __typename?: 'Mutation' };

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteProjectMutation = {
  deleteProject: { success: boolean; message: string } & { __typename?: 'MutationResponse' };
} & { __typename?: 'Mutation' };

export type CreateSkillMutationVariables = Exact<{
  input: UpdateSkillInput;
}>;

export type CreateSkillMutation = {
  createSkill: {
    id: string;
    name: string;
    category: SkillCategory;
    proficiency: number;
    yearsOfExperience: number;
    icon?: string | null;
    color?: string | null;
    createdAt: string;
  } & { __typename?: 'Skill' };
} & { __typename?: 'Mutation' };

export type UpdateSkillMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSkillInput;
}>;

export type UpdateSkillMutation = {
  updateSkill: {
    id: string;
    name: string;
    category: SkillCategory;
    proficiency: number;
    yearsOfExperience: number;
    icon?: string | null;
    color?: string | null;
    updatedAt: string;
  } & { __typename?: 'Skill' };
} & { __typename?: 'Mutation' };

export type DeleteSkillMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteSkillMutation = {
  deleteSkill: { success: boolean; message: string } & { __typename?: 'MutationResponse' };
} & { __typename?: 'Mutation' };

export type SyncSkillProjectCountsMutationVariables = Exact<{ [key: string]: never }>;

export type SyncSkillProjectCountsMutation = {
  syncSkillProjectCounts: { success: boolean; message: string } & {
    __typename?: 'MutationResponse';
  };
} & { __typename?: 'Mutation' };

export type UpdateMessageStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateMessageStatusInput;
}>;

export type UpdateMessageStatusMutation = {
  updateMessageStatus: {
    id: string;
    status: MessageStatus;
    adminNotes?: string | null;
    repliedAt?: string | null;
    updatedAt: string;
  } & { __typename?: 'ContactMessage' };
} & { __typename?: 'Mutation' };

export type MarkMessageAsSpamMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type MarkMessageAsSpamMutation = {
  markMessageAsSpam: { id: string; status: MessageStatus; isSpam: boolean; spamScore: number } & {
    __typename?: 'ContactMessage';
  };
} & { __typename?: 'Mutation' };

export type DeleteMessageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteMessageMutation = {
  deleteMessage: { success: boolean; message: string } & { __typename?: 'MutationResponse' };
} & { __typename?: 'Mutation' };

export type VerifyScoreMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type VerifyScoreMutation = {
  verifyScore: {
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
    isAnonymous: boolean;
    country?: string | null;
    isVerified: boolean;
    grade: string;
    rank?: number | null;
    timestamp: string;
    createdAt: string;
  } & { __typename?: 'LeaderboardEntry' };
} & { __typename?: 'Mutation' };

export type DeleteScoreMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteScoreMutation = {
  deleteScore: { success: boolean; message: string } & { __typename?: 'MutationResponse' };
} & { __typename?: 'Mutation' };

export type GenerateAnalyticsMutationVariables = Exact<{
  periodType: PeriodType;
}>;

export type GenerateAnalyticsMutation = {
  generateAnalytics: {
    id: string;
    uniqueVisitors: number;
    timestamp: string;
    periodType: PeriodType;
    createdAt: string;
    pageViews: {
      home: number;
      projects: number;
      skills: number;
      contact: number;
      total: number;
    } & { __typename?: 'PageViews' };
  } & { __typename?: 'Analytics' };
} & { __typename?: 'Mutation' };

export type ProjectFieldsFragment = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  technologies: Array<string>;
  views: number;
  features?: Array<string> | null;
  durationFormatted?: string | null;
  isRecent: boolean;
  createdAt: string;
  updatedAt: string;
  images: { thumbnail?: string | null; screenshots: Array<string>; banner?: string | null } & {
    __typename?: 'ProjectImages';
  };
  links: {
    live?: string | null;
    github?: string | null;
    demo?: string | null;
    documentation?: string | null;
  } & { __typename?: 'ProjectLinks' };
  metrics: {
    stars?: number | null;
    forks?: number | null;
    downloads?: number | null;
    contributors?: number | null;
  } & { __typename?: 'ProjectMetrics' };
  timeline: { startDate?: string | null; endDate?: string | null; duration?: number | null } & {
    __typename?: 'ProjectTimeline';
  };
  clicks: { github: number; live: number; demo: number } & { __typename?: 'ProjectClicks' };
} & { __typename?: 'Project' };

export type ProjectDetailFieldsFragment = {
  challenges?: string | null;
  learnings?: string | null;
  popularityScore?: number | null;
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  technologies: Array<string>;
  views: number;
  features?: Array<string> | null;
  durationFormatted?: string | null;
  isRecent: boolean;
  createdAt: string;
  updatedAt: string;
  relatedSkills: Array<
    {
      id: string;
      name: string;
      icon?: string | null;
      color?: string | null;
      proficiency: number;
    } & { __typename?: 'Skill' }
  >;
  images: { thumbnail?: string | null; screenshots: Array<string>; banner?: string | null } & {
    __typename?: 'ProjectImages';
  };
  links: {
    live?: string | null;
    github?: string | null;
    demo?: string | null;
    documentation?: string | null;
  } & { __typename?: 'ProjectLinks' };
  metrics: {
    stars?: number | null;
    forks?: number | null;
    downloads?: number | null;
    contributors?: number | null;
  } & { __typename?: 'ProjectMetrics' };
  timeline: { startDate?: string | null; endDate?: string | null; duration?: number | null } & {
    __typename?: 'ProjectTimeline';
  };
  clicks: { github: number; live: number; demo: number } & { __typename?: 'ProjectClicks' };
} & { __typename?: 'Project' };

export type SkillFieldsFragment = {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  yearsOfExperience: number;
  projectCount: number;
  status: SkillStatus;
  relatedSkills: Array<string>;
  icon?: string | null;
  color?: string | null;
  description?: string | null;
  views: number;
  lastUsedDate?: string | null;
  proficiencyLevel: string;
  experienceLevel: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} & { __typename?: 'Skill' };

export type LeaderboardEntryFieldsFragment = {
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
  isAnonymous: boolean;
  country?: string | null;
  isVerified: boolean;
  grade: string;
  rank?: number | null;
  timestamp: string;
  createdAt: string;
} & { __typename?: 'LeaderboardEntry' };

export type PageInfoFieldsFragment = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
  currentPage: number;
  totalPages: number;
} & { __typename?: 'PageInfo' };

export type GetProjectsQueryVariables = Exact<{
  filter?: InputMaybe<ProjectFilterInput>;
  sort?: InputMaybe<ProjectSortInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetProjectsQuery = {
  projects: {
    totalCount: number;
    edges: Array<
      {
        cursor: string;
        node: {
          id: string;
          title: string;
          slug: string;
          description: string;
          category: ProjectCategory;
          status: ProjectStatus;
          featured: boolean;
          technologies: Array<string>;
          views: number;
          features?: Array<string> | null;
          durationFormatted?: string | null;
          isRecent: boolean;
          createdAt: string;
          updatedAt: string;
          images: {
            thumbnail?: string | null;
            screenshots: Array<string>;
            banner?: string | null;
          } & { __typename?: 'ProjectImages' };
          links: {
            live?: string | null;
            github?: string | null;
            demo?: string | null;
            documentation?: string | null;
          } & { __typename?: 'ProjectLinks' };
          metrics: {
            stars?: number | null;
            forks?: number | null;
            downloads?: number | null;
            contributors?: number | null;
          } & { __typename?: 'ProjectMetrics' };
          timeline: {
            startDate?: string | null;
            endDate?: string | null;
            duration?: number | null;
          } & { __typename?: 'ProjectTimeline' };
          clicks: { github: number; live: number; demo: number } & { __typename?: 'ProjectClicks' };
        } & { __typename?: 'Project' };
      } & { __typename?: 'ProjectEdge' }
    >;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
      currentPage: number;
      totalPages: number;
    } & { __typename?: 'PageInfo' };
  } & { __typename?: 'ProjectConnection' };
} & { __typename?: 'Query' };

export type GetProjectBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;

export type GetProjectBySlugQuery = {
  project?:
    | ({
        challenges?: string | null;
        learnings?: string | null;
        popularityScore?: number | null;
        id: string;
        title: string;
        slug: string;
        description: string;
        category: ProjectCategory;
        status: ProjectStatus;
        featured: boolean;
        technologies: Array<string>;
        views: number;
        features?: Array<string> | null;
        durationFormatted?: string | null;
        isRecent: boolean;
        createdAt: string;
        updatedAt: string;
        relatedSkills: Array<
          {
            id: string;
            name: string;
            icon?: string | null;
            color?: string | null;
            proficiency: number;
          } & { __typename?: 'Skill' }
        >;
        images: {
          thumbnail?: string | null;
          screenshots: Array<string>;
          banner?: string | null;
        } & { __typename?: 'ProjectImages' };
        links: {
          live?: string | null;
          github?: string | null;
          demo?: string | null;
          documentation?: string | null;
        } & { __typename?: 'ProjectLinks' };
        metrics: {
          stars?: number | null;
          forks?: number | null;
          downloads?: number | null;
          contributors?: number | null;
        } & { __typename?: 'ProjectMetrics' };
        timeline: {
          startDate?: string | null;
          endDate?: string | null;
          duration?: number | null;
        } & { __typename?: 'ProjectTimeline' };
        clicks: { github: number; live: number; demo: number } & { __typename?: 'ProjectClicks' };
      } & { __typename?: 'Project' })
    | null;
} & { __typename?: 'Query' };

export type GetProjectByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetProjectByIdQuery = {
  projectById?:
    | ({
        challenges?: string | null;
        learnings?: string | null;
        popularityScore?: number | null;
        id: string;
        title: string;
        slug: string;
        description: string;
        category: ProjectCategory;
        status: ProjectStatus;
        featured: boolean;
        technologies: Array<string>;
        views: number;
        features?: Array<string> | null;
        durationFormatted?: string | null;
        isRecent: boolean;
        createdAt: string;
        updatedAt: string;
        relatedSkills: Array<
          {
            id: string;
            name: string;
            icon?: string | null;
            color?: string | null;
            proficiency: number;
          } & { __typename?: 'Skill' }
        >;
        images: {
          thumbnail?: string | null;
          screenshots: Array<string>;
          banner?: string | null;
        } & { __typename?: 'ProjectImages' };
        links: {
          live?: string | null;
          github?: string | null;
          demo?: string | null;
          documentation?: string | null;
        } & { __typename?: 'ProjectLinks' };
        metrics: {
          stars?: number | null;
          forks?: number | null;
          downloads?: number | null;
          contributors?: number | null;
        } & { __typename?: 'ProjectMetrics' };
        timeline: {
          startDate?: string | null;
          endDate?: string | null;
          duration?: number | null;
        } & { __typename?: 'ProjectTimeline' };
        clicks: { github: number; live: number; demo: number } & { __typename?: 'ProjectClicks' };
      } & { __typename?: 'Project' })
    | null;
} & { __typename?: 'Query' };

export type GetFeaturedProjectsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetFeaturedProjectsQuery = {
  featuredProjects: Array<
    {
      id: string;
      title: string;
      slug: string;
      description: string;
      category: ProjectCategory;
      technologies: Array<string>;
      views: number;
      isRecent: boolean;
      createdAt: string;
      images: { thumbnail?: string | null; banner?: string | null } & {
        __typename?: 'ProjectImages';
      };
      links: { live?: string | null; github?: string | null } & { __typename?: 'ProjectLinks' };
      metrics: { stars?: number | null } & { __typename?: 'ProjectMetrics' };
    } & { __typename?: 'Project' }
  >;
} & { __typename?: 'Query' };

export type GetTrendingProjectsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetTrendingProjectsQuery = {
  trendingProjects: Array<
    {
      id: string;
      title: string;
      slug: string;
      description: string;
      category: ProjectCategory;
      technologies: Array<string>;
      views: number;
      isRecent: boolean;
      images: { thumbnail?: string | null } & { __typename?: 'ProjectImages' };
    } & { __typename?: 'Project' }
  >;
} & { __typename?: 'Query' };

export type SearchProjectsQueryVariables = Exact<{
  query: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;

export type SearchProjectsQuery = {
  searchProjects: {
    totalCount: number;
    edges: Array<
      {
        cursor: string;
        node: {
          id: string;
          title: string;
          slug: string;
          description: string;
          category: ProjectCategory;
          technologies: Array<string>;
          views: number;
          images: { thumbnail?: string | null } & { __typename?: 'ProjectImages' };
        } & { __typename?: 'Project' };
      } & { __typename?: 'ProjectEdge' }
    >;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
      currentPage: number;
      totalPages: number;
    } & { __typename?: 'PageInfo' };
  } & { __typename?: 'ProjectConnection' };
} & { __typename?: 'Query' };

export type GetProjectsByCategoryQueryVariables = Exact<{
  category: ProjectCategory;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetProjectsByCategoryQuery = {
  projectsByCategory: {
    totalCount: number;
    edges: Array<
      {
        cursor: string;
        node: {
          id: string;
          title: string;
          slug: string;
          description: string;
          category: ProjectCategory;
          status: ProjectStatus;
          featured: boolean;
          technologies: Array<string>;
          views: number;
          features?: Array<string> | null;
          durationFormatted?: string | null;
          isRecent: boolean;
          createdAt: string;
          updatedAt: string;
          images: {
            thumbnail?: string | null;
            screenshots: Array<string>;
            banner?: string | null;
          } & { __typename?: 'ProjectImages' };
          links: {
            live?: string | null;
            github?: string | null;
            demo?: string | null;
            documentation?: string | null;
          } & { __typename?: 'ProjectLinks' };
          metrics: {
            stars?: number | null;
            forks?: number | null;
            downloads?: number | null;
            contributors?: number | null;
          } & { __typename?: 'ProjectMetrics' };
          timeline: {
            startDate?: string | null;
            endDate?: string | null;
            duration?: number | null;
          } & { __typename?: 'ProjectTimeline' };
          clicks: { github: number; live: number; demo: number } & { __typename?: 'ProjectClicks' };
        } & { __typename?: 'Project' };
      } & { __typename?: 'ProjectEdge' }
    >;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
      currentPage: number;
      totalPages: number;
    } & { __typename?: 'PageInfo' };
  } & { __typename?: 'ProjectConnection' };
} & { __typename?: 'Query' };

export type GetSkillsQueryVariables = Exact<{
  filter?: InputMaybe<SkillFilterInput>;
  sort?: InputMaybe<SkillSortInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetSkillsQuery = {
  skills: {
    totalCount: number;
    edges: Array<
      {
        cursor: string;
        node: {
          id: string;
          name: string;
          category: SkillCategory;
          proficiency: number;
          yearsOfExperience: number;
          projectCount: number;
          status: SkillStatus;
          relatedSkills: Array<string>;
          icon?: string | null;
          color?: string | null;
          description?: string | null;
          views: number;
          lastUsedDate?: string | null;
          proficiencyLevel: string;
          experienceLevel: string;
          isActive: boolean;
          createdAt: string;
          updatedAt: string;
        } & { __typename?: 'Skill' };
      } & { __typename?: 'SkillEdge' }
    >;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
      currentPage: number;
      totalPages: number;
    } & { __typename?: 'PageInfo' };
  } & { __typename?: 'SkillConnection' };
} & { __typename?: 'Query' };

export type GetSkillByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetSkillByIdQuery = {
  skill?:
    | ({
        id: string;
        name: string;
        category: SkillCategory;
        proficiency: number;
        yearsOfExperience: number;
        projectCount: number;
        status: SkillStatus;
        relatedSkills: Array<string>;
        icon?: string | null;
        color?: string | null;
        description?: string | null;
        views: number;
        lastUsedDate?: string | null;
        proficiencyLevel: string;
        experienceLevel: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        relatedProjects: Array<
          {
            id: string;
            title: string;
            slug: string;
            category: ProjectCategory;
            images: { thumbnail?: string | null } & { __typename?: 'ProjectImages' };
          } & { __typename?: 'Project' }
        >;
      } & { __typename?: 'Skill' })
    | null;
} & { __typename?: 'Query' };

export type SearchSkillsQueryVariables = Exact<{
  query: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
}>;

export type SearchSkillsQuery = {
  searchSkills: {
    totalCount: number;
    edges: Array<
      {
        cursor: string;
        node: {
          id: string;
          name: string;
          category: SkillCategory;
          proficiency: number;
          icon?: string | null;
          color?: string | null;
          proficiencyLevel: string;
          isActive: boolean;
        } & { __typename?: 'Skill' };
      } & { __typename?: 'SkillEdge' }
    >;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
      currentPage: number;
      totalPages: number;
    } & { __typename?: 'PageInfo' };
  } & { __typename?: 'SkillConnection' };
} & { __typename?: 'Query' };

export type GetTopSkillsByCategoryQueryVariables = Exact<{
  category: SkillCategory;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetTopSkillsByCategoryQuery = {
  topSkillsByCategory: Array<
    {
      id: string;
      name: string;
      category: SkillCategory;
      proficiency: number;
      yearsOfExperience: number;
      projectCount: number;
      icon?: string | null;
      color?: string | null;
      proficiencyLevel: string;
      isActive: boolean;
    } & { __typename?: 'Skill' }
  >;
} & { __typename?: 'Query' };

export type GetTrendingSkillsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetTrendingSkillsQuery = {
  trendingSkills: Array<
    {
      id: string;
      name: string;
      category: SkillCategory;
      proficiency: number;
      icon?: string | null;
      color?: string | null;
      views: number;
    } & { __typename?: 'Skill' }
  >;
} & { __typename?: 'Query' };

export type GetSkillCategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type GetSkillCategoriesQuery = { skillCategories: Array<string> } & { __typename?: 'Query' };

export type GetLeaderboardQueryVariables = Exact<{
  filter?: InputMaybe<LeaderboardFilterInput>;
  sort?: InputMaybe<LeaderboardSortInput>;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetLeaderboardQuery = {
  leaderboard: {
    totalCount: number;
    edges: Array<
      {
        cursor: string;
        node: {
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
          isAnonymous: boolean;
          country?: string | null;
          isVerified: boolean;
          grade: string;
          rank?: number | null;
          timestamp: string;
          createdAt: string;
        } & { __typename?: 'LeaderboardEntry' };
      } & { __typename?: 'LeaderboardEdge' }
    >;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
      currentPage: number;
      totalPages: number;
    } & { __typename?: 'PageInfo' };
  } & { __typename?: 'LeaderboardConnection' };
} & { __typename?: 'Query' };

export type GetTodayLeaderboardQueryVariables = Exact<{
  gameType: GameType;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetTodayLeaderboardQuery = {
  todayLeaderboard: Array<
    {
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
      isAnonymous: boolean;
      country?: string | null;
      isVerified: boolean;
      grade: string;
      rank?: number | null;
      timestamp: string;
      createdAt: string;
    } & { __typename?: 'LeaderboardEntry' }
  >;
} & { __typename?: 'Query' };

export type GetPersonalBestQueryVariables = Exact<{
  username: Scalars['String']['input'];
  gameType: GameType;
}>;

export type GetPersonalBestQuery = {
  personalBest?:
    | ({
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
        isAnonymous: boolean;
        country?: string | null;
        isVerified: boolean;
        grade: string;
        rank?: number | null;
        timestamp: string;
        createdAt: string;
      } & { __typename?: 'LeaderboardEntry' })
    | null;
} & { __typename?: 'Query' };

export type GetPlayerRankQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetPlayerRankQuery = { playerRank?: number | null } & { __typename?: 'Query' };

export type GetStatsQueryVariables = Exact<{ [key: string]: never }>;

export type GetStatsQuery = {
  stats: {
    totalProjects: number;
    totalSkills: number;
    yearsOfExperience: number;
    leetcodeProblems: number;
    leetcodeRating: number;
    totalViews: number;
    totalClicks: number;
    projectsByCategory: Array<
      { category: string; count: number } & { __typename?: 'CategoryCount' }
    >;
    skillsByCategory: Array<{ category: string; count: number } & { __typename?: 'CategoryCount' }>;
    topTechnologies: Array<
      { technology: string; count: number } & { __typename?: 'TechnologyCount' }
    >;
  } & { __typename?: 'Stats' };
} & { __typename?: 'Query' };

export type GetAnalyticsQueryVariables = Exact<{
  filter: AnalyticsFilterInput;
}>;

export type GetAnalyticsQuery = {
  analytics: Array<
    {
      id: string;
      uniqueVisitors: number;
      returningVisitors: number;
      averageSessionDuration: number;
      bounceRate: number;
      timestamp: string;
      periodType: PeriodType;
      createdAt: string;
      pageViews: {
        home: number;
        projects: number;
        skills: number;
        contact: number;
        total: number;
      } & { __typename?: 'PageViews' };
      projectClicks: Array<
        {
          projectId: string;
          title: string;
          clicks: { github: number; live: number; demo: number } & { __typename?: 'ProjectClicks' };
        } & { __typename?: 'ProjectClickData' }
      >;
      skillViews: Array<
        { skillId: string; name: string; views: number } & { __typename?: 'SkillViewData' }
      >;
      trafficSources: { direct: number; search: number; social: number; referral: number } & {
        __typename?: 'TrafficSources';
      };
      devices: { desktop: number; mobile: number; tablet: number } & { __typename?: 'Devices' };
      countries: Array<{ country: string; visits: number } & { __typename?: 'CountryData' }>;
      mostViewedProject?:
        | ({ projectId: string; title: string; clicks: number } & { __typename?: 'TopProject' })
        | null;
      mostViewedSkill?:
        | ({ skillId: string; name: string; views: number } & { __typename?: 'TopSkill' })
        | null;
    } & { __typename?: 'Analytics' }
  >;
} & { __typename?: 'Query' };

export type GetAggregateAnalyticsQueryVariables = Exact<{
  dateFrom: Scalars['String']['input'];
  dateTo: Scalars['String']['input'];
}>;

export type GetAggregateAnalyticsQuery = {
  aggregateAnalytics: {
    totalPageViews: number;
    totalUniqueVisitors: number;
    totalProjectClicks: number;
    totalSkillViews: number;
    averageBounceRate: number;
    averageSessionDuration: number;
    topProjects: Array<
      { projectId: string; title: string; clicks: number } & { __typename?: 'TopProject' }
    >;
    topSkills: Array<
      { skillId: string; name: string; views: number } & { __typename?: 'TopSkill' }
    >;
  } & { __typename?: 'AggregateAnalytics' };
} & { __typename?: 'Query' };

export type GetRecentAnalyticsQueryVariables = Exact<{
  days?: InputMaybe<Scalars['Int']['input']>;
}>;

export type GetRecentAnalyticsQuery = {
  recentAnalytics: Array<
    {
      id: string;
      uniqueVisitors: number;
      bounceRate: number;
      timestamp: string;
      periodType: PeriodType;
      createdAt: string;
      pageViews: {
        home: number;
        projects: number;
        skills: number;
        contact: number;
        total: number;
      } & { __typename?: 'PageViews' };
    } & { __typename?: 'Analytics' }
  >;
} & { __typename?: 'Query' };

export type GetContactMessagesQueryVariables = Exact<{
  status?: InputMaybe<MessageStatus>;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetContactMessagesQuery = {
  contactMessages: Array<
    {
      id: string;
      name: string;
      email: string;
      subject?: string | null;
      message: string;
      status: MessageStatus;
      isSpam: boolean;
      spamScore: number;
      ipAddress?: string | null;
      userAgent?: string | null;
      adminNotes?: string | null;
      repliedAt?: string | null;
      isRecent: boolean;
      daysSinceCreation: number;
      responseTime?: string | null;
      createdAt: string;
      updatedAt: string;
    } & { __typename?: 'ContactMessage' }
  >;
} & { __typename?: 'Query' };

export type GetPendingMessagesQueryVariables = Exact<{ [key: string]: never }>;

export type GetPendingMessagesQuery = {
  pendingMessages: Array<
    {
      id: string;
      name: string;
      email: string;
      subject?: string | null;
      message: string;
      status: MessageStatus;
      isRecent: boolean;
      daysSinceCreation: number;
      createdAt: string;
    } & { __typename?: 'ContactMessage' }
  >;
} & { __typename?: 'Query' };

export type GetSpamStatsQueryVariables = Exact<{ [key: string]: never }>;

export type GetSpamStatsQuery = {
  spamStats: { total: number; spam: number; spamRate: string } & { __typename?: 'SpamStats' };
} & { __typename?: 'Query' };

export const ProjectFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Project' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'featured' } },
          { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'images' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'screenshots' } },
                { kind: 'Field', name: { kind: 'Name', value: 'banner' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'links' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'documentation' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'metrics' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'stars' } },
                { kind: 'Field', name: { kind: 'Name', value: 'forks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'downloads' } },
                { kind: 'Field', name: { kind: 'Name', value: 'contributors' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'timeline' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'startDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'endDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'views' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'clicks' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'features' } },
          { kind: 'Field', name: { kind: 'Name', value: 'durationFormatted' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isRecent' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export const ProjectDetailFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Project' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectFields' } },
          { kind: 'Field', name: { kind: 'Name', value: 'challenges' } },
          { kind: 'Field', name: { kind: 'Name', value: 'learnings' } },
          { kind: 'Field', name: { kind: 'Name', value: 'popularityScore' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'relatedSkills' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'proficiency' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Project' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'featured' } },
          { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'images' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'screenshots' } },
                { kind: 'Field', name: { kind: 'Name', value: 'banner' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'links' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'documentation' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'metrics' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'stars' } },
                { kind: 'Field', name: { kind: 'Name', value: 'forks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'downloads' } },
                { kind: 'Field', name: { kind: 'Name', value: 'contributors' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'timeline' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'startDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'endDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'views' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'clicks' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'features' } },
          { kind: 'Field', name: { kind: 'Name', value: 'durationFormatted' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isRecent' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export const SkillFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SkillFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Skill' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'proficiency' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearsOfExperience' } },
          { kind: 'Field', name: { kind: 'Name', value: 'projectCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'relatedSkills' } },
          { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'views' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastUsedDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'proficiencyLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'experienceLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isActive' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export const LeaderboardEntryFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LeaderboardEntryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LeaderboardEntry' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'username' } },
          { kind: 'Field', name: { kind: 'Name', value: 'wpm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'accuracy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'score' } },
          { kind: 'Field', name: { kind: 'Name', value: 'level' } },
          { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mistakes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameMode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isVerified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'grade' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export const PageInfoFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PageInfoFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PageInfo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hasPreviousPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalPages' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export const SendContactMessageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SendContactMessage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ContactMessageInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'sendContactMessage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'subject' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isSpam' } },
                { kind: 'Field', name: { kind: 'Name', value: 'spamScore' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isRecent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'daysSinceCreation' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type SendContactMessageMutationFn = Apollo.MutationFunction<
  SendContactMessageMutation,
  SendContactMessageMutationVariables
>;

/**
 * __useSendContactMessageMutation__
 *
 * To run a mutation, you first call `useSendContactMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendContactMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendContactMessageMutation, { data, loading, error }] = useSendContactMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendContactMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SendContactMessageMutation,
    SendContactMessageMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SendContactMessageMutation, SendContactMessageMutationVariables>(
    SendContactMessageDocument,
    options
  );
}
export type SendContactMessageMutationHookResult = ReturnType<typeof useSendContactMessageMutation>;
export type SendContactMessageMutationResult = Apollo.MutationResult<SendContactMessageMutation>;
export type SendContactMessageMutationOptions = Apollo.BaseMutationOptions<
  SendContactMessageMutation,
  SendContactMessageMutationVariables
>;
export const SubmitScoreDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SubmitScore' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SubmitScoreInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'submitScore' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'entry' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'LeaderboardEntryFields' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isPersonalBest' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LeaderboardEntryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LeaderboardEntry' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'username' } },
          { kind: 'Field', name: { kind: 'Name', value: 'wpm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'accuracy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'score' } },
          { kind: 'Field', name: { kind: 'Name', value: 'level' } },
          { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mistakes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameMode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isVerified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'grade' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type SubmitScoreMutationFn = Apollo.MutationFunction<
  SubmitScoreMutation,
  SubmitScoreMutationVariables
>;

/**
 * __useSubmitScoreMutation__
 *
 * To run a mutation, you first call `useSubmitScoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitScoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitScoreMutation, { data, loading, error }] = useSubmitScoreMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSubmitScoreMutation(
  baseOptions?: Apollo.MutationHookOptions<SubmitScoreMutation, SubmitScoreMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SubmitScoreMutation, SubmitScoreMutationVariables>(
    SubmitScoreDocument,
    options
  );
}
export type SubmitScoreMutationHookResult = ReturnType<typeof useSubmitScoreMutation>;
export type SubmitScoreMutationResult = Apollo.MutationResult<SubmitScoreMutation>;
export type SubmitScoreMutationOptions = Apollo.BaseMutationOptions<
  SubmitScoreMutation,
  SubmitScoreMutationVariables
>;
export const TrackViewDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'TrackView' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'TrackViewInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'trackView' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type TrackViewMutationFn = Apollo.MutationFunction<
  TrackViewMutation,
  TrackViewMutationVariables
>;

/**
 * __useTrackViewMutation__
 *
 * To run a mutation, you first call `useTrackViewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrackViewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trackViewMutation, { data, loading, error }] = useTrackViewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTrackViewMutation(
  baseOptions?: Apollo.MutationHookOptions<TrackViewMutation, TrackViewMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<TrackViewMutation, TrackViewMutationVariables>(
    TrackViewDocument,
    options
  );
}
export type TrackViewMutationHookResult = ReturnType<typeof useTrackViewMutation>;
export type TrackViewMutationResult = Apollo.MutationResult<TrackViewMutation>;
export type TrackViewMutationOptions = Apollo.BaseMutationOptions<
  TrackViewMutation,
  TrackViewMutationVariables
>;
export const TrackClickDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'TrackClick' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'TrackClickInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'trackClick' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type TrackClickMutationFn = Apollo.MutationFunction<
  TrackClickMutation,
  TrackClickMutationVariables
>;

/**
 * __useTrackClickMutation__
 *
 * To run a mutation, you first call `useTrackClickMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrackClickMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trackClickMutation, { data, loading, error }] = useTrackClickMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTrackClickMutation(
  baseOptions?: Apollo.MutationHookOptions<TrackClickMutation, TrackClickMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<TrackClickMutation, TrackClickMutationVariables>(
    TrackClickDocument,
    options
  );
}
export type TrackClickMutationHookResult = ReturnType<typeof useTrackClickMutation>;
export type TrackClickMutationResult = Apollo.MutationResult<TrackClickMutation>;
export type TrackClickMutationOptions = Apollo.BaseMutationOptions<
  TrackClickMutation,
  TrackClickMutationVariables
>;
export const CreateProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateProject' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateProjectInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'featured' } },
                { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type CreateProjectMutationFn = Apollo.MutationFunction<
  CreateProjectMutation,
  CreateProjectMutationVariables
>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(
    CreateProjectDocument,
    options
  );
}
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<
  CreateProjectMutation,
  CreateProjectMutationVariables
>;
export const UpdateProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateProject' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateProjectInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'featured' } },
                { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type UpdateProjectMutationFn = Apollo.MutationFunction<
  UpdateProjectMutation,
  UpdateProjectMutationVariables
>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(
    UpdateProjectDocument,
    options
  );
}
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<
  UpdateProjectMutation,
  UpdateProjectMutationVariables
>;
export const DeleteProjectDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteProject' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteProject' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type DeleteProjectMutationFn = Apollo.MutationFunction<
  DeleteProjectMutation,
  DeleteProjectMutationVariables
>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProjectMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(
    DeleteProjectDocument,
    options
  );
}
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<
  DeleteProjectMutation,
  DeleteProjectMutationVariables
>;
export const CreateSkillDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateSkill' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateSkillInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createSkill' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'proficiency' } },
                { kind: 'Field', name: { kind: 'Name', value: 'yearsOfExperience' } },
                { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type CreateSkillMutationFn = Apollo.MutationFunction<
  CreateSkillMutation,
  CreateSkillMutationVariables
>;

/**
 * __useCreateSkillMutation__
 *
 * To run a mutation, you first call `useCreateSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSkillMutation, { data, loading, error }] = useCreateSkillMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSkillMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateSkillMutation, CreateSkillMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateSkillMutation, CreateSkillMutationVariables>(
    CreateSkillDocument,
    options
  );
}
export type CreateSkillMutationHookResult = ReturnType<typeof useCreateSkillMutation>;
export type CreateSkillMutationResult = Apollo.MutationResult<CreateSkillMutation>;
export type CreateSkillMutationOptions = Apollo.BaseMutationOptions<
  CreateSkillMutation,
  CreateSkillMutationVariables
>;
export const UpdateSkillDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateSkill' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateSkillInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateSkill' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'proficiency' } },
                { kind: 'Field', name: { kind: 'Name', value: 'yearsOfExperience' } },
                { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type UpdateSkillMutationFn = Apollo.MutationFunction<
  UpdateSkillMutation,
  UpdateSkillMutationVariables
>;

/**
 * __useUpdateSkillMutation__
 *
 * To run a mutation, you first call `useUpdateSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSkillMutation, { data, loading, error }] = useUpdateSkillMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSkillMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateSkillMutation, UpdateSkillMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateSkillMutation, UpdateSkillMutationVariables>(
    UpdateSkillDocument,
    options
  );
}
export type UpdateSkillMutationHookResult = ReturnType<typeof useUpdateSkillMutation>;
export type UpdateSkillMutationResult = Apollo.MutationResult<UpdateSkillMutation>;
export type UpdateSkillMutationOptions = Apollo.BaseMutationOptions<
  UpdateSkillMutation,
  UpdateSkillMutationVariables
>;
export const DeleteSkillDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteSkill' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteSkill' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type DeleteSkillMutationFn = Apollo.MutationFunction<
  DeleteSkillMutation,
  DeleteSkillMutationVariables
>;

/**
 * __useDeleteSkillMutation__
 *
 * To run a mutation, you first call `useDeleteSkillMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSkillMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSkillMutation, { data, loading, error }] = useDeleteSkillMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSkillMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteSkillMutation, DeleteSkillMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteSkillMutation, DeleteSkillMutationVariables>(
    DeleteSkillDocument,
    options
  );
}
export type DeleteSkillMutationHookResult = ReturnType<typeof useDeleteSkillMutation>;
export type DeleteSkillMutationResult = Apollo.MutationResult<DeleteSkillMutation>;
export type DeleteSkillMutationOptions = Apollo.BaseMutationOptions<
  DeleteSkillMutation,
  DeleteSkillMutationVariables
>;
export const SyncSkillProjectCountsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'SyncSkillProjectCounts' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'syncSkillProjectCounts' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type SyncSkillProjectCountsMutationFn = Apollo.MutationFunction<
  SyncSkillProjectCountsMutation,
  SyncSkillProjectCountsMutationVariables
>;

/**
 * __useSyncSkillProjectCountsMutation__
 *
 * To run a mutation, you first call `useSyncSkillProjectCountsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncSkillProjectCountsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncSkillProjectCountsMutation, { data, loading, error }] = useSyncSkillProjectCountsMutation({
 *   variables: {
 *   },
 * });
 */
export function useSyncSkillProjectCountsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SyncSkillProjectCountsMutation,
    SyncSkillProjectCountsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SyncSkillProjectCountsMutation,
    SyncSkillProjectCountsMutationVariables
  >(SyncSkillProjectCountsDocument, options);
}
export type SyncSkillProjectCountsMutationHookResult = ReturnType<
  typeof useSyncSkillProjectCountsMutation
>;
export type SyncSkillProjectCountsMutationResult =
  Apollo.MutationResult<SyncSkillProjectCountsMutation>;
export type SyncSkillProjectCountsMutationOptions = Apollo.BaseMutationOptions<
  SyncSkillProjectCountsMutation,
  SyncSkillProjectCountsMutationVariables
>;
export const UpdateMessageStatusDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateMessageStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateMessageStatusInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateMessageStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'adminNotes' } },
                { kind: 'Field', name: { kind: 'Name', value: 'repliedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type UpdateMessageStatusMutationFn = Apollo.MutationFunction<
  UpdateMessageStatusMutation,
  UpdateMessageStatusMutationVariables
>;

/**
 * __useUpdateMessageStatusMutation__
 *
 * To run a mutation, you first call `useUpdateMessageStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMessageStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMessageStatusMutation, { data, loading, error }] = useUpdateMessageStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMessageStatusMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateMessageStatusMutation,
    UpdateMessageStatusMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateMessageStatusMutation, UpdateMessageStatusMutationVariables>(
    UpdateMessageStatusDocument,
    options
  );
}
export type UpdateMessageStatusMutationHookResult = ReturnType<
  typeof useUpdateMessageStatusMutation
>;
export type UpdateMessageStatusMutationResult = Apollo.MutationResult<UpdateMessageStatusMutation>;
export type UpdateMessageStatusMutationOptions = Apollo.BaseMutationOptions<
  UpdateMessageStatusMutation,
  UpdateMessageStatusMutationVariables
>;
export const MarkMessageAsSpamDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'MarkMessageAsSpam' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'markMessageAsSpam' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isSpam' } },
                { kind: 'Field', name: { kind: 'Name', value: 'spamScore' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type MarkMessageAsSpamMutationFn = Apollo.MutationFunction<
  MarkMessageAsSpamMutation,
  MarkMessageAsSpamMutationVariables
>;

/**
 * __useMarkMessageAsSpamMutation__
 *
 * To run a mutation, you first call `useMarkMessageAsSpamMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkMessageAsSpamMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markMessageAsSpamMutation, { data, loading, error }] = useMarkMessageAsSpamMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMarkMessageAsSpamMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MarkMessageAsSpamMutation,
    MarkMessageAsSpamMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<MarkMessageAsSpamMutation, MarkMessageAsSpamMutationVariables>(
    MarkMessageAsSpamDocument,
    options
  );
}
export type MarkMessageAsSpamMutationHookResult = ReturnType<typeof useMarkMessageAsSpamMutation>;
export type MarkMessageAsSpamMutationResult = Apollo.MutationResult<MarkMessageAsSpamMutation>;
export type MarkMessageAsSpamMutationOptions = Apollo.BaseMutationOptions<
  MarkMessageAsSpamMutation,
  MarkMessageAsSpamMutationVariables
>;
export const DeleteMessageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteMessage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteMessage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type DeleteMessageMutationFn = Apollo.MutationFunction<
  DeleteMessageMutation,
  DeleteMessageMutationVariables
>;

/**
 * __useDeleteMessageMutation__
 *
 * To run a mutation, you first call `useDeleteMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMessageMutation, { data, loading, error }] = useDeleteMessageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(
    DeleteMessageDocument,
    options
  );
}
export type DeleteMessageMutationHookResult = ReturnType<typeof useDeleteMessageMutation>;
export type DeleteMessageMutationResult = Apollo.MutationResult<DeleteMessageMutation>;
export type DeleteMessageMutationOptions = Apollo.BaseMutationOptions<
  DeleteMessageMutation,
  DeleteMessageMutationVariables
>;
export const VerifyScoreDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'VerifyScore' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'verifyScore' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'LeaderboardEntryFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LeaderboardEntryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LeaderboardEntry' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'username' } },
          { kind: 'Field', name: { kind: 'Name', value: 'wpm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'accuracy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'score' } },
          { kind: 'Field', name: { kind: 'Name', value: 'level' } },
          { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mistakes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameMode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isVerified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'grade' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type VerifyScoreMutationFn = Apollo.MutationFunction<
  VerifyScoreMutation,
  VerifyScoreMutationVariables
>;

/**
 * __useVerifyScoreMutation__
 *
 * To run a mutation, you first call `useVerifyScoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyScoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyScoreMutation, { data, loading, error }] = useVerifyScoreMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useVerifyScoreMutation(
  baseOptions?: Apollo.MutationHookOptions<VerifyScoreMutation, VerifyScoreMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<VerifyScoreMutation, VerifyScoreMutationVariables>(
    VerifyScoreDocument,
    options
  );
}
export type VerifyScoreMutationHookResult = ReturnType<typeof useVerifyScoreMutation>;
export type VerifyScoreMutationResult = Apollo.MutationResult<VerifyScoreMutation>;
export type VerifyScoreMutationOptions = Apollo.BaseMutationOptions<
  VerifyScoreMutation,
  VerifyScoreMutationVariables
>;
export const DeleteScoreDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteScore' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteScore' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type DeleteScoreMutationFn = Apollo.MutationFunction<
  DeleteScoreMutation,
  DeleteScoreMutationVariables
>;

/**
 * __useDeleteScoreMutation__
 *
 * To run a mutation, you first call `useDeleteScoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteScoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteScoreMutation, { data, loading, error }] = useDeleteScoreMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteScoreMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteScoreMutation, DeleteScoreMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteScoreMutation, DeleteScoreMutationVariables>(
    DeleteScoreDocument,
    options
  );
}
export type DeleteScoreMutationHookResult = ReturnType<typeof useDeleteScoreMutation>;
export type DeleteScoreMutationResult = Apollo.MutationResult<DeleteScoreMutation>;
export type DeleteScoreMutationOptions = Apollo.BaseMutationOptions<
  DeleteScoreMutation,
  DeleteScoreMutationVariables
>;
export const GenerateAnalyticsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'GenerateAnalytics' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'periodType' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'PeriodType' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'generateAnalytics' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'periodType' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'periodType' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageViews' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'home' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'projects' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'skills' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'contact' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'uniqueVisitors' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'periodType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;
export type GenerateAnalyticsMutationFn = Apollo.MutationFunction<
  GenerateAnalyticsMutation,
  GenerateAnalyticsMutationVariables
>;

/**
 * __useGenerateAnalyticsMutation__
 *
 * To run a mutation, you first call `useGenerateAnalyticsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateAnalyticsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateAnalyticsMutation, { data, loading, error }] = useGenerateAnalyticsMutation({
 *   variables: {
 *      periodType: // value for 'periodType'
 *   },
 * });
 */
export function useGenerateAnalyticsMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GenerateAnalyticsMutation,
    GenerateAnalyticsMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GenerateAnalyticsMutation, GenerateAnalyticsMutationVariables>(
    GenerateAnalyticsDocument,
    options
  );
}
export type GenerateAnalyticsMutationHookResult = ReturnType<typeof useGenerateAnalyticsMutation>;
export type GenerateAnalyticsMutationResult = Apollo.MutationResult<GenerateAnalyticsMutation>;
export type GenerateAnalyticsMutationOptions = Apollo.BaseMutationOptions<
  GenerateAnalyticsMutation,
  GenerateAnalyticsMutationVariables
>;
export const GetProjectsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProjects' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectFilterInput' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectSortInput' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationInput' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'projects' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sort' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pagination' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'ProjectFields' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'cursor' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'PageInfoFields' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Project' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'featured' } },
          { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'images' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'screenshots' } },
                { kind: 'Field', name: { kind: 'Name', value: 'banner' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'links' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'documentation' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'metrics' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'stars' } },
                { kind: 'Field', name: { kind: 'Name', value: 'forks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'downloads' } },
                { kind: 'Field', name: { kind: 'Name', value: 'contributors' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'timeline' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'startDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'endDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'views' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'clicks' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'features' } },
          { kind: 'Field', name: { kind: 'Name', value: 'durationFormatted' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isRecent' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PageInfoFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PageInfo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hasPreviousPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalPages' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetProjectsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, options);
}
export function useGetProjectsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(
    GetProjectsDocument,
    options
  );
}
// @ts-ignore
export function useGetProjectsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export function useGetProjectsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetProjectsQuery | undefined, GetProjectsQueryVariables>;
export function useGetProjectsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetProjectsQuery, GetProjectsQueryVariables>(
    GetProjectsDocument,
    options
  );
}
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsSuspenseQueryHookResult = ReturnType<typeof useGetProjectsSuspenseQuery>;
export type GetProjectsQueryResult = Apollo.QueryResult<
  GetProjectsQuery,
  GetProjectsQueryVariables
>;
export const GetProjectBySlugDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProjectBySlug' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'project' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectDetailFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Project' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'featured' } },
          { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'images' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'screenshots' } },
                { kind: 'Field', name: { kind: 'Name', value: 'banner' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'links' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'documentation' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'metrics' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'stars' } },
                { kind: 'Field', name: { kind: 'Name', value: 'forks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'downloads' } },
                { kind: 'Field', name: { kind: 'Name', value: 'contributors' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'timeline' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'startDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'endDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'views' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'clicks' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'features' } },
          { kind: 'Field', name: { kind: 'Name', value: 'durationFormatted' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isRecent' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Project' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectFields' } },
          { kind: 'Field', name: { kind: 'Name', value: 'challenges' } },
          { kind: 'Field', name: { kind: 'Name', value: 'learnings' } },
          { kind: 'Field', name: { kind: 'Name', value: 'popularityScore' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'relatedSkills' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'proficiency' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetProjectBySlugQuery__
 *
 * To run a query within a React component, call `useGetProjectBySlugQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectBySlugQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectBySlugQuery({
 *   variables: {
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetProjectBySlugQuery(
  baseOptions: Apollo.QueryHookOptions<GetProjectBySlugQuery, GetProjectBySlugQueryVariables> &
    ({ variables: GetProjectBySlugQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProjectBySlugQuery, GetProjectBySlugQueryVariables>(
    GetProjectBySlugDocument,
    options
  );
}
export function useGetProjectBySlugLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetProjectBySlugQuery, GetProjectBySlugQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProjectBySlugQuery, GetProjectBySlugQueryVariables>(
    GetProjectBySlugDocument,
    options
  );
}
// @ts-ignore
export function useGetProjectBySlugSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetProjectBySlugQuery,
    GetProjectBySlugQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetProjectBySlugQuery, GetProjectBySlugQueryVariables>;
export function useGetProjectBySlugSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetProjectBySlugQuery, GetProjectBySlugQueryVariables>
): Apollo.UseSuspenseQueryResult<GetProjectBySlugQuery | undefined, GetProjectBySlugQueryVariables>;
export function useGetProjectBySlugSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetProjectBySlugQuery, GetProjectBySlugQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetProjectBySlugQuery, GetProjectBySlugQueryVariables>(
    GetProjectBySlugDocument,
    options
  );
}
export type GetProjectBySlugQueryHookResult = ReturnType<typeof useGetProjectBySlugQuery>;
export type GetProjectBySlugLazyQueryHookResult = ReturnType<typeof useGetProjectBySlugLazyQuery>;
export type GetProjectBySlugSuspenseQueryHookResult = ReturnType<
  typeof useGetProjectBySlugSuspenseQuery
>;
export type GetProjectBySlugQueryResult = Apollo.QueryResult<
  GetProjectBySlugQuery,
  GetProjectBySlugQueryVariables
>;
export const GetProjectByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProjectById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'projectById' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectDetailFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Project' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'featured' } },
          { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'images' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'screenshots' } },
                { kind: 'Field', name: { kind: 'Name', value: 'banner' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'links' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'documentation' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'metrics' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'stars' } },
                { kind: 'Field', name: { kind: 'Name', value: 'forks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'downloads' } },
                { kind: 'Field', name: { kind: 'Name', value: 'contributors' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'timeline' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'startDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'endDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'views' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'clicks' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'features' } },
          { kind: 'Field', name: { kind: 'Name', value: 'durationFormatted' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isRecent' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectDetailFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Project' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'ProjectFields' } },
          { kind: 'Field', name: { kind: 'Name', value: 'challenges' } },
          { kind: 'Field', name: { kind: 'Name', value: 'learnings' } },
          { kind: 'Field', name: { kind: 'Name', value: 'popularityScore' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'relatedSkills' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'proficiency' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetProjectByIdQuery__
 *
 * To run a query within a React component, call `useGetProjectByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProjectByIdQuery(
  baseOptions: Apollo.QueryHookOptions<GetProjectByIdQuery, GetProjectByIdQueryVariables> &
    ({ variables: GetProjectByIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProjectByIdQuery, GetProjectByIdQueryVariables>(
    GetProjectByIdDocument,
    options
  );
}
export function useGetProjectByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetProjectByIdQuery, GetProjectByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProjectByIdQuery, GetProjectByIdQueryVariables>(
    GetProjectByIdDocument,
    options
  );
}
// @ts-ignore
export function useGetProjectByIdSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetProjectByIdQuery, GetProjectByIdQueryVariables>
): Apollo.UseSuspenseQueryResult<GetProjectByIdQuery, GetProjectByIdQueryVariables>;
export function useGetProjectByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetProjectByIdQuery, GetProjectByIdQueryVariables>
): Apollo.UseSuspenseQueryResult<GetProjectByIdQuery | undefined, GetProjectByIdQueryVariables>;
export function useGetProjectByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetProjectByIdQuery, GetProjectByIdQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetProjectByIdQuery, GetProjectByIdQueryVariables>(
    GetProjectByIdDocument,
    options
  );
}
export type GetProjectByIdQueryHookResult = ReturnType<typeof useGetProjectByIdQuery>;
export type GetProjectByIdLazyQueryHookResult = ReturnType<typeof useGetProjectByIdLazyQuery>;
export type GetProjectByIdSuspenseQueryHookResult = ReturnType<
  typeof useGetProjectByIdSuspenseQuery
>;
export type GetProjectByIdQueryResult = Apollo.QueryResult<
  GetProjectByIdQuery,
  GetProjectByIdQueryVariables
>;
export const GetFeaturedProjectsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetFeaturedProjects' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'featuredProjects' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'images' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'banner' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'links' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'metrics' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'stars' } }],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'views' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isRecent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetFeaturedProjectsQuery__
 *
 * To run a query within a React component, call `useGetFeaturedProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeaturedProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeaturedProjectsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetFeaturedProjectsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetFeaturedProjectsQuery, GetFeaturedProjectsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetFeaturedProjectsQuery, GetFeaturedProjectsQueryVariables>(
    GetFeaturedProjectsDocument,
    options
  );
}
export function useGetFeaturedProjectsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetFeaturedProjectsQuery,
    GetFeaturedProjectsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetFeaturedProjectsQuery, GetFeaturedProjectsQueryVariables>(
    GetFeaturedProjectsDocument,
    options
  );
}
// @ts-ignore
export function useGetFeaturedProjectsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetFeaturedProjectsQuery,
    GetFeaturedProjectsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetFeaturedProjectsQuery, GetFeaturedProjectsQueryVariables>;
export function useGetFeaturedProjectsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetFeaturedProjectsQuery, GetFeaturedProjectsQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetFeaturedProjectsQuery | undefined,
  GetFeaturedProjectsQueryVariables
>;
export function useGetFeaturedProjectsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetFeaturedProjectsQuery, GetFeaturedProjectsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetFeaturedProjectsQuery, GetFeaturedProjectsQueryVariables>(
    GetFeaturedProjectsDocument,
    options
  );
}
export type GetFeaturedProjectsQueryHookResult = ReturnType<typeof useGetFeaturedProjectsQuery>;
export type GetFeaturedProjectsLazyQueryHookResult = ReturnType<
  typeof useGetFeaturedProjectsLazyQuery
>;
export type GetFeaturedProjectsSuspenseQueryHookResult = ReturnType<
  typeof useGetFeaturedProjectsSuspenseQuery
>;
export type GetFeaturedProjectsQueryResult = Apollo.QueryResult<
  GetFeaturedProjectsQuery,
  GetFeaturedProjectsQueryVariables
>;
export const GetTrendingProjectsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTrendingProjects' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'trendingProjects' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'images' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } }],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'views' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isRecent' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetTrendingProjectsQuery__
 *
 * To run a query within a React component, call `useGetTrendingProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrendingProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrendingProjectsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetTrendingProjectsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetTrendingProjectsQuery, GetTrendingProjectsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTrendingProjectsQuery, GetTrendingProjectsQueryVariables>(
    GetTrendingProjectsDocument,
    options
  );
}
export function useGetTrendingProjectsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTrendingProjectsQuery,
    GetTrendingProjectsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTrendingProjectsQuery, GetTrendingProjectsQueryVariables>(
    GetTrendingProjectsDocument,
    options
  );
}
// @ts-ignore
export function useGetTrendingProjectsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTrendingProjectsQuery,
    GetTrendingProjectsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetTrendingProjectsQuery, GetTrendingProjectsQueryVariables>;
export function useGetTrendingProjectsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetTrendingProjectsQuery, GetTrendingProjectsQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetTrendingProjectsQuery | undefined,
  GetTrendingProjectsQueryVariables
>;
export function useGetTrendingProjectsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetTrendingProjectsQuery, GetTrendingProjectsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetTrendingProjectsQuery, GetTrendingProjectsQueryVariables>(
    GetTrendingProjectsDocument,
    options
  );
}
export type GetTrendingProjectsQueryHookResult = ReturnType<typeof useGetTrendingProjectsQuery>;
export type GetTrendingProjectsLazyQueryHookResult = ReturnType<
  typeof useGetTrendingProjectsLazyQuery
>;
export type GetTrendingProjectsSuspenseQueryHookResult = ReturnType<
  typeof useGetTrendingProjectsSuspenseQuery
>;
export type GetTrendingProjectsQueryResult = Apollo.QueryResult<
  GetTrendingProjectsQuery,
  GetTrendingProjectsQueryVariables
>;
export const SearchProjectsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'SearchProjects' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'query' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationInput' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'searchProjects' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'query' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'query' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pagination' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'images' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'views' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'cursor' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'PageInfoFields' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PageInfoFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PageInfo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hasPreviousPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalPages' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useSearchProjectsQuery__
 *
 * To run a query within a React component, call `useSearchProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProjectsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useSearchProjectsQuery(
  baseOptions: Apollo.QueryHookOptions<SearchProjectsQuery, SearchProjectsQueryVariables> &
    ({ variables: SearchProjectsQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchProjectsQuery, SearchProjectsQueryVariables>(
    SearchProjectsDocument,
    options
  );
}
export function useSearchProjectsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchProjectsQuery, SearchProjectsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchProjectsQuery, SearchProjectsQueryVariables>(
    SearchProjectsDocument,
    options
  );
}
// @ts-ignore
export function useSearchProjectsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<SearchProjectsQuery, SearchProjectsQueryVariables>
): Apollo.UseSuspenseQueryResult<SearchProjectsQuery, SearchProjectsQueryVariables>;
export function useSearchProjectsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SearchProjectsQuery, SearchProjectsQueryVariables>
): Apollo.UseSuspenseQueryResult<SearchProjectsQuery | undefined, SearchProjectsQueryVariables>;
export function useSearchProjectsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SearchProjectsQuery, SearchProjectsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<SearchProjectsQuery, SearchProjectsQueryVariables>(
    SearchProjectsDocument,
    options
  );
}
export type SearchProjectsQueryHookResult = ReturnType<typeof useSearchProjectsQuery>;
export type SearchProjectsLazyQueryHookResult = ReturnType<typeof useSearchProjectsLazyQuery>;
export type SearchProjectsSuspenseQueryHookResult = ReturnType<
  typeof useSearchProjectsSuspenseQuery
>;
export type SearchProjectsQueryResult = Apollo.QueryResult<
  SearchProjectsQuery,
  SearchProjectsQueryVariables
>;
export const GetProjectsByCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProjectsByCategory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'category' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ProjectCategory' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationInput' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'projectsByCategory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'category' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'category' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pagination' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'ProjectFields' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'cursor' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'PageInfoFields' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'ProjectFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Project' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'featured' } },
          { kind: 'Field', name: { kind: 'Name', value: 'technologies' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'images' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
                { kind: 'Field', name: { kind: 'Name', value: 'screenshots' } },
                { kind: 'Field', name: { kind: 'Name', value: 'banner' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'links' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
                { kind: 'Field', name: { kind: 'Name', value: 'documentation' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'metrics' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'stars' } },
                { kind: 'Field', name: { kind: 'Name', value: 'forks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'downloads' } },
                { kind: 'Field', name: { kind: 'Name', value: 'contributors' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'timeline' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'startDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'endDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'views' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'clicks' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'features' } },
          { kind: 'Field', name: { kind: 'Name', value: 'durationFormatted' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isRecent' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PageInfoFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PageInfo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hasPreviousPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalPages' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetProjectsByCategoryQuery__
 *
 * To run a query within a React component, call `useGetProjectsByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsByCategoryQuery({
 *   variables: {
 *      category: // value for 'category'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetProjectsByCategoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetProjectsByCategoryQuery,
    GetProjectsByCategoryQueryVariables
  > &
    ({ variables: GetProjectsByCategoryQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProjectsByCategoryQuery, GetProjectsByCategoryQueryVariables>(
    GetProjectsByCategoryDocument,
    options
  );
}
export function useGetProjectsByCategoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProjectsByCategoryQuery,
    GetProjectsByCategoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProjectsByCategoryQuery, GetProjectsByCategoryQueryVariables>(
    GetProjectsByCategoryDocument,
    options
  );
}
// @ts-ignore
export function useGetProjectsByCategorySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetProjectsByCategoryQuery,
    GetProjectsByCategoryQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetProjectsByCategoryQuery, GetProjectsByCategoryQueryVariables>;
export function useGetProjectsByCategorySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetProjectsByCategoryQuery,
        GetProjectsByCategoryQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetProjectsByCategoryQuery | undefined,
  GetProjectsByCategoryQueryVariables
>;
export function useGetProjectsByCategorySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetProjectsByCategoryQuery,
        GetProjectsByCategoryQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetProjectsByCategoryQuery, GetProjectsByCategoryQueryVariables>(
    GetProjectsByCategoryDocument,
    options
  );
}
export type GetProjectsByCategoryQueryHookResult = ReturnType<typeof useGetProjectsByCategoryQuery>;
export type GetProjectsByCategoryLazyQueryHookResult = ReturnType<
  typeof useGetProjectsByCategoryLazyQuery
>;
export type GetProjectsByCategorySuspenseQueryHookResult = ReturnType<
  typeof useGetProjectsByCategorySuspenseQuery
>;
export type GetProjectsByCategoryQueryResult = Apollo.QueryResult<
  GetProjectsByCategoryQuery,
  GetProjectsByCategoryQueryVariables
>;
export const GetSkillsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSkills' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'SkillFilterInput' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'SkillSortInput' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationInput' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'skills' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sort' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pagination' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'SkillFields' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'cursor' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'PageInfoFields' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SkillFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Skill' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'proficiency' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearsOfExperience' } },
          { kind: 'Field', name: { kind: 'Name', value: 'projectCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'relatedSkills' } },
          { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'views' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastUsedDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'proficiencyLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'experienceLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isActive' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PageInfoFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PageInfo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hasPreviousPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalPages' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetSkillsQuery__
 *
 * To run a query within a React component, call `useGetSkillsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSkillsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSkillsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetSkillsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetSkillsQuery, GetSkillsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSkillsQuery, GetSkillsQueryVariables>(GetSkillsDocument, options);
}
export function useGetSkillsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetSkillsQuery, GetSkillsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSkillsQuery, GetSkillsQueryVariables>(GetSkillsDocument, options);
}
// @ts-ignore
export function useGetSkillsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetSkillsQuery, GetSkillsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetSkillsQuery, GetSkillsQueryVariables>;
export function useGetSkillsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetSkillsQuery, GetSkillsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetSkillsQuery | undefined, GetSkillsQueryVariables>;
export function useGetSkillsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetSkillsQuery, GetSkillsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetSkillsQuery, GetSkillsQueryVariables>(
    GetSkillsDocument,
    options
  );
}
export type GetSkillsQueryHookResult = ReturnType<typeof useGetSkillsQuery>;
export type GetSkillsLazyQueryHookResult = ReturnType<typeof useGetSkillsLazyQuery>;
export type GetSkillsSuspenseQueryHookResult = ReturnType<typeof useGetSkillsSuspenseQuery>;
export type GetSkillsQueryResult = Apollo.QueryResult<GetSkillsQuery, GetSkillsQueryVariables>;
export const GetSkillByIdDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSkillById' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'skill' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'SkillFields' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'relatedProjects' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'images' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'SkillFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Skill' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'category' } },
          { kind: 'Field', name: { kind: 'Name', value: 'proficiency' } },
          { kind: 'Field', name: { kind: 'Name', value: 'yearsOfExperience' } },
          { kind: 'Field', name: { kind: 'Name', value: 'projectCount' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'relatedSkills' } },
          { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
          { kind: 'Field', name: { kind: 'Name', value: 'color' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'views' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastUsedDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'proficiencyLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'experienceLevel' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isActive' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetSkillByIdQuery__
 *
 * To run a query within a React component, call `useGetSkillByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSkillByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSkillByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSkillByIdQuery(
  baseOptions: Apollo.QueryHookOptions<GetSkillByIdQuery, GetSkillByIdQueryVariables> &
    ({ variables: GetSkillByIdQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSkillByIdQuery, GetSkillByIdQueryVariables>(
    GetSkillByIdDocument,
    options
  );
}
export function useGetSkillByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetSkillByIdQuery, GetSkillByIdQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSkillByIdQuery, GetSkillByIdQueryVariables>(
    GetSkillByIdDocument,
    options
  );
}
// @ts-ignore
export function useGetSkillByIdSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetSkillByIdQuery, GetSkillByIdQueryVariables>
): Apollo.UseSuspenseQueryResult<GetSkillByIdQuery, GetSkillByIdQueryVariables>;
export function useGetSkillByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetSkillByIdQuery, GetSkillByIdQueryVariables>
): Apollo.UseSuspenseQueryResult<GetSkillByIdQuery | undefined, GetSkillByIdQueryVariables>;
export function useGetSkillByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetSkillByIdQuery, GetSkillByIdQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetSkillByIdQuery, GetSkillByIdQueryVariables>(
    GetSkillByIdDocument,
    options
  );
}
export type GetSkillByIdQueryHookResult = ReturnType<typeof useGetSkillByIdQuery>;
export type GetSkillByIdLazyQueryHookResult = ReturnType<typeof useGetSkillByIdLazyQuery>;
export type GetSkillByIdSuspenseQueryHookResult = ReturnType<typeof useGetSkillByIdSuspenseQuery>;
export type GetSkillByIdQueryResult = Apollo.QueryResult<
  GetSkillByIdQuery,
  GetSkillByIdQueryVariables
>;
export const SearchSkillsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'SearchSkills' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'query' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationInput' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'searchSkills' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'query' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'query' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pagination' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'proficiency' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'proficiencyLevel' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'isActive' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'cursor' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'PageInfoFields' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PageInfoFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PageInfo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hasPreviousPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalPages' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useSearchSkillsQuery__
 *
 * To run a query within a React component, call `useSearchSkillsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchSkillsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchSkillsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useSearchSkillsQuery(
  baseOptions: Apollo.QueryHookOptions<SearchSkillsQuery, SearchSkillsQueryVariables> &
    ({ variables: SearchSkillsQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SearchSkillsQuery, SearchSkillsQueryVariables>(
    SearchSkillsDocument,
    options
  );
}
export function useSearchSkillsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<SearchSkillsQuery, SearchSkillsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SearchSkillsQuery, SearchSkillsQueryVariables>(
    SearchSkillsDocument,
    options
  );
}
// @ts-ignore
export function useSearchSkillsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<SearchSkillsQuery, SearchSkillsQueryVariables>
): Apollo.UseSuspenseQueryResult<SearchSkillsQuery, SearchSkillsQueryVariables>;
export function useSearchSkillsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SearchSkillsQuery, SearchSkillsQueryVariables>
): Apollo.UseSuspenseQueryResult<SearchSkillsQuery | undefined, SearchSkillsQueryVariables>;
export function useSearchSkillsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<SearchSkillsQuery, SearchSkillsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<SearchSkillsQuery, SearchSkillsQueryVariables>(
    SearchSkillsDocument,
    options
  );
}
export type SearchSkillsQueryHookResult = ReturnType<typeof useSearchSkillsQuery>;
export type SearchSkillsLazyQueryHookResult = ReturnType<typeof useSearchSkillsLazyQuery>;
export type SearchSkillsSuspenseQueryHookResult = ReturnType<typeof useSearchSkillsSuspenseQuery>;
export type SearchSkillsQueryResult = Apollo.QueryResult<
  SearchSkillsQuery,
  SearchSkillsQueryVariables
>;
export const GetTopSkillsByCategoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTopSkillsByCategory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'category' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SkillCategory' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'topSkillsByCategory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'category' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'category' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'proficiency' } },
                { kind: 'Field', name: { kind: 'Name', value: 'yearsOfExperience' } },
                { kind: 'Field', name: { kind: 'Name', value: 'projectCount' } },
                { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'proficiencyLevel' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isActive' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetTopSkillsByCategoryQuery__
 *
 * To run a query within a React component, call `useGetTopSkillsByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTopSkillsByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTopSkillsByCategoryQuery({
 *   variables: {
 *      category: // value for 'category'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetTopSkillsByCategoryQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTopSkillsByCategoryQuery,
    GetTopSkillsByCategoryQueryVariables
  > &
    ({ variables: GetTopSkillsByCategoryQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTopSkillsByCategoryQuery, GetTopSkillsByCategoryQueryVariables>(
    GetTopSkillsByCategoryDocument,
    options
  );
}
export function useGetTopSkillsByCategoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTopSkillsByCategoryQuery,
    GetTopSkillsByCategoryQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTopSkillsByCategoryQuery, GetTopSkillsByCategoryQueryVariables>(
    GetTopSkillsByCategoryDocument,
    options
  );
}
// @ts-ignore
export function useGetTopSkillsByCategorySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTopSkillsByCategoryQuery,
    GetTopSkillsByCategoryQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetTopSkillsByCategoryQuery, GetTopSkillsByCategoryQueryVariables>;
export function useGetTopSkillsByCategorySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTopSkillsByCategoryQuery,
        GetTopSkillsByCategoryQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetTopSkillsByCategoryQuery | undefined,
  GetTopSkillsByCategoryQueryVariables
>;
export function useGetTopSkillsByCategorySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetTopSkillsByCategoryQuery,
        GetTopSkillsByCategoryQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetTopSkillsByCategoryQuery, GetTopSkillsByCategoryQueryVariables>(
    GetTopSkillsByCategoryDocument,
    options
  );
}
export type GetTopSkillsByCategoryQueryHookResult = ReturnType<
  typeof useGetTopSkillsByCategoryQuery
>;
export type GetTopSkillsByCategoryLazyQueryHookResult = ReturnType<
  typeof useGetTopSkillsByCategoryLazyQuery
>;
export type GetTopSkillsByCategorySuspenseQueryHookResult = ReturnType<
  typeof useGetTopSkillsByCategorySuspenseQuery
>;
export type GetTopSkillsByCategoryQueryResult = Apollo.QueryResult<
  GetTopSkillsByCategoryQuery,
  GetTopSkillsByCategoryQueryVariables
>;
export const GetTrendingSkillsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTrendingSkills' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'trendingSkills' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'proficiency' } },
                { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
                { kind: 'Field', name: { kind: 'Name', value: 'color' } },
                { kind: 'Field', name: { kind: 'Name', value: 'views' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetTrendingSkillsQuery__
 *
 * To run a query within a React component, call `useGetTrendingSkillsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrendingSkillsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrendingSkillsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetTrendingSkillsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetTrendingSkillsQuery, GetTrendingSkillsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTrendingSkillsQuery, GetTrendingSkillsQueryVariables>(
    GetTrendingSkillsDocument,
    options
  );
}
export function useGetTrendingSkillsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTrendingSkillsQuery, GetTrendingSkillsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTrendingSkillsQuery, GetTrendingSkillsQueryVariables>(
    GetTrendingSkillsDocument,
    options
  );
}
// @ts-ignore
export function useGetTrendingSkillsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTrendingSkillsQuery,
    GetTrendingSkillsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetTrendingSkillsQuery, GetTrendingSkillsQueryVariables>;
export function useGetTrendingSkillsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetTrendingSkillsQuery, GetTrendingSkillsQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetTrendingSkillsQuery | undefined,
  GetTrendingSkillsQueryVariables
>;
export function useGetTrendingSkillsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetTrendingSkillsQuery, GetTrendingSkillsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetTrendingSkillsQuery, GetTrendingSkillsQueryVariables>(
    GetTrendingSkillsDocument,
    options
  );
}
export type GetTrendingSkillsQueryHookResult = ReturnType<typeof useGetTrendingSkillsQuery>;
export type GetTrendingSkillsLazyQueryHookResult = ReturnType<typeof useGetTrendingSkillsLazyQuery>;
export type GetTrendingSkillsSuspenseQueryHookResult = ReturnType<
  typeof useGetTrendingSkillsSuspenseQuery
>;
export type GetTrendingSkillsQueryResult = Apollo.QueryResult<
  GetTrendingSkillsQuery,
  GetTrendingSkillsQueryVariables
>;
export const GetSkillCategoriesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSkillCategories' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [{ kind: 'Field', name: { kind: 'Name', value: 'skillCategories' } }],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetSkillCategoriesQuery__
 *
 * To run a query within a React component, call `useGetSkillCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSkillCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSkillCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSkillCategoriesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetSkillCategoriesQuery, GetSkillCategoriesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSkillCategoriesQuery, GetSkillCategoriesQueryVariables>(
    GetSkillCategoriesDocument,
    options
  );
}
export function useGetSkillCategoriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSkillCategoriesQuery,
    GetSkillCategoriesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSkillCategoriesQuery, GetSkillCategoriesQueryVariables>(
    GetSkillCategoriesDocument,
    options
  );
}
// @ts-ignore
export function useGetSkillCategoriesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetSkillCategoriesQuery,
    GetSkillCategoriesQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetSkillCategoriesQuery, GetSkillCategoriesQueryVariables>;
export function useGetSkillCategoriesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetSkillCategoriesQuery, GetSkillCategoriesQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetSkillCategoriesQuery | undefined,
  GetSkillCategoriesQueryVariables
>;
export function useGetSkillCategoriesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetSkillCategoriesQuery, GetSkillCategoriesQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetSkillCategoriesQuery, GetSkillCategoriesQueryVariables>(
    GetSkillCategoriesDocument,
    options
  );
}
export type GetSkillCategoriesQueryHookResult = ReturnType<typeof useGetSkillCategoriesQuery>;
export type GetSkillCategoriesLazyQueryHookResult = ReturnType<
  typeof useGetSkillCategoriesLazyQuery
>;
export type GetSkillCategoriesSuspenseQueryHookResult = ReturnType<
  typeof useGetSkillCategoriesSuspenseQuery
>;
export type GetSkillCategoriesQueryResult = Apollo.QueryResult<
  GetSkillCategoriesQuery,
  GetSkillCategoriesQueryVariables
>;
export const GetLeaderboardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetLeaderboard' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'LeaderboardFilterInput' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'LeaderboardSortInput' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationInput' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'leaderboard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'sort' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'sort' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pagination' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'LeaderboardEntryFields' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'cursor' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'PageInfoFields' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LeaderboardEntryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LeaderboardEntry' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'username' } },
          { kind: 'Field', name: { kind: 'Name', value: 'wpm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'accuracy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'score' } },
          { kind: 'Field', name: { kind: 'Name', value: 'level' } },
          { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mistakes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameMode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isVerified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'grade' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PageInfoFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PageInfo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'hasPreviousPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'startCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
          { kind: 'Field', name: { kind: 'Name', value: 'currentPage' } },
          { kind: 'Field', name: { kind: 'Name', value: 'totalPages' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetLeaderboardQuery__
 *
 * To run a query within a React component, call `useGetLeaderboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLeaderboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLeaderboardQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetLeaderboardQuery(
  baseOptions?: Apollo.QueryHookOptions<GetLeaderboardQuery, GetLeaderboardQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(
    GetLeaderboardDocument,
    options
  );
}
export function useGetLeaderboardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetLeaderboardQuery, GetLeaderboardQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(
    GetLeaderboardDocument,
    options
  );
}
// @ts-ignore
export function useGetLeaderboardSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetLeaderboardQuery, GetLeaderboardQueryVariables>
): Apollo.UseSuspenseQueryResult<GetLeaderboardQuery, GetLeaderboardQueryVariables>;
export function useGetLeaderboardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetLeaderboardQuery, GetLeaderboardQueryVariables>
): Apollo.UseSuspenseQueryResult<GetLeaderboardQuery | undefined, GetLeaderboardQueryVariables>;
export function useGetLeaderboardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetLeaderboardQuery, GetLeaderboardQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(
    GetLeaderboardDocument,
    options
  );
}
export type GetLeaderboardQueryHookResult = ReturnType<typeof useGetLeaderboardQuery>;
export type GetLeaderboardLazyQueryHookResult = ReturnType<typeof useGetLeaderboardLazyQuery>;
export type GetLeaderboardSuspenseQueryHookResult = ReturnType<
  typeof useGetLeaderboardSuspenseQuery
>;
export type GetLeaderboardQueryResult = Apollo.QueryResult<
  GetLeaderboardQuery,
  GetLeaderboardQueryVariables
>;
export const GetTodayLeaderboardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTodayLeaderboard' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'gameType' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'GameType' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'todayLeaderboard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'gameType' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'gameType' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'LeaderboardEntryFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LeaderboardEntryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LeaderboardEntry' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'username' } },
          { kind: 'Field', name: { kind: 'Name', value: 'wpm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'accuracy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'score' } },
          { kind: 'Field', name: { kind: 'Name', value: 'level' } },
          { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mistakes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameMode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isVerified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'grade' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetTodayLeaderboardQuery__
 *
 * To run a query within a React component, call `useGetTodayLeaderboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTodayLeaderboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTodayLeaderboardQuery({
 *   variables: {
 *      gameType: // value for 'gameType'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetTodayLeaderboardQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetTodayLeaderboardQuery,
    GetTodayLeaderboardQueryVariables
  > &
    ({ variables: GetTodayLeaderboardQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTodayLeaderboardQuery, GetTodayLeaderboardQueryVariables>(
    GetTodayLeaderboardDocument,
    options
  );
}
export function useGetTodayLeaderboardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetTodayLeaderboardQuery,
    GetTodayLeaderboardQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTodayLeaderboardQuery, GetTodayLeaderboardQueryVariables>(
    GetTodayLeaderboardDocument,
    options
  );
}
// @ts-ignore
export function useGetTodayLeaderboardSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTodayLeaderboardQuery,
    GetTodayLeaderboardQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetTodayLeaderboardQuery, GetTodayLeaderboardQueryVariables>;
export function useGetTodayLeaderboardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetTodayLeaderboardQuery, GetTodayLeaderboardQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetTodayLeaderboardQuery | undefined,
  GetTodayLeaderboardQueryVariables
>;
export function useGetTodayLeaderboardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetTodayLeaderboardQuery, GetTodayLeaderboardQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetTodayLeaderboardQuery, GetTodayLeaderboardQueryVariables>(
    GetTodayLeaderboardDocument,
    options
  );
}
export type GetTodayLeaderboardQueryHookResult = ReturnType<typeof useGetTodayLeaderboardQuery>;
export type GetTodayLeaderboardLazyQueryHookResult = ReturnType<
  typeof useGetTodayLeaderboardLazyQuery
>;
export type GetTodayLeaderboardSuspenseQueryHookResult = ReturnType<
  typeof useGetTodayLeaderboardSuspenseQuery
>;
export type GetTodayLeaderboardQueryResult = Apollo.QueryResult<
  GetTodayLeaderboardQuery,
  GetTodayLeaderboardQueryVariables
>;
export const GetPersonalBestDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPersonalBest' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'gameType' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'GameType' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'personalBest' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'username' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'username' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'gameType' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'gameType' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'LeaderboardEntryFields' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LeaderboardEntryFields' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'LeaderboardEntry' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'username' } },
          { kind: 'Field', name: { kind: 'Name', value: 'wpm' } },
          { kind: 'Field', name: { kind: 'Name', value: 'accuracy' } },
          { kind: 'Field', name: { kind: 'Name', value: 'score' } },
          { kind: 'Field', name: { kind: 'Name', value: 'level' } },
          { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
          { kind: 'Field', name: { kind: 'Name', value: 'mistakes' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameMode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gameType' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isAnonymous' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country' } },
          { kind: 'Field', name: { kind: 'Name', value: 'isVerified' } },
          { kind: 'Field', name: { kind: 'Name', value: 'grade' } },
          { kind: 'Field', name: { kind: 'Name', value: 'rank' } },
          { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetPersonalBestQuery__
 *
 * To run a query within a React component, call `useGetPersonalBestQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonalBestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonalBestQuery({
 *   variables: {
 *      username: // value for 'username'
 *      gameType: // value for 'gameType'
 *   },
 * });
 */
export function useGetPersonalBestQuery(
  baseOptions: Apollo.QueryHookOptions<GetPersonalBestQuery, GetPersonalBestQueryVariables> &
    ({ variables: GetPersonalBestQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPersonalBestQuery, GetPersonalBestQueryVariables>(
    GetPersonalBestDocument,
    options
  );
}
export function useGetPersonalBestLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPersonalBestQuery, GetPersonalBestQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPersonalBestQuery, GetPersonalBestQueryVariables>(
    GetPersonalBestDocument,
    options
  );
}
// @ts-ignore
export function useGetPersonalBestSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetPersonalBestQuery, GetPersonalBestQueryVariables>
): Apollo.UseSuspenseQueryResult<GetPersonalBestQuery, GetPersonalBestQueryVariables>;
export function useGetPersonalBestSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetPersonalBestQuery, GetPersonalBestQueryVariables>
): Apollo.UseSuspenseQueryResult<GetPersonalBestQuery | undefined, GetPersonalBestQueryVariables>;
export function useGetPersonalBestSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetPersonalBestQuery, GetPersonalBestQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetPersonalBestQuery, GetPersonalBestQueryVariables>(
    GetPersonalBestDocument,
    options
  );
}
export type GetPersonalBestQueryHookResult = ReturnType<typeof useGetPersonalBestQuery>;
export type GetPersonalBestLazyQueryHookResult = ReturnType<typeof useGetPersonalBestLazyQuery>;
export type GetPersonalBestSuspenseQueryHookResult = ReturnType<
  typeof useGetPersonalBestSuspenseQuery
>;
export type GetPersonalBestQueryResult = Apollo.QueryResult<
  GetPersonalBestQuery,
  GetPersonalBestQueryVariables
>;
export const GetPlayerRankDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPlayerRank' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'playerRank' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetPlayerRankQuery__
 *
 * To run a query within a React component, call `useGetPlayerRankQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlayerRankQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlayerRankQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPlayerRankQuery(
  baseOptions: Apollo.QueryHookOptions<GetPlayerRankQuery, GetPlayerRankQueryVariables> &
    ({ variables: GetPlayerRankQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPlayerRankQuery, GetPlayerRankQueryVariables>(
    GetPlayerRankDocument,
    options
  );
}
export function useGetPlayerRankLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetPlayerRankQuery, GetPlayerRankQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPlayerRankQuery, GetPlayerRankQueryVariables>(
    GetPlayerRankDocument,
    options
  );
}
// @ts-ignore
export function useGetPlayerRankSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetPlayerRankQuery, GetPlayerRankQueryVariables>
): Apollo.UseSuspenseQueryResult<GetPlayerRankQuery, GetPlayerRankQueryVariables>;
export function useGetPlayerRankSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetPlayerRankQuery, GetPlayerRankQueryVariables>
): Apollo.UseSuspenseQueryResult<GetPlayerRankQuery | undefined, GetPlayerRankQueryVariables>;
export function useGetPlayerRankSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetPlayerRankQuery, GetPlayerRankQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetPlayerRankQuery, GetPlayerRankQueryVariables>(
    GetPlayerRankDocument,
    options
  );
}
export type GetPlayerRankQueryHookResult = ReturnType<typeof useGetPlayerRankQuery>;
export type GetPlayerRankLazyQueryHookResult = ReturnType<typeof useGetPlayerRankLazyQuery>;
export type GetPlayerRankSuspenseQueryHookResult = ReturnType<typeof useGetPlayerRankSuspenseQuery>;
export type GetPlayerRankQueryResult = Apollo.QueryResult<
  GetPlayerRankQuery,
  GetPlayerRankQueryVariables
>;
export const GetStatsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetStats' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'stats' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalProjects' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalSkills' } },
                { kind: 'Field', name: { kind: 'Name', value: 'yearsOfExperience' } },
                { kind: 'Field', name: { kind: 'Name', value: 'leetcodeProblems' } },
                { kind: 'Field', name: { kind: 'Name', value: 'leetcodeRating' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalViews' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalClicks' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projectsByCategory' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'skillsByCategory' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'topTechnologies' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'technology' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetStatsQuery__
 *
 * To run a query within a React component, call `useGetStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStatsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetStatsQuery, GetStatsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetStatsQuery, GetStatsQueryVariables>(GetStatsDocument, options);
}
export function useGetStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetStatsQuery, GetStatsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetStatsQuery, GetStatsQueryVariables>(GetStatsDocument, options);
}
// @ts-ignore
export function useGetStatsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetStatsQuery, GetStatsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetStatsQuery, GetStatsQueryVariables>;
export function useGetStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetStatsQuery, GetStatsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetStatsQuery | undefined, GetStatsQueryVariables>;
export function useGetStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetStatsQuery, GetStatsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetStatsQuery, GetStatsQueryVariables>(GetStatsDocument, options);
}
export type GetStatsQueryHookResult = ReturnType<typeof useGetStatsQuery>;
export type GetStatsLazyQueryHookResult = ReturnType<typeof useGetStatsLazyQuery>;
export type GetStatsSuspenseQueryHookResult = ReturnType<typeof useGetStatsSuspenseQuery>;
export type GetStatsQueryResult = Apollo.QueryResult<GetStatsQuery, GetStatsQueryVariables>;
export const GetAnalyticsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetAnalytics' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'AnalyticsFilterInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'analytics' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'filter' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageViews' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'home' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'projects' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'skills' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'contact' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'projectClicks' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'projectId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'clicks' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'github' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'live' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'demo' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'skillViews' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'skillId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'views' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'uniqueVisitors' } },
                { kind: 'Field', name: { kind: 'Name', value: 'returningVisitors' } },
                { kind: 'Field', name: { kind: 'Name', value: 'averageSessionDuration' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bounceRate' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'trafficSources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'direct' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'search' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'social' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'referral' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'devices' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'desktop' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'mobile' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'tablet' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'countries' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'visits' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'mostViewedProject' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'projectId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'clicks' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'mostViewedSkill' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'skillId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'views' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'periodType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetAnalyticsQuery__
 *
 * To run a query within a React component, call `useGetAnalyticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAnalyticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAnalyticsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetAnalyticsQuery(
  baseOptions: Apollo.QueryHookOptions<GetAnalyticsQuery, GetAnalyticsQueryVariables> &
    ({ variables: GetAnalyticsQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAnalyticsQuery, GetAnalyticsQueryVariables>(
    GetAnalyticsDocument,
    options
  );
}
export function useGetAnalyticsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetAnalyticsQuery, GetAnalyticsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAnalyticsQuery, GetAnalyticsQueryVariables>(
    GetAnalyticsDocument,
    options
  );
}
// @ts-ignore
export function useGetAnalyticsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetAnalyticsQuery, GetAnalyticsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetAnalyticsQuery, GetAnalyticsQueryVariables>;
export function useGetAnalyticsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetAnalyticsQuery, GetAnalyticsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetAnalyticsQuery | undefined, GetAnalyticsQueryVariables>;
export function useGetAnalyticsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetAnalyticsQuery, GetAnalyticsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetAnalyticsQuery, GetAnalyticsQueryVariables>(
    GetAnalyticsDocument,
    options
  );
}
export type GetAnalyticsQueryHookResult = ReturnType<typeof useGetAnalyticsQuery>;
export type GetAnalyticsLazyQueryHookResult = ReturnType<typeof useGetAnalyticsLazyQuery>;
export type GetAnalyticsSuspenseQueryHookResult = ReturnType<typeof useGetAnalyticsSuspenseQuery>;
export type GetAnalyticsQueryResult = Apollo.QueryResult<
  GetAnalyticsQuery,
  GetAnalyticsQueryVariables
>;
export const GetAggregateAnalyticsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetAggregateAnalytics' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'dateFrom' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'dateTo' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'aggregateAnalytics' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dateFrom' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'dateFrom' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dateTo' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'dateTo' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalPageViews' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalUniqueVisitors' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalProjectClicks' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalSkillViews' } },
                { kind: 'Field', name: { kind: 'Name', value: 'averageBounceRate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'averageSessionDuration' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'topProjects' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'projectId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'clicks' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'topSkills' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'skillId' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'views' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetAggregateAnalyticsQuery__
 *
 * To run a query within a React component, call `useGetAggregateAnalyticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAggregateAnalyticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAggregateAnalyticsQuery({
 *   variables: {
 *      dateFrom: // value for 'dateFrom'
 *      dateTo: // value for 'dateTo'
 *   },
 * });
 */
export function useGetAggregateAnalyticsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetAggregateAnalyticsQuery,
    GetAggregateAnalyticsQueryVariables
  > &
    ({ variables: GetAggregateAnalyticsQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAggregateAnalyticsQuery, GetAggregateAnalyticsQueryVariables>(
    GetAggregateAnalyticsDocument,
    options
  );
}
export function useGetAggregateAnalyticsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAggregateAnalyticsQuery,
    GetAggregateAnalyticsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAggregateAnalyticsQuery, GetAggregateAnalyticsQueryVariables>(
    GetAggregateAnalyticsDocument,
    options
  );
}
// @ts-ignore
export function useGetAggregateAnalyticsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetAggregateAnalyticsQuery,
    GetAggregateAnalyticsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetAggregateAnalyticsQuery, GetAggregateAnalyticsQueryVariables>;
export function useGetAggregateAnalyticsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAggregateAnalyticsQuery,
        GetAggregateAnalyticsQueryVariables
      >
): Apollo.UseSuspenseQueryResult<
  GetAggregateAnalyticsQuery | undefined,
  GetAggregateAnalyticsQueryVariables
>;
export function useGetAggregateAnalyticsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetAggregateAnalyticsQuery,
        GetAggregateAnalyticsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetAggregateAnalyticsQuery, GetAggregateAnalyticsQueryVariables>(
    GetAggregateAnalyticsDocument,
    options
  );
}
export type GetAggregateAnalyticsQueryHookResult = ReturnType<typeof useGetAggregateAnalyticsQuery>;
export type GetAggregateAnalyticsLazyQueryHookResult = ReturnType<
  typeof useGetAggregateAnalyticsLazyQuery
>;
export type GetAggregateAnalyticsSuspenseQueryHookResult = ReturnType<
  typeof useGetAggregateAnalyticsSuspenseQuery
>;
export type GetAggregateAnalyticsQueryResult = Apollo.QueryResult<
  GetAggregateAnalyticsQuery,
  GetAggregateAnalyticsQueryVariables
>;
export const GetRecentAnalyticsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetRecentAnalytics' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'days' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'recentAnalytics' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'days' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'days' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageViews' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'home' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'projects' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'skills' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'contact' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'uniqueVisitors' } },
                { kind: 'Field', name: { kind: 'Name', value: 'bounceRate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'timestamp' } },
                { kind: 'Field', name: { kind: 'Name', value: 'periodType' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetRecentAnalyticsQuery__
 *
 * To run a query within a React component, call `useGetRecentAnalyticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecentAnalyticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecentAnalyticsQuery({
 *   variables: {
 *      days: // value for 'days'
 *   },
 * });
 */
export function useGetRecentAnalyticsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetRecentAnalyticsQuery, GetRecentAnalyticsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRecentAnalyticsQuery, GetRecentAnalyticsQueryVariables>(
    GetRecentAnalyticsDocument,
    options
  );
}
export function useGetRecentAnalyticsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRecentAnalyticsQuery,
    GetRecentAnalyticsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetRecentAnalyticsQuery, GetRecentAnalyticsQueryVariables>(
    GetRecentAnalyticsDocument,
    options
  );
}
// @ts-ignore
export function useGetRecentAnalyticsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetRecentAnalyticsQuery,
    GetRecentAnalyticsQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetRecentAnalyticsQuery, GetRecentAnalyticsQueryVariables>;
export function useGetRecentAnalyticsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetRecentAnalyticsQuery, GetRecentAnalyticsQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetRecentAnalyticsQuery | undefined,
  GetRecentAnalyticsQueryVariables
>;
export function useGetRecentAnalyticsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetRecentAnalyticsQuery, GetRecentAnalyticsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetRecentAnalyticsQuery, GetRecentAnalyticsQueryVariables>(
    GetRecentAnalyticsDocument,
    options
  );
}
export type GetRecentAnalyticsQueryHookResult = ReturnType<typeof useGetRecentAnalyticsQuery>;
export type GetRecentAnalyticsLazyQueryHookResult = ReturnType<
  typeof useGetRecentAnalyticsLazyQuery
>;
export type GetRecentAnalyticsSuspenseQueryHookResult = ReturnType<
  typeof useGetRecentAnalyticsSuspenseQuery
>;
export type GetRecentAnalyticsQueryResult = Apollo.QueryResult<
  GetRecentAnalyticsQuery,
  GetRecentAnalyticsQueryVariables
>;
export const GetContactMessagesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetContactMessages' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'MessageStatus' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationInput' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'contactMessages' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'status' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pagination' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'subject' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isSpam' } },
                { kind: 'Field', name: { kind: 'Name', value: 'spamScore' } },
                { kind: 'Field', name: { kind: 'Name', value: 'ipAddress' } },
                { kind: 'Field', name: { kind: 'Name', value: 'userAgent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'adminNotes' } },
                { kind: 'Field', name: { kind: 'Name', value: 'repliedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isRecent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'daysSinceCreation' } },
                { kind: 'Field', name: { kind: 'Name', value: 'responseTime' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetContactMessagesQuery__
 *
 * To run a query within a React component, call `useGetContactMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetContactMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetContactMessagesQuery({
 *   variables: {
 *      status: // value for 'status'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetContactMessagesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetContactMessagesQuery, GetContactMessagesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetContactMessagesQuery, GetContactMessagesQueryVariables>(
    GetContactMessagesDocument,
    options
  );
}
export function useGetContactMessagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetContactMessagesQuery,
    GetContactMessagesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetContactMessagesQuery, GetContactMessagesQueryVariables>(
    GetContactMessagesDocument,
    options
  );
}
// @ts-ignore
export function useGetContactMessagesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetContactMessagesQuery,
    GetContactMessagesQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetContactMessagesQuery, GetContactMessagesQueryVariables>;
export function useGetContactMessagesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetContactMessagesQuery, GetContactMessagesQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetContactMessagesQuery | undefined,
  GetContactMessagesQueryVariables
>;
export function useGetContactMessagesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetContactMessagesQuery, GetContactMessagesQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetContactMessagesQuery, GetContactMessagesQueryVariables>(
    GetContactMessagesDocument,
    options
  );
}
export type GetContactMessagesQueryHookResult = ReturnType<typeof useGetContactMessagesQuery>;
export type GetContactMessagesLazyQueryHookResult = ReturnType<
  typeof useGetContactMessagesLazyQuery
>;
export type GetContactMessagesSuspenseQueryHookResult = ReturnType<
  typeof useGetContactMessagesSuspenseQuery
>;
export type GetContactMessagesQueryResult = Apollo.QueryResult<
  GetContactMessagesQuery,
  GetContactMessagesQueryVariables
>;
export const GetPendingMessagesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPendingMessages' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'pendingMessages' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'subject' } },
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isRecent' } },
                { kind: 'Field', name: { kind: 'Name', value: 'daysSinceCreation' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetPendingMessagesQuery__
 *
 * To run a query within a React component, call `useGetPendingMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPendingMessagesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPendingMessagesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetPendingMessagesQuery, GetPendingMessagesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPendingMessagesQuery, GetPendingMessagesQueryVariables>(
    GetPendingMessagesDocument,
    options
  );
}
export function useGetPendingMessagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPendingMessagesQuery,
    GetPendingMessagesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPendingMessagesQuery, GetPendingMessagesQueryVariables>(
    GetPendingMessagesDocument,
    options
  );
}
// @ts-ignore
export function useGetPendingMessagesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetPendingMessagesQuery,
    GetPendingMessagesQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetPendingMessagesQuery, GetPendingMessagesQueryVariables>;
export function useGetPendingMessagesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetPendingMessagesQuery, GetPendingMessagesQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetPendingMessagesQuery | undefined,
  GetPendingMessagesQueryVariables
>;
export function useGetPendingMessagesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetPendingMessagesQuery, GetPendingMessagesQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetPendingMessagesQuery, GetPendingMessagesQueryVariables>(
    GetPendingMessagesDocument,
    options
  );
}
export type GetPendingMessagesQueryHookResult = ReturnType<typeof useGetPendingMessagesQuery>;
export type GetPendingMessagesLazyQueryHookResult = ReturnType<
  typeof useGetPendingMessagesLazyQuery
>;
export type GetPendingMessagesSuspenseQueryHookResult = ReturnType<
  typeof useGetPendingMessagesSuspenseQuery
>;
export type GetPendingMessagesQueryResult = Apollo.QueryResult<
  GetPendingMessagesQuery,
  GetPendingMessagesQueryVariables
>;
export const GetSpamStatsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetSpamStats' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'spamStats' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                { kind: 'Field', name: { kind: 'Name', value: 'spam' } },
                { kind: 'Field', name: { kind: 'Name', value: 'spamRate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode;

/**
 * __useGetSpamStatsQuery__
 *
 * To run a query within a React component, call `useGetSpamStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSpamStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSpamStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSpamStatsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetSpamStatsQuery, GetSpamStatsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSpamStatsQuery, GetSpamStatsQueryVariables>(
    GetSpamStatsDocument,
    options
  );
}
export function useGetSpamStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetSpamStatsQuery, GetSpamStatsQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSpamStatsQuery, GetSpamStatsQueryVariables>(
    GetSpamStatsDocument,
    options
  );
}
// @ts-ignore
export function useGetSpamStatsSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetSpamStatsQuery, GetSpamStatsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetSpamStatsQuery, GetSpamStatsQueryVariables>;
export function useGetSpamStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetSpamStatsQuery, GetSpamStatsQueryVariables>
): Apollo.UseSuspenseQueryResult<GetSpamStatsQuery | undefined, GetSpamStatsQueryVariables>;
export function useGetSpamStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetSpamStatsQuery, GetSpamStatsQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetSpamStatsQuery, GetSpamStatsQueryVariables>(
    GetSpamStatsDocument,
    options
  );
}
export type GetSpamStatsQueryHookResult = ReturnType<typeof useGetSpamStatsQuery>;
export type GetSpamStatsLazyQueryHookResult = ReturnType<typeof useGetSpamStatsLazyQuery>;
export type GetSpamStatsSuspenseQueryHookResult = ReturnType<typeof useGetSpamStatsSuspenseQuery>;
export type GetSpamStatsQueryResult = Apollo.QueryResult<
  GetSpamStatsQuery,
  GetSpamStatsQueryVariables
>;
