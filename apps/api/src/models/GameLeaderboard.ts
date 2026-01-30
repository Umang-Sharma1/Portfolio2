import mongoose, { Schema, Document, Model, Types } from 'mongoose';

// ============================================================================
// ENUMS & TYPES
// ============================================================================
export const GAME_MODES = ['EASY', 'MEDIUM', 'HARD', 'EXPERT', 'NIGHTMARE'] as const;
export const GAME_TYPES = ['TYPING', 'QUIZ', 'CODE_CHALLENGE', 'MEMORY', 'PUZZLE'] as const;
export const GRADES = ['S+', 'S', 'A', 'B', 'C', 'D', 'F'] as const;

export type GameMode = (typeof GAME_MODES)[number];
export type GameType = (typeof GAME_TYPES)[number];
export type Grade = (typeof GRADES)[number];

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================

// Base interface
export interface IGameLeaderboardBase {
  username: string;
  wpm: number;
  accuracy: number;
  score: number;
  level: number;
  duration: number;
  mistakes: number;

  // Game settings
  gameMode: GameMode;
  gameType: GameType;

  // Player metadata
  isAnonymous: boolean;
  userId?: string;

  // Session info
  ipAddress?: string;
  userAgent?: string;
  country?: string;
  city?: string;

  // Streaks & achievements
  streak: number;
  perfectRounds: number;
  achievements: string[];

  // Verification
  isVerified: boolean;
  verificationFlags: string[];
  timestamp: Date;
}

// Document interface
export interface IGameLeaderboard extends IGameLeaderboardBase, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  grade: Grade;
  rank: number;
  isTopScore: boolean;
  performanceRating: string;

  // Instance Methods
  calculateScore(): number;
  checkIsTopScore(): Promise<boolean>;
  getGrade(): Grade;
  getRank(): Promise<number>;
  getPercentile(): Promise<number>;
}

// Static methods interface
export interface IGameLeaderboardModel extends Model<IGameLeaderboard> {
  getTopScores(gameType: GameType, gameMode: GameMode, limit?: number): Promise<IGameLeaderboard[]>;
  getPersonalBest(username: string, gameType: GameType): Promise<IGameLeaderboard | null>;
  getTodayTop(gameType: GameType, limit?: number): Promise<IGameLeaderboard[]>;
  getPlayerRank(scoreId: string): Promise<number | null>;
  checkDuplicate(ipAddress: string, username: string): Promise<boolean>;
  getGlobalStats(): Promise<GlobalStats>;
  getPlayerStats(username: string): Promise<PlayerStats | null>;
  getLeaderboardByCountry(
    country: string,
    gameType: GameType,
    limit?: number
  ): Promise<IGameLeaderboard[]>;
  getWeeklyChampions(gameType: GameType): Promise<IGameLeaderboard[]>;
  getStreakLeaders(limit?: number): Promise<IGameLeaderboard[]>;
}

// Helper types
export interface GlobalStats {
  totalGames: number;
  totalPlayers: number;
  averageWpm: number;
  averageAccuracy: number;
  highestScore: number;
  byGameType: Record<GameType, { games: number; avgScore: number }>;
  byGameMode: Record<GameMode, { games: number; avgScore: number }>;
}

export interface PlayerStats {
  username: string;
  totalGames: number;
  averageWpm: number;
  averageAccuracy: number;
  highestScore: number;
  favoriteGameType: GameType;
  favoriteGameMode: GameMode;
  bestGrade: Grade;
  totalPlayTime: number;
  achievements: string[];
  rankByGameType: Record<GameType, number>;
}

