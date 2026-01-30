'use client';

import { useQuery } from '@apollo/client';
import { GET_SKILLS } from '@/lib/graphql/queries';
import { Badge, Spinner, Button } from '@portfolio/ui';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';

// Mock data for when backend is not available
const mockSkillsByCategory = [
  {
    category: 'Frontend',
    skills: [
      {
        id: '1',
        name: 'React',
        proficiency: 95,
        yearsOfExperience: 4,
        icon: '⚛️',
        color: '#61DAFB',
      },
      {
        id: '2',
        name: 'Next.js',
        proficiency: 90,
        yearsOfExperience: 3,
        icon: '▲',
        color: '#000000',
      },
      {
        id: '3',
        name: 'TypeScript',
        proficiency: 92,
        yearsOfExperience: 4,
        icon: 'TS',
        color: '#3178C6',
      },
      {
        id: '4',
        name: 'Tailwind CSS',
        proficiency: 88,
        yearsOfExperience: 3,
        icon: '🎨',
        color: '#06B6D4',
      },
    ],
  },
  {
    category: 'Backend',
    skills: [
      {
        id: '5',
        name: 'Node.js',
        proficiency: 90,
        yearsOfExperience: 4,
        icon: '🟢',
        color: '#339933',
      },
      {
        id: '6',
        name: 'GraphQL',
        proficiency: 85,
        yearsOfExperience: 2,
        icon: '◆',
        color: '#E10098',
      },
      {
        id: '7',
        name: 'MongoDB',
        proficiency: 87,
        yearsOfExperience: 3,
        icon: '🍃',
        color: '#47A248',
      },
      {
        id: '8',
        name: 'PostgreSQL',
        proficiency: 80,
        yearsOfExperience: 3,
        icon: '🐘',
        color: '#4169E1',
      },
    ],
  },
  {
    category: 'Tools & DevOps',
    skills: [
      {
        id: '9',
        name: 'Docker',
        proficiency: 82,
        yearsOfExperience: 2,
        icon: '🐳',
        color: '#2496ED',
      },
      {
        id: '10',
        name: 'Git',
        proficiency: 93,
        yearsOfExperience: 5,
        icon: '📦',
        color: '#F05032',
      },
      {
        id: '11',
        name: 'AWS',
        proficiency: 75,
        yearsOfExperience: 2,
        icon: '☁️',
        color: '#FF9900',
      },
      {
        id: '12',
        name: 'CI/CD',
        proficiency: 80,
        yearsOfExperience: 2,
        icon: '🔄',
        color: '#6366F1',
      },
    ],
  },
];

export function SkillsSection() {
  const { data, loading, error } = useQuery(GET_SKILLS, {
    variables: { pagination: { page: 1, limit: 50 } },
    errorPolicy: 'all',
  });

  // Group skills by category
  const skillsByCategory = useMemo(() => {
    if (error || !data?.skills?.edges) return mockSkillsByCategory;

    const skills = data.skills.edges.map((edge: any) => edge.node);
    const grouped: Record<string, any[]> = {};

    skills.forEach((skill: any) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });

    return Object.entries(grouped).map(([category, skills]) => ({
      category,
      skills,
    }));
  }, [data, error]);

  if (loading) {
    return (
      <section className="container py-24 bg-muted/30">
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="container py-24 bg-muted/30">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-muted-foreground">Technologies I work with</p>
        </div>
        <Button variant="outline" asChild className="hidden md:flex">
          <Link href="/skills">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skillsByCategory.slice(0, 3).map((category: any) => (
          <div key={category.category} className="space-y-4">
            <h3 className="text-xl font-semibold">{category.category}</h3>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill: any) => (
                <Badge key={skill.id} variant="default">
                  {skill.icon && <span className="mr-1">{skill.icon}</span>}
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 md:hidden">
        <Button variant="outline" asChild>
          <Link href="/skills">
            View All Skills
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
