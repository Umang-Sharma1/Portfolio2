import { Project } from "../../models/Project";
import { Skill } from "../../models/Skill";
import { cacheGet, cacheSet } from "../../config/redis";
import { logger } from "../../utils/logger";

export const statsResolvers = {
  Query: {
    stats: async () => {
      try {
        const cacheKey = "stats:overview";
        const cachedData = await cacheGet(cacheKey);

        if (cachedData) {
          return JSON.parse(cachedData);
        }

        const [totalProjects, totalSkills] = await Promise.all([
          Project.countDocuments(),
          Skill.countDocuments(),
        ]);

        const stats = {
          totalProjects,
          totalSkills,
          yearsOfExperience: 3,
          leetcodeProblems: 400,
          leetcodeRating: 2265,
        };

        await cacheSet(cacheKey, JSON.stringify(stats), 7200);
        logger.info("Stats retrieved");

        return stats;
      } catch (error) {
        logger.error("Error fetching stats:", error);
        throw error;
      }
    },
  },
};