export interface DifficultyMultipliers {
  EASY: number;
  MEDIUM: number;
  HARD: number;
  EXPERT: number;
  NIGHTMARE: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const DIFFICULTY_MULTIPLIERS: DifficultyMultipliers = {
  EASY: 1.0,
  MEDIUM: 1.5,
  HARD: 2.0,
  EXPERT: 3.0,
  NIGHTMARE: 5.0,
};

const GRADE_THRESHOLDS: Record<GameMode, Record<Grade, number>> = {
  EASY: { 'S+': 200, S: 150, A: 100, B: 70, C: 50, D: 30, F: 0 },
  MEDIUM: { 'S+': 300, S: 200, A: 150, B: 100, C: 70, D: 50, F: 0 },
  HARD: { 'S+': 450, S: 300, A: 200, B: 150, C: 100, D: 70, F: 0 },
  EXPERT: { 'S+': 700, S: 500, A: 350, B: 250, C: 150, D: 100, F: 0 },
  NIGHTMARE: { 'S+': 1200, S: 900, A: 600, B: 400, C: 250, D: 150, F: 0 },
};

// ============================================================================
// MONGOOSE SCHEMA
// ============================================================================
const gameLeaderboardSchema = new Schema<IGameLeaderboard>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [2, 'Username must be at least 2 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      validate: {
        validator: function (v: string) {
          return /^[a-zA-Z0-9_-]+$/.test(v);
        },
        message: 'Username can only contain letters, numbers, underscores, and hyphens',
      },
      index: true,
    },
    wpm: {
      type: Number,
      required: [true, 'WPM is required'],
      min: [0, 'WPM cannot be negative'],
      max: [500, 'WPM seems unrealistic (max 500)'],
      validate: {
        validator: Number.isInteger,
        message: 'WPM must be an integer',
      },
      index: true,
    },
    accuracy: {
      type: Number,
      required: [true, 'Accuracy is required'],
      min: [0, 'Accuracy cannot be negative'],
      max: [100, 'Accuracy cannot exceed 100%'],
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 999,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 second'],
      max: [7200, 'Duration cannot exceed 2 hours'],
    },
    mistakes: {
      type: Number,
      default: 0,
      min: 0,
    },
    gameMode: {
      type: String,
      enum: {
        values: GAME_MODES,
        message: '{VALUE} is not a valid game mode',
      },
      required: true,
      default: 'MEDIUM',
      index: true,
    },
    gameType: {
      type: String,
      enum: {
        values: GAME_TYPES,
        message: '{VALUE} is not a valid game type',
      },
      required: true,
      default: 'TYPING',
      index: true,
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: String,
      index: true,
      sparse: true,
    },
    ipAddress: {
      type: String,
      index: true,
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
    country: {
      type: String,
      uppercase: true,
      minlength: 2,
      maxlength: 2,
      index: true,
    },
    city: {
      type: String,
      maxlength: 100,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    perfectRounds: {
      type: Number,
      default: 0,
      min: 0,
    },
    achievements: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: true,
      index: true,
    },
    verificationFlags: {
      type: [String],
      default: [],
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================================
// INDEXES - Optimized for leaderboard queries
// ============================================================================

/**
 * INDEX 1: Main leaderboard query
 * Use Case: "Show top TYPING scores in HARD mode"
 * Performance: O(log n) - instant leaderboard retrieval
 */
gameLeaderboardSchema.index({ gameType: 1, gameMode: 1, score: -1 });

/**
 * INDEX 2: Recent top scores
 * Use Case: "Today's top performers"
 * Performance: O(log n)
 */
gameLeaderboardSchema.index({ gameType: 1, score: -1, timestamp: -1 });

/**
 * INDEX 3: Player's personal records
 * Use Case: "All scores for user 'john_doe'"
 * Performance: O(log n)
 */
gameLeaderboardSchema.index({ username: 1, gameType: 1, score: -1 });

/**
 * INDEX 4: Speed leaderboard
 * Use Case: "Fastest typists worldwide"
 * Performance: O(1) for sorted retrieval
 */
gameLeaderboardSchema.index({ wpm: -1, accuracy: -1 });

/**
 * INDEX 5: Accuracy leaderboard
 * Use Case: "Most accurate players"
 * Performance: O(1) for sorted retrieval
 */
gameLeaderboardSchema.index({ accuracy: -1, wpm: -1 });

/**
 * INDEX 6: TTL index - auto-delete old records
 * Use Case: Keep only 2 years of data
 * Performance: Automatic cleanup
 */
gameLeaderboardSchema.index({ timestamp: -1 }, { expireAfterSeconds: 63072000 });

/**
 * INDEX 7: Rate limiting / spam prevention
 * Use Case: "Block multiple submissions from same IP"
 * Performance: O(log n)
 */
gameLeaderboardSchema.index({ ipAddress: 1, timestamp: -1 });

/**
 * INDEX 8: Verified leaderboard
 * Use Case: "Top verified scores only"
 * Performance: O(log n)
 */
gameLeaderboardSchema.index({ isVerified: 1, gameType: 1, score: -1 });

/**
 * INDEX 9: Regional leaderboards
 * Use Case: "Top players in USA"
 * Performance: O(log n)
 */
gameLeaderboardSchema.index({ country: 1, gameType: 1, score: -1 });

/**
 * INDEX 10: Streak leaderboard
 * Use Case: "Players with longest streaks"
 * Performance: O(log n)
 */
gameLeaderboardSchema.index({ streak: -1, score: -1 });

/**
 * INDEX 11: User history lookup
 * Use Case: "Get all games for a user"
 * Performance: O(log n)
 */
gameLeaderboardSchema.index({ userId: 1, timestamp: -1 });

// ============================================================================
// PRE-SAVE HOOKS
// ============================================================================

/**
 * Calculate score and detect cheating
 */
gameLeaderboardSchema.pre('save', function (next) {
  const verificationFlags: string[] = [];

  // Calculate score
  if (this.isNew || this.isModified('wpm') || this.isModified('accuracy')) {
    this.score = this.calculateScore();
  }

  // Cheat detection
  if (this.wpm > 250) {
    verificationFlags.push('EXTREMELY_HIGH_WPM');
    this.isVerified = false;
  }

  if (this.wpm > 150 && this.accuracy === 100 && this.mistakes === 0) {
    verificationFlags.push('PERFECT_HIGH_SPEED');
    this.isVerified = false;
  }

  if (this.accuracy === 100 && this.mistakes > 0) {
    verificationFlags.push('ACCURACY_MISTAKE_MISMATCH');
    this.isVerified = false;
  }

  // Check for unrealistic speed-accuracy combinations
  if (this.wpm > 200 && this.accuracy > 98) {
    verificationFlags.push('SUPERHUMAN_PERFORMANCE');
    this.isVerified = false;
  }

  // Duration check (too short for high scores)
  if (this.duration < 30 && this.score > 500) {
    verificationFlags.push('SUSPICIOUS_DURATION');
    this.isVerified = false;
  }

  // Perfect game achievement
  if (this.accuracy === 100 && this.mistakes === 0) {
    this.perfectRounds = (this.perfectRounds || 0) + 1;
    if (!this.achievements.includes('PERFECT_GAME')) {
      this.achievements.push('PERFECT_GAME');
    }
  }

  // Speed demon achievement (>100 WPM)
  if (this.wpm >= 100 && !this.achievements.includes('SPEED_DEMON')) {
    this.achievements.push('SPEED_DEMON');
  }

  // Expert achievement (S grade or better)
  const grade = this.getGrade();
  if ((grade === 'S+' || grade === 'S') && !this.achievements.includes('EXPERT_PLAYER')) {
    this.achievements.push('EXPERT_PLAYER');
  }

  this.verificationFlags = verificationFlags;

  if (verificationFlags.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(`⚠️ Suspicious score from ${this.username}: ${verificationFlags.join(', ')}`);
  }

  next();
});

// ============================================================================
// VIRTUALS
// ============================================================================

/**
 * Grade based on score and difficulty
 */
gameLeaderboardSchema.virtual('grade').get(function (): Grade {
  return this.getGrade();
});

/**
 * Performance rating description
 */
gameLeaderboardSchema.virtual('performanceRating').get(function (): string {
  const grade = this.getGrade();
  const ratings: Record<Grade, string> = {
    'S+': 'Legendary',
    S: 'Outstanding',
    A: 'Excellent',
    B: 'Good',
    C: 'Average',
    D: 'Below Average',
    F: 'Needs Practice',
  };
  return ratings[grade];
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Calculate score based on WPM, accuracy, and difficulty
 */
gameLeaderboardSchema.methods.calculateScore = function (): number {
  // Base score from WPM and accuracy
  let score = this.wpm * (this.accuracy / 100);

  // Apply difficulty multiplier
  const gameMode = this.gameMode as GameMode;
  score *= DIFFICULTY_MULTIPLIERS[gameMode];

  // Bonus for consistency (fewer mistakes)
  if (this.mistakes === 0) {
    score *= 1.5; // 50% bonus for perfect game
  } else if (this.mistakes <= 3) {
    score *= 1.2; // 20% bonus for < 3 mistakes
  } else if (this.mistakes <= 5) {
    score *= 1.1; // 10% bonus for < 5 mistakes
  }

  // Level bonus
  score += this.level * 10;

  // Streak bonus
  if (this.streak > 0) {
    score *= 1 + this.streak * 0.05; // 5% per streak level
  }

  return Math.round(score);
};

/**
 * Check if this is a top score (top 100)
 */
gameLeaderboardSchema.methods.checkIsTopScore = async function (): Promise<boolean> {
  const model = this.constructor as IGameLeaderboardModel;
  const rank = await model.getPlayerRank(this._id.toString());
  return rank !== null && rank <= 100;
};

/**
 * Get letter grade based on performance
 */
gameLeaderboardSchema.methods.getGrade = function (): Grade {
  const gameMode = this.gameMode as GameMode;
  const thresholds = GRADE_THRESHOLDS[gameMode];
  const grades: Grade[] = ['S+', 'S', 'A', 'B', 'C', 'D', 'F'];

  for (const grade of grades) {
    if (this.score >= thresholds[grade]) {
      return grade;
    }
  }

  return 'F';
};

/**
 * Get player's rank for this game type/mode
 */
gameLeaderboardSchema.methods.getRank = async function (): Promise<number> {
  const model = this.constructor as IGameLeaderboardModel;
  const rank = await model.getPlayerRank(this._id.toString());
  return rank || 0;
};

/**
 * Get percentile (e.g., "Top 5%")
 */
gameLeaderboardSchema.methods.getPercentile = async function (): Promise<number> {
  const model = this.constructor as any;

  const [totalCount, betterCount] = await Promise.all([
    model.countDocuments({ gameType: this.gameType, gameMode: this.gameMode, isVerified: true }),
    model.countDocuments({
      gameType: this.gameType,
      gameMode: this.gameMode,
      score: { $gt: this.score },
      isVerified: true,
    }),
  ]);

  if (totalCount === 0) return 100;
  return Math.round(((totalCount - betterCount) / totalCount) * 100);
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Get top scores for a game type and mode
 */
gameLeaderboardSchema.statics.getTopScores = function (
  gameType: GameType,
  gameMode: GameMode,
  limit = 100
): Promise<IGameLeaderboard[]> {
  return this.find({
    gameType,
    gameMode,
    isVerified: true,
  })
    .sort({ score: -1, timestamp: -1 })
    .limit(limit)
    .select('username wpm accuracy score level timestamp country streak achievements')
    .lean()
    .exec();
};

/**
 * Get player's personal best
 */
gameLeaderboardSchema.statics.getPersonalBest = function (
  username: string,
  gameType: GameType
): Promise<IGameLeaderboard | null> {
  return this.findOne({
    username: { $regex: new RegExp(`^${username}$`, 'i') },
    gameType,
    isVerified: true,
  })
    .sort({ score: -1 })
    .lean()
    .exec();
};

/**
 * Get today's top scores
 */
gameLeaderboardSchema.statics.getTodayTop = function (
  gameType: GameType,
  limit = 10
): Promise<IGameLeaderboard[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return this.find({
    gameType,
    timestamp: { $gte: today },
    isVerified: true,
  })
    .sort({ score: -1 })
    .limit(limit)
    .lean()
    .exec();
};

/**
 * Get player rank
 */
gameLeaderboardSchema.statics.getPlayerRank = async function (
  scoreId: string
): Promise<number | null> {
  const score = await this.findById(scoreId);
  if (!score) return null;

  const rank = await this.countDocuments({
    gameType: score.gameType,
    gameMode: score.gameMode,
    score: { $gt: score.score },
    isVerified: true,
  });

  return rank + 1;
};

/**
 * Check for duplicate submissions (spam prevention)
 */
gameLeaderboardSchema.statics.checkDuplicate = async function (
  ipAddress: string,
  username: string
): Promise<boolean> {
  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

  const count = await this.countDocuments({
    $or: [{ ipAddress }, { username: { $regex: new RegExp(`^${username}$`, 'i') } }],
    timestamp: { $gte: fiveMinutesAgo },
  });

  return count > 0;
};

/**
 * Get global statistics
 */
gameLeaderboardSchema.statics.getGlobalStats = async function (): Promise<GlobalStats> {
  const [stats] = await this.aggregate([
    { $match: { isVerified: true } },
    {
      $facet: {
        overall: [
          {
            $group: {
              _id: null,
              totalGames: { $sum: 1 },
              totalPlayers: { $addToSet: '$username' },
              avgWpm: { $avg: '$wpm' },
              avgAccuracy: { $avg: '$accuracy' },
              highestScore: { $max: '$score' },
            },
          },
        ],
        byGameType: [
          {
            $group: {
              _id: '$gameType',
              games: { $sum: 1 },
              avgScore: { $avg: '$score' },
            },
          },
        ],
        byGameMode: [
          {
            $group: {
              _id: '$gameMode',
              games: { $sum: 1 },
              avgScore: { $avg: '$score' },
            },
          },
        ],
      },
    },
  ]);

  const overall = stats.overall[0] || {};

  return {
    totalGames: overall.totalGames || 0,
    totalPlayers: overall.totalPlayers?.length || 0,
    averageWpm: Math.round(overall.avgWpm || 0),
    averageAccuracy: Math.round(overall.avgAccuracy || 0),
    highestScore: overall.highestScore || 0,
    byGameType: stats.byGameType.reduce((acc: any, item: any) => {
      acc[item._id] = { games: item.games, avgScore: Math.round(item.avgScore) };
      return acc;
    }, {}),
    byGameMode: stats.byGameMode.reduce((acc: any, item: any) => {
      acc[item._id] = { games: item.games, avgScore: Math.round(item.avgScore) };
      return acc;
    }, {}),
  };
};

/**
 * Get player statistics
 */
gameLeaderboardSchema.statics.getPlayerStats = async function (
  username: string
): Promise<PlayerStats | null> {
  const [stats] = await this.aggregate([
    { $match: { username: { $regex: new RegExp(`^${username}$`, 'i') }, isVerified: true } },
    {
      $facet: {
        overall: [
          {
            $group: {
              _id: null,
              totalGames: { $sum: 1 },
              avgWpm: { $avg: '$wpm' },
              avgAccuracy: { $avg: '$accuracy' },
              highestScore: { $max: '$score' },
              totalPlayTime: { $sum: '$duration' },
              achievements: { $addToSet: '$achievements' },
            },
          },
        ],
        byGameType: [
          { $group: { _id: '$gameType', count: { $sum: 1 }, maxScore: { $max: '$score' } } },
          { $sort: { count: -1 } },
        ],
        byGameMode: [
          { $group: { _id: '$gameMode', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
      },
    },
  ]);

  if (!stats.overall[0]) return null;

  const overall = stats.overall[0];
  const achievements = overall.achievements
    .flat()
    .filter((a: any, i: number, arr: any[]) => arr.indexOf(a) === i);

  return {
    username,
    totalGames: overall.totalGames,
    averageWpm: Math.round(overall.avgWpm),
    averageAccuracy: Math.round(overall.avgAccuracy),
    highestScore: overall.highestScore,
    favoriteGameType: stats.byGameType[0]?._id || 'TYPING',
    favoriteGameMode: stats.byGameMode[0]?._id || 'MEDIUM',
    bestGrade: 'S', // Would need additional calculation
    totalPlayTime: overall.totalPlayTime,
    achievements,
    rankByGameType: stats.byGameType.reduce((acc: any, item: any) => {
      acc[item._id] = 0; // Would need rank calculation per type
      return acc;
    }, {}),
  };
};

/**
 * Get leaderboard by country
 */
gameLeaderboardSchema.statics.getLeaderboardByCountry = function (
  country: string,
  gameType: GameType,
  limit = 50
): Promise<IGameLeaderboard[]> {
  return this.find({
    country: country.toUpperCase(),
    gameType,
    isVerified: true,
  })
    .sort({ score: -1 })
    .limit(limit)
    .lean()
    .exec();
};

/**
 * Get weekly champions (highest score per game type this week)
 */
gameLeaderboardSchema.statics.getWeeklyChampions = async function (
  gameType: GameType
): Promise<IGameLeaderboard[]> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return this.aggregate([
    {
      $match: {
        gameType,
        timestamp: { $gte: oneWeekAgo },
        isVerified: true,
      },
    },
    { $sort: { gameMode: 1, score: -1 } },
    {
      $group: {
        _id: '$gameMode',
        champion: { $first: '$$ROOT' },
      },
    },
    { $replaceRoot: { newRoot: '$champion' } },
  ]).exec();
};

/**
 * Get streak leaders
 */
gameLeaderboardSchema.statics.getStreakLeaders = function (
  limit = 10
): Promise<IGameLeaderboard[]> {
  return this.find({ isVerified: true, streak: { $gt: 0 } })
    .sort({ streak: -1, score: -1 })
    .limit(limit)
    .select('username streak score gameType gameMode timestamp')
    .lean()
    .exec();
};

// ============================================================================
// POST HOOKS
// ============================================================================

gameLeaderboardSchema.post('save', async function (doc) {
  if (process.env.NODE_ENV !== 'production' && doc.isVerified) {
    const isTop = await doc.checkIsTopScore();
    if (isTop) {
      console.log(
        `🏆 New top score! ${doc.username}: ${doc.score} points (${doc.wpm} WPM, ${doc.accuracy}% accuracy)`
      );
    }
  }
});

// ============================================================================
// MODEL EXPORT
// ============================================================================
export const GameLeaderboard = mongoose.model<IGameLeaderboard, IGameLeaderboardModel>(
  'GameLeaderboard',
  gameLeaderboardSchema
);
