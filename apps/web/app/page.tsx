'use client';

import React from 'react';
import { Hero } from '../components/home/Hero';
import { SkillsOverview } from '../components/home/SkillsOverview';
import { ProjectsSection } from '../components/home/projects-section';
import { ContactForm } from '../components/home/ContactForm';
import { Card } from '@portfolio/ui';
import { Cpu, Globe, Zap, ChevronRight } from 'lucide-react';

export default function Page() {
  return (
    <main className="relative">
      <Hero />

      {/* Skills Overview Section */}
      <SkillsOverview />

      {/* Featured Projects Section */}
      <ProjectsSection />

      {/* Contact Form Section */}
      <ContactForm />
    </main>
  );
}
