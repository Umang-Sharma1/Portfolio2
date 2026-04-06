import { gql } from '@apollo/client';

// ============================================================================
// FRAGMENTS
// ============================================================================

export const PROJECT_FRAGMENT = gql`
  fragment ProjectFields on Project {
    id
    title
    slug
    description
    category
    status
    featured
    technologies
    images {
      thumbnail
      screenshots
      banner
    }
    links {
      live
      github
      demo
      documentation
    }
    metrics {
      stars
      forks
      downloads
      contributors
    }
    timeline {
      startDate
      endDate
      duration
    }
    views
    clicks {
      github
      live
      demo
    }
    features
    durationFormatted
    isRecent
    createdAt
    updatedAt
  }
`;

export const PROJECT_DETAIL_FRAGMENT = gql`
  fragment ProjectDetailFields on Project {
    ...ProjectFields
    challenges
    learnings
    popularityScore
    architecture {
      nodes {
        id
        label
        type
        description
        technologies
        position {
          x
          y
        }
      }
      connections {
        from
        to
        label
        type
        animated
      }
    }
    relatedSkills {
      id
      name
      icon
      color
      proficiency
    }
  }
  ${PROJECT_FRAGMENT}
`;

export const SKILL_FRAGMENT = gql`
  fragment SkillFields on Skill {
    id
    name
    category
    proficiency
    yearsOfExperience
    projectCount
    status
    relatedSkills
    icon
    color
    description
    views
    lastUsedDate
    proficiencyLevel
    experienceLevel
    isActive
    createdAt
    updatedAt
  }
`;

export const LEADERBOARD_ENTRY_FRAGMENT = gql`
  fragment LeaderboardEntryFields on LeaderboardEntry {
    id
    username
    wpm
    accuracy
    score
    level
    duration
    mistakes
    gameMode
    gameType
    isAnonymous
    country
    isVerified
    grade
    rank
    timestamp
    createdAt
  }
`;

export const PAGE_INFO_FRAGMENT = gql`
  fragment PageInfoFields on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
    currentPage
    totalPages
  }
`;

// ============================================================================
// PROJECT QUERIES
// ============================================================================

export const GET_PROJECTS = gql`
  query GetProjects(
    $filter: ProjectFilterInput
    $sort: ProjectSortInput
    $pagination: PaginationInput
  ) {
    projects(filter: $filter, sort: $sort, pagination: $pagination) {
      edges {
        node {
          ...ProjectFields
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
    }
  }
  ${PROJECT_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export const GET_PROJECT_BY_SLUG = gql`
  query GetProjectBySlug($slug: String!) {
    project(slug: $slug) {
      ...ProjectDetailFields
    }
  }
  ${PROJECT_DETAIL_FRAGMENT}
`;

export const GET_PROJECT_BY_ID = gql`
  query GetProjectById($id: ID!) {
    projectById(id: $id) {
      ...ProjectDetailFields
    }
  }
  ${PROJECT_DETAIL_FRAGMENT}
`;

export const GET_FEATURED_PROJECTS = gql`
  query GetFeaturedProjects($limit: Int) {
    featuredProjects(limit: $limit) {
      id
      title
      slug
      description
      category
      status
      featured
      technologies
      images {
        thumbnail
        banner
      }
      links {
        live
        github
      }
      metrics {
        stars
      }
      views
      isRecent
      createdAt
    }
  }
`;

export const GET_TRENDING_PROJECTS = gql`
  query GetTrendingProjects($limit: Int) {
    trendingProjects(limit: $limit) {
      id
      title
      slug
      description
      category
      technologies
      images {
        thumbnail
      }
      views
      isRecent
    }
  }
