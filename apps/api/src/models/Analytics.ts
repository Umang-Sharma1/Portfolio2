import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// ============================================================================
// ENUMS & TYPES
// ============================================================================
export const PERIOD_TYPES = ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'] as const;
export const TRAFFIC_SOURCES = ['direct', 'search', 'social', 'referral', 'email', 'paid'] as const;
export const DEVICE_TYPES = ['desktop', 'mobile', 'tablet'] as const;

export type PeriodType = (typeof PERIOD_TYPES)[number];
export type TrafficSource = (typeof TRAFFIC_SOURCES)[number];
export type DeviceType = (typeof DEVICE_TYPES)[number];

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

export interface IPageViews {
  home: number;
  projects: number;
  skills: number;
  contact: number;
  blog?: number;
  about?: number;
  total: number;
}

export interface IProjectClick {
  projectId: string;
  title: string;
  slug?: string;
  clicks: {
    github: number;
    live: number;
    demo: number;
    total: number;
  };
}

export interface ISkillView {
  skillId: string;
  name: string;
  views: number;
}

export interface ITrafficSources {
  direct: number;
  search: number;
  social: number;
  referral: number;
  email: number;
  paid: number;
}

export interface IDevices {
  desktop: number;
  mobile: number;
  tablet: number;
}

export interface IBrowserStats {
  chrome: number;
  firefox: number;
  safari: number;
  edge: number;
  other: number;
}

// Base interface
export interface IAnalyticsBase {
  pageViews: IPageViews;
  projectClicks: IProjectClick[];
  skillViews: ISkillView[];

  // User metrics
  uniqueVisitors: number;
  returningVisitors: number;
  newVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;

  // Traffic breakdown
  trafficSources: ITrafficSources;
  devices: IDevices;
  browsers: IBrowserStats;

  // Geographic data
  countries: Map<string, number>;
  cities: Map<string, number>;

  // Engagement metrics
  avgPagesPerSession: number;
  avgTimeOnPage: number;
  exitRate: number;

  // Time tracking
  timestamp: Date;
  periodType: PeriodType;

  // Performance metrics
  avgPageLoadTime: number;
  serverResponseTime: number;
}

// Document interface
export interface IAnalytics extends IAnalyticsBase, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  mostViewedProject: { projectId: string; title: string; clicks: number } | null;
  mostViewedSkill: { skillId: string; name: string; views: number } | null;
  engagementScore: number;
  topCountry: { code: string; visits: number } | null;

  // Instance Methods
  getTotalProjectClicks(): number;
  getTotalSkillViews(): number;
  getTopProjects(limit?: number): IProjectClick[];
  getTopSkills(limit?: number): ISkillView[];
  getTrafficBreakdown(): { source: string; count: number; percentage: number }[];
  getDeviceBreakdown(): { device: string; count: number; percentage: number }[];
}

// Static methods interface
export interface IAnalyticsModel extends Model<IAnalytics> {
  getByDateRange(startDate: Date, endDate: Date, periodType?: PeriodType): Promise<IAnalytics[]>;
  getLastNDays(days?: number): Promise<IAnalytics[]>;
  getAggregateStats(startDate: Date, endDate: Date): Promise<AggregateStats>;
  getDailyTrends(days?: number): Promise<DailyTrend[]>;
  getTrafficComparison(currentPeriod: Date, previousPeriod: Date): Promise<TrafficComparison>;
  recordPageView(page: keyof IPageViews): Promise<IAnalytics>;
  recordProjectClick(
    projectId: string,
    title: string,
    clickType: 'github' | 'live' | 'demo'
  ): Promise<void>;
  getYearOverYearGrowth(): Promise<YearOverYearGrowth>;
}

// Helper types
export interface AggregateStats {
  totalPageViews: number;
  totalUniqueVisitors: number;
  totalProjectClicks: number;
  totalSkillViews: number;
  averageBounceRate: number;
  averageSessionDuration: number;
  topProjects: { title: string; clicks: number }[];
  topSkills: { name: string; views: number }[];
  trafficSourcesTotals: ITrafficSources;
  devicesTotals: IDevices;
}

