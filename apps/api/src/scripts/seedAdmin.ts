import mongoose from 'mongoose';
import { config } from '../config';
import { Admin } from '../models/Admin';
import { logger } from '../utils/logger';

/**
 * Seed Admin User Script
 *
 * Creates the initial admin user if one doesn't exist.
 * Uses environment variables for credentials or falls back to defaults.
 */

const DEFAULT_ADMIN = {
  email: config.admin.email || 'admin@portfolio.dev',
  password: config.admin.password || 'AdminPass123!',
  name: 'Portfolio Admin',
  role: 'super_admin' as const,
};

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: DEFAULT_ADMIN.email });

    if (existingAdmin) {
      logger.info('Admin user already exists', { email: DEFAULT_ADMIN.email });
      return;
    }

    // Create admin user
    const admin = new Admin({
      email: DEFAULT_ADMIN.email,
      password: DEFAULT_ADMIN.password,
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role,
      isActive: true,
    });

    await admin.save();

    logger.info('Admin user created successfully', {
      email: DEFAULT_ADMIN.email,
      name: DEFAULT_ADMIN.name,
      role: DEFAULT_ADMIN.role,
    });

    console.log('\n========================================');
    console.log('   ADMIN CREDENTIALS (SAVE THESE!)');
    console.log('========================================');
    console.log(`   Email:    ${DEFAULT_ADMIN.email}`);
    console.log(`   Password: ${DEFAULT_ADMIN.password}`);
    console.log('========================================\n');
    console.log('⚠️  Change these credentials immediately in production!\n');
  } catch (error) {
    logger.error('Failed to seed admin user', { error });
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
}

// Run the script
seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
