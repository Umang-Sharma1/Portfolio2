'use client';

import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECT_BY_SLUG } from '@/lib/graphql/queries';
import { TRACK_VIEW, TRACK_CLICK } from '@/lib/graphql/mutations';
import { Spinner, Badge, Button } from '@portfolio/ui';
import { ExternalLink, Github, Calendar, Eye, Star } from 'lucide-react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const { data, loading, error } = useQuery(GET_PROJECT_BY_SLUG, {
    variables: { slug: params.slug },
  });

  const [trackView] = useMutation(TRACK_VIEW);
  const [trackClick] = useMutation(TRACK_CLICK);

  const project = data?.project;

  useEffect(() => {
    if (project?.id) {
      trackView({ variables: { input: { page: 'project', projectId: project.id } } });
    }
  }, [project?.id, trackView]);

  const handleLinkClick = (clickType: string) => {
    if (project?.id) {
      trackClick({ variables: { input: { projectId: project.id, clickType } } });
    }
  };

  if (loading) {
    return (
      <div className="container py-24">
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container py-24">
        <p className="text-center text-destructive">Project not found</p>
      </div>
    );
  }

  return (
    <div className="container py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{project.description}</p>

          <div className="flex flex-wrap gap-4 items-center">
            {project.links?.live && (
              <Button asChild onClick={() => handleLinkClick('live')}>
                <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.links?.github && (
              <Button variant="outline" asChild onClick={() => handleLinkClick('github')}>
                <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Hero Image */}
        {project.images?.hero && (
          <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 mb-8" />
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Eye className="h-4 w-4" />
              Views
            </div>
            <div className="text-2xl font-bold">{project.views || 0}</div>
          </div>
          {project.metrics?.stars && (
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Star className="h-4 w-4" />
                Stars
              </div>
              <div className="text-2xl font-bold">{project.metrics.stars}</div>
            </div>
          )}
          {project.timeline?.started && (
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Started
              </div>
              <div className="text-lg font-semibold">
                {new Date(project.timeline.started).getFullYear()}
              </div>
            </div>
          )}
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <Badge variant="success">{project.status}</Badge>
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech: string) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Long Description */}
        {project.longDescription && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Project</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground">{project.longDescription}</p>
            </div>
          </div>
        )}

        {/* Screenshots */}
        {project.images?.screenshots && project.images.screenshots.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.screenshots.map((screenshot: string, index: number) => (
                <div
                  key={index}
                  className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10"
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