export interface DailyTrend {
  date: Date;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
}

export interface TrafficComparison {
  current: { pageViews: number; visitors: number; bounceRate: number };
  previous: { pageViews: number; visitors: number; bounceRate: number };
  change: { pageViews: number; visitors: number; bounceRate: number };
}

export interface YearOverYearGrowth {
  currentYear: { visitors: number; pageViews: number };
  previousYear: { visitors: number; pageViews: number };
  growthPercentage: { visitors: number; pageViews: number };
}

// ============================================================================
// MONGOOSE SCHEMA
// ============================================================================
const analyticsSchema = new Schema<IAnalytics>(
  {
    pageViews: {
      home: { type: Number, default: 0, min: 0 },
      projects: { type: Number, default: 0, min: 0 },
      skills: { type: Number, default: 0, min: 0 },
      contact: { type: Number, default: 0, min: 0 },
      blog: { type: Number, default: 0, min: 0 },
      about: { type: Number, default: 0, min: 0 },
      total: { type: Number, default: 0, min: 0 },
    },
    projectClicks: [
      {
        projectId: { type: String, required: true },
        title: { type: String, required: true },
        slug: { type: String },
        clicks: {
          github: { type: Number, default: 0, min: 0 },
          live: { type: Number, default: 0, min: 0 },
          demo: { type: Number, default: 0, min: 0 },
          total: { type: Number, default: 0, min: 0 },
        },
      },
    ],
    skillViews: [
      {
        skillId: { type: String, required: true },
        name: { type: String, required: true },
        views: { type: Number, default: 0, min: 0 },
      },
    ],
    uniqueVisitors: { type: Number, default: 0, min: 0 },
    returningVisitors: { type: Number, default: 0, min: 0 },
    newVisitors: { type: Number, default: 0, min: 0 },
    averageSessionDuration: { type: Number, default: 0, min: 0 },
    bounceRate: { type: Number, default: 0, min: 0, max: 100 },
    trafficSources: {
      direct: { type: Number, default: 0, min: 0 },
      search: { type: Number, default: 0, min: 0 },
      social: { type: Number, default: 0, min: 0 },
      referral: { type: Number, default: 0, min: 0 },
      email: { type: Number, default: 0, min: 0 },
      paid: { type: Number, default: 0, min: 0 },
    },
    devices: {
      desktop: { type: Number, default: 0, min: 0 },
      mobile: { type: Number, default: 0, min: 0 },
      tablet: { type: Number, default: 0, min: 0 },
    },
    browsers: {
      chrome: { type: Number, default: 0, min: 0 },
      firefox: { type: Number, default: 0, min: 0 },
      safari: { type: Number, default: 0, min: 0 },
      edge: { type: Number, default: 0, min: 0 },
      other: { type: Number, default: 0, min: 0 },
    },
    countries: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    cities: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    avgPagesPerSession: { type: Number, default: 0, min: 0 },
    avgTimeOnPage: { type: Number, default: 0, min: 0 },
    exitRate: { type: Number, default: 0, min: 0, max: 100 },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    periodType: {
      type: String,
      enum: {
        values: PERIOD_TYPES,
        message: '{VALUE} is not a valid period type',
      },
      required: true,
      default: 'DAILY',
      index: true,
    },
    avgPageLoadTime: { type: Number, default: 0, min: 0 },
    serverResponseTime: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================================
// INDEXES - Optimized for time-series analytics queries
// ============================================================================

/**
 * INDEX 1: Compound index for timestamp + periodType
 * Use Case: "Show daily analytics for last 30 days"
 * Performance: O(log n) - essential for dashboard date filtering
 */
analyticsSchema.index({ timestamp: -1, periodType: 1 });

/**
 * INDEX 2: Period type + timestamp
 * Use Case: "Get all DAILY records sorted by time"
 * Performance: O(log n) - grouped queries by period
 */
analyticsSchema.index({ periodType: 1, timestamp: -1 });

/**
 * INDEX 3: Unique visitors descending
 * Use Case: "Find peak traffic days"
 * Performance: O(1) for sorted retrieval
 */
analyticsSchema.index({ uniqueVisitors: -1 });

/**
 * INDEX 4: Total page views descending
 * Use Case: "Most engaging time periods"
 * Performance: O(1) for sorted retrieval
 */
analyticsSchema.index({ 'pageViews.total': -1 });

/**
 * INDEX 5: TTL index - auto-delete old records
 * Use Case: Keep only 2 years of data
 * Performance: Automatic cleanup
 */
analyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 63072000 }); // 2 years