`;

export const SEARCH_PROJECTS = gql`
  query SearchProjects($query: String!, $pagination: PaginationInput) {
    searchProjects(query: $query, pagination: $pagination) {
      edges {
        node {
          id
          title
          slug
          description
          category
          technologies
          images {
            thumbnail
          }
          views
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
    }
  }
  ${PAGE_INFO_FRAGMENT}
`;

export const GET_PROJECTS_BY_CATEGORY = gql`
  query GetProjectsByCategory($category: ProjectCategory!, $pagination: PaginationInput) {
    projectsByCategory(category: $category, pagination: $pagination) {
      edges {
        node {
          ...ProjectFields
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
    }
  }
  ${PROJECT_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

// ============================================================================
// SKILL QUERIES
// ============================================================================

export const GET_SKILLS = gql`
  query GetSkills($filter: SkillFilterInput, $sort: SkillSortInput, $pagination: PaginationInput) {
    skills(filter: $filter, sort: $sort, pagination: $pagination) {
      edges {
        node {
          ...SkillFields
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
    }
  }
  ${SKILL_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export const GET_SKILL_BY_ID = gql`
  query GetSkillById($id: ID!) {
    skill(id: $id) {
      ...SkillFields
      relatedProjects {
        id
        title
        slug
        category
        images {
          thumbnail
        }
      }
    }
  }
  ${SKILL_FRAGMENT}
`;

export const SEARCH_SKILLS = gql`
  query SearchSkills($query: String!, $pagination: PaginationInput) {
    searchSkills(query: $query, pagination: $pagination) {
      edges {
        node {
          id
          name
          category
          proficiency
          icon
          color
          proficiencyLevel
          isActive
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
    }
  }
  ${PAGE_INFO_FRAGMENT}
`;

export const GET_TOP_SKILLS_BY_CATEGORY = gql`
  query GetTopSkillsByCategory($category: SkillCategory!, $limit: Int) {
    topSkillsByCategory(category: $category, limit: $limit) {
      id
      name
      category
      proficiency
      yearsOfExperience
      projectCount
      icon
      color
      proficiencyLevel
      isActive
    }
  }
`;

export const GET_TRENDING_SKILLS = gql`
  query GetTrendingSkills($limit: Int) {
    trendingSkills(limit: $limit) {
      id
      name
      category
      proficiency
      icon
      color
      views
    }
  }
`;

export const GET_SKILL_CATEGORIES = gql`
  query GetSkillCategories {
    skillCategories
  }
`;

// ============================================================================
// LEADERBOARD QUERIES
// ============================================================================

export const GET_LEADERBOARD = gql`
  query GetLeaderboard(
    $filter: LeaderboardFilterInput
    $sort: LeaderboardSortInput
    $pagination: PaginationInput
  ) {
    leaderboard(filter: $filter, sort: $sort, pagination: $pagination) {
      edges {
        node {
          ...LeaderboardEntryFields
        }
        cursor
      }
      pageInfo {
        ...PageInfoFields
      }
      totalCount
    }
  }
  ${LEADERBOARD_ENTRY_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;

export const GET_TODAY_LEADERBOARD = gql`
  query GetTodayLeaderboard($gameType: GameType!, $limit: Int) {
    todayLeaderboard(gameType: $gameType, limit: $limit) {
      ...LeaderboardEntryFields
    }
  }
  ${LEADERBOARD_ENTRY_FRAGMENT}
`;

export const GET_PERSONAL_BEST = gql`
  query GetPersonalBest($username: String!, $gameType: GameType!) {
    personalBest(username: $username, gameType: $gameType) {
      ...LeaderboardEntryFields
    }
  }
  ${LEADERBOARD_ENTRY_FRAGMENT}
`;

export const GET_PLAYER_RANK = gql`
  query GetPlayerRank($id: ID!) {
    playerRank(id: $id)
  }
`;

// ============================================================================
// STATS QUERIES
// ============================================================================

export const GET_STATS = gql`
  query GetStats {
    stats {
      totalProjects
      totalSkills
      yearsOfExperience
      leetcodeProblems
      leetcodeRating
      totalViews
      totalClicks
      projectsByCategory {
        category
        count
      }
      skillsByCategory {
        category
        count
      }
      topTechnologies {
        technology
        count
      }
    }
  }
`;

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

export const GET_ANALYTICS = gql`
  query GetAnalytics($filter: AnalyticsFilterInput!) {
    analytics(filter: $filter) {
      id
      pageViews {
        home
        projects
        skills
        contact
        total
      }
      projectClicks {
        projectId
        title
        clicks {
          github
          live
          demo
        }
      }
      skillViews {
        skillId
        name
        views
      }
      uniqueVisitors
      returningVisitors
      averageSessionDuration
      bounceRate
      trafficSources {
        direct
        search
        social
        referral
      }
      devices {
        desktop
        mobile
        tablet
      }
      countries {
        country
        visits
      }
      mostViewedProject {
        projectId
        title
        clicks
      }
      mostViewedSkill {
        skillId
        name
        views
      }
      timestamp
      periodType
      createdAt
    }
  }
`;

export const GET_AGGREGATE_ANALYTICS = gql`
  query GetAggregateAnalytics($dateFrom: String!, $dateTo: String!) {
    aggregateAnalytics(dateFrom: $dateFrom, dateTo: $dateTo) {
      totalPageViews
      totalUniqueVisitors
      totalProjectClicks
      totalSkillViews
      averageBounceRate
      averageSessionDuration
      topProjects {
        projectId
        title
        clicks
      }
      topSkills {
        skillId
        name
        views
      }
    }
  }
`;

export const GET_RECENT_ANALYTICS = gql`
  query GetRecentAnalytics($days: Int) {
    recentAnalytics(days: $days) {
      id
      pageViews {
        home
        projects
        skills
        contact
        total
      }
      uniqueVisitors
      bounceRate
      timestamp
      periodType
      createdAt
    }
  }
`;

// ============================================================================
// CONTACT MESSAGE QUERIES (Admin)
// ============================================================================

export const GET_CONTACT_MESSAGES = gql`
  query GetContactMessages($status: MessageStatus, $pagination: PaginationInput) {
    contactMessages(status: $status, pagination: $pagination) {
      id
      name
      email
      subject
      message
      status
      isSpam
      spamScore
      ipAddress
      userAgent
      adminNotes
      repliedAt
      isRecent
      daysSinceCreation
      responseTime
      createdAt
      updatedAt
    }
  }
`;

export const GET_PENDING_MESSAGES = gql`
  query GetPendingMessages {
    pendingMessages {
      id
      name
      email
      subject
      message
      status
      isRecent
      daysSinceCreation
      createdAt
    }
  }
`;

export const GET_SPAM_STATS = gql`
  query GetSpamStats {
    spamStats {
      total
      spam
      spamRate
    }
  }
`;

// ============================================================================
// ADMIN DASHBOARD QUERIES
// ============================================================================

export const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    projects {
      id
      category
      views
      createdAt
    }
    skills {
      id
      category
    }
    contactMessages {
      id
      status
      createdAt
    }
  }
`;

export const GET_TOP_PROJECTS = gql`
  query GetTopProjects($limit: Int) {
    projects(limit: $limit, sortBy: "views", sortOrder: DESC) {
      id
      title
      slug
      category
      views
      status
      images {
        thumbnail
      }
      clicks {
        github
        live
      }
    }
  }
`;

export const GET_RECENT_MESSAGES = gql`
  query GetRecentMessages($limit: Int) {
    contactMessages(limit: $limit) {
      id
      name
      email
      subject
      status
      createdAt
    }
  }
`;
