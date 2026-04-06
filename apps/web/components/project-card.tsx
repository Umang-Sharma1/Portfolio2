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
        {project.images?.thumbnail ? (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={project.images.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">
            <Link
              href={`/projects/${project.slug}`}
              className="hover:text-primary transition-colors line-clamp-1"
            >
              {project.title}
            </Link>
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>

          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 2).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Live
              </a>
            )}
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Github className="h-3 w-3" />
                Code
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
