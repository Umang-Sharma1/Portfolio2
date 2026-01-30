'use client';

import Link from 'next/link';
import { Card, Badge } from '@portfolio/ui';
import { ExternalLink, Github, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    technologies: string[];
    images?: {
      thumbnail?: string;
    };
    links?: {
      live?: string;
      github?: string;
    };
    metrics?: {
      stars?: number;
      performance?: number;
    };
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        {project.images?.thumbnail && (
          <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {project.title}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            </div>
            {project.metrics?.stars && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                {project.metrics.stars}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                Live
              </a>
            )}
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                Code
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
