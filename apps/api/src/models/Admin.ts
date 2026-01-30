import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// ============================================================================
// TYPES
// ============================================================================

export interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor';
  isActive: boolean;
  lastLogin: Date | null;
  loginAttempts: number;
  lockUntil: Date | null;
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

export interface IAdminModel extends Model<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes
const BCRYPT_ROUNDS = 10;

// ============================================================================
// SCHEMA
// ============================================================================

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password by default in queries
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'editor'],
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    refreshTokens: {
      type: [String],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        ret.password = undefined;
        ret.refreshTokens = undefined;
        ret.__v = undefined;
        ret.id = ret._id?.toString();
        ret._id = undefined;
        return ret;
      },
    },
  }
);

// ============================================================================
// INDEXES
// ============================================================================

AdminSchema.index({ email: 1 }, { unique: true });
AdminSchema.index({ role: 1 });
AdminSchema.index({ isActive: 1 });

// ============================================================================
// PRE-SAVE MIDDLEWARE
// ============================================================================

AdminSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

/**
 * Compare provided password with hashed password
 */
AdminSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch {
    return false;
  }
};

/**
 * Check if account is currently locked
 */
AdminSchema.methods.isLocked = function (): boolean {
  // Check if lock has expired
  if (this.lockUntil && this.lockUntil > new Date()) {
    return true;
  }
  return false;
};

/**
 * Increment login attempts and lock account if needed
 */
AdminSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  // If previous lock has expired, reset attempts
  if (this.lockUntil && this.lockUntil < new Date()) {
    await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
    return;
  }

  // Increment attempts
  const updates: Record<string, unknown> = { $inc: { loginAttempts: 1 } };

  // Lock account if max attempts reached
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) };
  }

  await this.updateOne(updates);
};

/**
 * Reset login attempts after successful login
 */
AdminSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  await this.updateOne({
    $set: { loginAttempts: 0, lastLogin: new Date() },
    $unset: { lockUntil: 1 },
  });
};

// ============================================================================
// STATIC METHODS
// ============================================================================

/**
 * Find admin by email (includes password for authentication)
 */
AdminSchema.statics.findByEmail = async function (email: string): Promise<IAdmin | null> {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

// ============================================================================
// EXPORT MODEL
// ============================================================================

export const Admin = mongoose.model<IAdmin, IAdminModel>('Admin', AdminSchema);

export default Admin;
