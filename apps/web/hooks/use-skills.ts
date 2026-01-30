import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SKILLS } from '@/lib/graphql/queries';

interface UseSkillsOptions {
  limit?: number;
  page?: number;
  filter?: Record<string, any>;
  sort?: { field?: string; order?: string };
}

export const useSkills = (options: UseSkillsOptions = {}) => {
  const { limit = 10, page = 1, filter, sort = { field: 'PROFICIENCY', order: 'DESC' } } = options;

  const { data, loading, error } = useQuery(GET_SKILLS, {
    variables: {
      filter,
      sort,
      pagination: { page, limit },
    },
  });

  const skills = useMemo(() => {
    if (!data?.skills?.edges) return [];
    return data.skills.edges.map((edge: any) => edge.node);
  }, [data]);

  return {
    skills,
    loading,
    error,
    pageInfo: data?.skills?.pageInfo,
    totalCount: data?.skills?.totalCount ?? 0,
  };
};