/**
 * INDEX 6: Bounce rate for quality analysis
 * Use Case: "Find periods with high bounce rates"
 * Performance: O(log n)
 */
analyticsSchema.index({ bounceRate: -1, timestamp: -1 });

/**
 * INDEX 7: Compound for dashboard queries
 * Use Case: Multi-metric dashboard loading
 * Performance: O(log n) - covers common dashboard queries
 */
analyticsSchema.index({ periodType: 1, timestamp: -1, uniqueVisitors: -1, 'pageViews.total': -1 });

// ============================================================================
// PRE-SAVE HOOKS
// ============================================================================

/**
 * Calculate totals before saving
 */
analyticsSchema.pre('save', function (next) {
  // Auto-calculate total page views
  this.pageViews.total =
    (this.pageViews.home || 0) +
    (this.pageViews.projects || 0) +
    (this.pageViews.skills || 0) +
    (this.pageViews.contact || 0) +
    (this.pageViews.blog || 0) +
    (this.pageViews.about || 0);

  // Auto-calculate total clicks for each project
  this.projectClicks.forEach((project) => {
    project.clicks.total =
      (project.clicks.github || 0) + (project.clicks.live || 0) + (project.clicks.demo || 0);
  });

  // Calculate new visitors
  this.newVisitors = Math.max(0, this.uniqueVisitors - this.returningVisitors);

  next();
});

// ============================================================================
// VIRTUALS
// ============================================================================

/**
 * Most viewed project
 */
analyticsSchema.virtual('mostViewedProject').get(function () {
  if (!this.projectClicks || this.projectClicks.length === 0) return null;

  const sorted = [...this.projectClicks].sort((a, b) => b.clicks.total - a.clicks.total);
  const top = sorted[0];

  return {
    projectId: top.projectId,
    title: top.title,
    clicks: top.clicks.total,
  };
});

/**
 * Most viewed skill
 */
analyticsSchema.virtual('mostViewedSkill').get(function () {
  if (!this.skillViews || this.skillViews.length === 0) return null;

  const sorted = [...this.skillViews].sort((a, b) => b.views - a.views);
  const top = sorted[0];

  return {
    skillId: top.skillId,
    name: top.name,
    views: top.views,
  };
});

/**
 * Engagement score (0-100)
 * Based on bounce rate, session duration, and pages per session
 */
analyticsSchema.virtual('engagementScore').get(function () {
  const bounceScore = Math.max(0, 100 - this.bounceRate);
  const durationScore = Math.min(100, (this.averageSessionDuration / 300) * 100); // 5 min = 100
  const pagesScore = Math.min(100, this.avgPagesPerSession * 25); // 4 pages = 100

  return Math.round(bounceScore * 0.3 + durationScore * 0.4 + pagesScore * 0.3);
});

/**
 * Top country by visits
 */
