import mongoose from "mongoose";
import { config } from "./index";
import { logger } from "../utils/logger";

export async function connectDatabase(): Promise<void> {
  try {
    const startTime = Date.now();

    // ================================================================
    // CONNECTION OPTIONS — Optimized for performance
    // ================================================================
    await mongoose.connect(config.mongoUri, {
      // Connection pool: keep warm connections ready
      maxPoolSize: 10,           // Max connections in pool (default: 5)
      minPoolSize: 2,            // Keep 2 connections warm at all times
      maxIdleTimeMS: 30000,      // Close idle connections after 30s

      // Timeouts: fail fast instead of hanging
      connectTimeoutMS: 10000,   // 10s to establish connection
      socketTimeoutMS: 45000,    // 45s for socket operations
      serverSelectionTimeoutMS: 5000, // 5s to select a server

      // Performance flags
      autoIndex: !config.isProduction, // Build indexes in dev, not prod
      autoCreate: !config.isProduction,

      // Buffering: reject operations when disconnected
      bufferCommands: true,

      // Heartbeat: detect dead connections faster
      heartbeatFrequencyMS: 10000,
    });

    const duration = Date.now() - startTime;
    logger.info(`✅ MongoDB connected successfully in ${duration}ms`);

    // Log connection pool info
    const { host, port, name } = mongoose.connection;
    logger.info(`📊 MongoDB: ${host}:${port}/${name} (pool: 2-10)`);

    mongoose.connection.on("error", (error) => {
      logger.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed through app termination");
      process.exit(0);
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