analyticsSchema.virtual('topCountry').get(function () {
  if (!this.countries || this.countries.size === 0) return null;

  let topCode = '';
  let topVisits = 0;

  this.countries.forEach((visits, code) => {
    if (visits > topVisits) {
      topVisits = visits;
      topCode = code;
    }
  });

  return topCode ? { code: topCode, visits: topVisits } : null;
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Get total project clicks across all projects
 */
analyticsSchema.methods.getTotalProjectClicks = function (): number {
  return this.projectClicks.reduce(
    (sum: number, project: IProjectClick) => sum + project.clicks.total,
    0
  );
};

/**
 * Get total skill views across all skills
 */
analyticsSchema.methods.getTotalSkillViews = function (): number {
  return this.skillViews.reduce((sum: number, skill: ISkillView) => sum + skill.views, 0);
};

/**
 * Get top N projects by clicks
 */
analyticsSchema.methods.getTopProjects = function (limit = 5): IProjectClick[] {
  return [...this.projectClicks].sort((a, b) => b.clicks.total - a.clicks.total).slice(0, limit);
};

/**
 * Get top N skills by views
 */
analyticsSchema.methods.getTopSkills = function (limit = 5): ISkillView[] {
  return [...this.skillViews].sort((a, b) => b.views - a.views).slice(0, limit);
};

/**
 * Get traffic source breakdown with percentages
 */
analyticsSchema.methods.getTrafficBreakdown = function (): {
  source: string;
  count: number;
  percentage: number;
}[] {
  const sources = this.trafficSources;
  const total = Object.values(sources).reduce((sum: number, val: any) => sum + (val || 0), 0);

  if (total === 0) return [];

  return Object.entries(sources)
    .map(([source, count]) => ({
      source,
      count: count as number,
      percentage: Math.round(((count as number) / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Get device breakdown with percentages
 */
analyticsSchema.methods.getDeviceBreakdown = function (): {
  device: string;
  count: number;
  percentage: number;
}[] {
  const devices = this.devices;
  const total = Object.values(devices).reduce((sum: number, val: any) => sum + (val || 0), 0);

  if (total === 0) return [];

  return Object.entries(devices)
    .map(([device, count]) => ({
      device,
      count: count as number,
      percentage: Math.round(((count as number) / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Get analytics for date range
 */
analyticsSchema.statics.getByDateRange = function (
  startDate: Date,
  endDate: Date,
  periodType?: PeriodType
): Promise<IAnalytics[]> {
  const query: any = {
    timestamp: { $gte: startDate, $lte: endDate },
  };

  if (periodType) {
    query.periodType = periodType;
  }

  return this.find(query).sort({ timestamp: -1 }).lean().exec();
};

/**
 * Get analytics for last N days
 */
analyticsSchema.statics.getLastNDays = function (days = 30): Promise<IAnalytics[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return this.find({
    timestamp: { $gte: startDate },
    periodType: 'DAILY',
  })
    .sort({ timestamp: -1 })
    .lean()
    .exec();
};

/**
 * Get aggregate statistics for date range
 */
analyticsSchema.statics.getAggregateStats = async function (
  startDate: Date,
  endDate: Date
): Promise<AggregateStats> {
  const [result] = await this.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalPageViews: { $sum: '$pageViews.total' },
        totalUniqueVisitors: { $sum: '$uniqueVisitors' },
        avgBounceRate: { $avg: '$bounceRate' },
        avgSessionDuration: { $avg: '$averageSessionDuration' },
        directTraffic: { $sum: '$trafficSources.direct' },
        searchTraffic: { $sum: '$trafficSources.search' },
        socialTraffic: { $sum: '$trafficSources.social' },
        referralTraffic: { $sum: '$trafficSources.referral' },
        emailTraffic: { $sum: '$trafficSources.email' },
        paidTraffic: { $sum: '$trafficSources.paid' },
        desktopUsers: { $sum: '$devices.desktop' },
        mobileUsers: { $sum: '$devices.mobile' },
        tabletUsers: { $sum: '$devices.tablet' },
        projectClicks: { $push: '$projectClicks' },
        skillViews: { $push: '$skillViews' },
      },
    },
  ]);

  if (!result) {
    return {
      totalPageViews: 0,
      totalUniqueVisitors: 0,
      totalProjectClicks: 0,
      totalSkillViews: 0,
      averageBounceRate: 0,
      averageSessionDuration: 0,
      topProjects: [],
      topSkills: [],
      trafficSourcesTotals: { direct: 0, search: 0, social: 0, referral: 0, email: 0, paid: 0 },
      devicesTotals: { desktop: 0, mobile: 0, tablet: 0 },
    };
  }

  // Aggregate project clicks
  const projectClicksMap = new Map<string, { title: string; clicks: number }>();
  result.projectClicks.flat().forEach((pc: IProjectClick) => {
    const existing = projectClicksMap.get(pc.projectId) || { title: pc.title, clicks: 0 };
    existing.clicks += pc.clicks.total;
    projectClicksMap.set(pc.projectId, existing);
  });

  // Aggregate skill views
  const skillViewsMap = new Map<string, { name: string; views: number }>();
  result.skillViews.flat().forEach((sv: ISkillView) => {
    const existing = skillViewsMap.get(sv.skillId) || { name: sv.name, views: 0 };
    existing.views += sv.views;
    skillViewsMap.set(sv.skillId, existing);
  });

  const topProjects = Array.from(projectClicksMap.values())
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  const topSkills = Array.from(skillViewsMap.values())
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return {
    totalPageViews: result.totalPageViews,
    totalUniqueVisitors: result.totalUniqueVisitors,
    totalProjectClicks: topProjects.reduce((sum, p) => sum + p.clicks, 0),
    totalSkillViews: topSkills.reduce((sum, s) => sum + s.views, 0),
    averageBounceRate: Math.round(result.avgBounceRate || 0),
    averageSessionDuration: Math.round(result.avgSessionDuration || 0),
    topProjects,
    topSkills,
    trafficSourcesTotals: {
      direct: result.directTraffic,
      search: result.searchTraffic,
      social: result.socialTraffic,
      referral: result.referralTraffic,
      email: result.emailTraffic,
      paid: result.paidTraffic,
    },
    devicesTotals: {
      desktop: result.desktopUsers,
      mobile: result.mobileUsers,
      tablet: result.tabletUsers,
    },
  };
};

/**
 * Get daily trends for charting
 */
analyticsSchema.statics.getDailyTrends = function (days = 30): Promise<DailyTrend[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate },
        periodType: 'DAILY',
      },
    },
    {
      $project: {
        date: '$timestamp',
        pageViews: '$pageViews.total',
        uniqueVisitors: 1,
        bounceRate: 1,
      },
    },
    { $sort: { date: 1 } },
  ]).exec();
};

/**
 * Compare traffic between two periods
 */
analyticsSchema.statics.getTrafficComparison = async function (
  currentStart: Date,
  previousStart: Date
): Promise<TrafficComparison> {
  const periodLength = currentStart.getTime() - previousStart.getTime();
  const currentEnd = new Date(currentStart.getTime() + periodLength);
  const previousEnd = currentStart;

  const [current, previous] = await Promise.all([
    this.aggregate([
      { $match: { timestamp: { $gte: currentStart, $lt: currentEnd } } },
      {
        $group: {
          _id: null,
          pageViews: { $sum: '$pageViews.total' },
          visitors: { $sum: '$uniqueVisitors' },
          bounceRate: { $avg: '$bounceRate' },
        },
      },
    ]),
    this.aggregate([
      { $match: { timestamp: { $gte: previousStart, $lt: previousEnd } } },
      {
        $group: {
          _id: null,
          pageViews: { $sum: '$pageViews.total' },
          visitors: { $sum: '$uniqueVisitors' },
          bounceRate: { $avg: '$bounceRate' },
        },
      },
    ]),
  ]);

  const curr = current[0] || { pageViews: 0, visitors: 0, bounceRate: 0 };
  const prev = previous[0] || { pageViews: 0, visitors: 0, bounceRate: 0 };

  const calcChange = (c: number, p: number) => (p === 0 ? 100 : Math.round(((c - p) / p) * 100));

  return {
    current: {
      pageViews: curr.pageViews,
      visitors: curr.visitors,
      bounceRate: Math.round(curr.bounceRate),
    },
    previous: {
      pageViews: prev.pageViews,
      visitors: prev.visitors,
      bounceRate: Math.round(prev.bounceRate),
    },
    change: {
      pageViews: calcChange(curr.pageViews, prev.pageViews),
      visitors: calcChange(curr.visitors, prev.visitors),
      bounceRate: calcChange(curr.bounceRate, prev.bounceRate),
    },
  };
};

/**
 * Record a page view (upsert today's record)
 */
analyticsSchema.statics.recordPageView = async function (
  page: keyof IPageViews
): Promise<IAnalytics> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return this.findOneAndUpdate(
    { timestamp: today, periodType: 'DAILY' },
    { $inc: { [`pageViews.${page}`]: 1 } },
    { upsert: true, new: true }
  ).exec();
};

/**
 * Record a project click
 */
analyticsSchema.statics.recordProjectClick = async function (
  projectId: string,
  title: string,
  clickType: 'github' | 'live' | 'demo'
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // First try to update existing project entry
  const result = await this.updateOne(
    {
      timestamp: today,
      periodType: 'DAILY',
      'projectClicks.projectId': projectId,
    },
    { $inc: { [`projectClicks.$.clicks.${clickType}`]: 1 } }
  );

  // If no existing entry, add new one
  if (result.matchedCount === 0) {
    await this.findOneAndUpdate(
      { timestamp: today, periodType: 'DAILY' },
      {
        $push: {
          projectClicks: {
            projectId,
            title,
            clicks: { [clickType]: 1, total: 1 },
          },
        },
      },
      { upsert: true }
    );
  }
};

/**
 * Get year over year growth
 */
analyticsSchema.statics.getYearOverYearGrowth = async function (): Promise<YearOverYearGrowth> {
  const now = new Date();
  const currentYearStart = new Date(now.getFullYear(), 0, 1);
  const previousYearStart = new Date(now.getFullYear() - 1, 0, 1);
  const previousYearEnd = new Date(now.getFullYear(), 0, 1);

  const [current, previous] = await Promise.all([
    this.aggregate([
      { $match: { timestamp: { $gte: currentYearStart } } },
      {
        $group: {
          _id: null,
          visitors: { $sum: '$uniqueVisitors' },
          pageViews: { $sum: '$pageViews.total' },
        },
      },
    ]),
    this.aggregate([
      { $match: { timestamp: { $gte: previousYearStart, $lt: previousYearEnd } } },
      {
        $group: {
          _id: null,
          visitors: { $sum: '$uniqueVisitors' },
          pageViews: { $sum: '$pageViews.total' },
        },
      },
    ]),
  ]);

  const curr = current[0] || { visitors: 0, pageViews: 0 };
  const prev = previous[0] || { visitors: 0, pageViews: 0 };

  const calcGrowth = (c: number, p: number) => (p === 0 ? 100 : Math.round(((c - p) / p) * 100));

  return {
    currentYear: { visitors: curr.visitors, pageViews: curr.pageViews },
    previousYear: { visitors: prev.visitors, pageViews: prev.pageViews },
    growthPercentage: {
      visitors: calcGrowth(curr.visitors, prev.visitors),
      pageViews: calcGrowth(curr.pageViews, prev.pageViews),
    },
  };
};

// ============================================================================
// POST HOOKS
// ============================================================================

analyticsSchema.post('save', function (doc) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `📊 Analytics saved for ${doc.timestamp.toISOString()} - ${doc.pageViews.total} page views`
    );
  }
});

// ============================================================================
// MODEL EXPORT
// ============================================================================
export const Analytics = mongoose.model<IAnalytics, IAnalyticsModel>('Analytics', analyticsSchema);
