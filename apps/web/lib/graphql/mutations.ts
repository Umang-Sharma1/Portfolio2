import { gql } from '@apollo/client';

import { LEADERBOARD_ENTRY_FRAGMENT } from './queries';

// ============================================================================
// PUBLIC MUTATIONS
// ============================================================================

/**
 * Send a contact message
 */
export const SEND_CONTACT_MESSAGE = gql`
  mutation SendContactMessage($input: ContactMessageInput!) {
    sendContactMessage(input: $input) {
      id
      name
      email
      subject
      message
      status
      isSpam
      spamScore
      isRecent
      daysSinceCreation
      createdAt
      updatedAt
    }
  }
`;

/**
 * Submit a game score to the leaderboard
 */
export const SUBMIT_SCORE = gql`
  mutation SubmitScore($input: SubmitScoreInput!) {
    submitScore(input: $input) {
      success
      message
      entry {
        ...LeaderboardEntryFields
      }
      rank
      isPersonalBest
    }
  }
  ${LEADERBOARD_ENTRY_FRAGMENT}
`;

/**
 * Track a page view
 */
export const TRACK_VIEW = gql`
  mutation TrackView($input: TrackViewInput!) {
    trackView(input: $input) {
      success
      message
    }
  }
`;

/**
 * Track a project click (github, live, demo)
 */
export const TRACK_CLICK = gql`
  mutation TrackClick($input: TrackClickInput!) {
    trackClick(input: $input) {
      success
      message
    }
  }
`;

// ============================================================================
// ADMIN MUTATIONS - Project
// ============================================================================

/**
 * Create a new project
 */
export const CREATE_PROJECT = gql`
  mutation CreateProject($input: UpdateProjectInput!) {
    createProject(input: $input) {
      id
      title
      slug
      description
      category
      status
      featured
      technologies
      createdAt
    }
  }
`;

/**
 * Update an existing project
 */
export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      title
      slug
      description
      category
      status
      featured
      technologies
      updatedAt
    }
  }
`;

/**
 * Delete a project
 */
export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      success
      message
    }
  }
`;

/**
 * Toggle project featured status
 */
export const TOGGLE_PROJECT_FEATURED = gql`
  mutation ToggleProjectFeatured($id: ID!, $featured: Boolean!) {
    updateProject(id: $id, input: { featured: $featured }) {
      id
      featured
    }
  }
`;

/**
 * Bulk delete projects
 */
export const BULK_DELETE_PROJECTS = gql`
  mutation BulkDeleteProjects($ids: [ID!]!) {
    bulkDeleteProjects(ids: $ids) {
      success
      message
      deletedCount
    }
  }
`;

/**
 * Update project order (for drag-to-reorder)
 */
export const UPDATE_PROJECT_ORDER = gql`
  mutation UpdateProjectOrder($id: ID!, $order: Int!) {
    updateProject(id: $id, input: { order: $order }) {
      id
      order
    }
  }
`;

/**
 * Duplicate a project
 */
export const DUPLICATE_PROJECT = gql`
  mutation DuplicateProject($id: ID!) {
    duplicateProject(id: $id) {
      id
      title
      slug
    }
  }
`;

/**
 * Check slug availability
 */
export const CHECK_SLUG_AVAILABILITY = gql`
  query CheckSlugAvailability($slug: String!, $excludeId: ID) {
    checkSlugAvailability(slug: $slug, excludeId: $excludeId) {
      available
      suggestion
    }
  }
`;

// ============================================================================
// ADMIN MUTATIONS - Skill
// ============================================================================

/**
 * Create a new skill
 */
export const CREATE_SKILL = gql`
  mutation CreateSkill($input: UpdateSkillInput!) {
    createSkill(input: $input) {
      id
      name
      category
      proficiency
      yearsOfExperience
      icon
      color
      createdAt
    }
  }
`;

/**
 * Update an existing skill
 */
export const UPDATE_SKILL = gql`
  mutation UpdateSkill($id: ID!, $input: UpdateSkillInput!) {
    updateSkill(id: $id, input: $input) {
      id
      name
      category
      proficiency
      yearsOfExperience
      icon
      color
      updatedAt
    }
  }
`;

/**
 * Delete a skill
 */
export const DELETE_SKILL = gql`
  mutation DeleteSkill($id: ID!) {
    deleteSkill(id: $id) {
      success
      message
    }
  }
`;

/**
 * Sync skill project counts
 */
export const SYNC_SKILL_PROJECT_COUNTS = gql`
  mutation SyncSkillProjectCounts {
    syncSkillProjectCounts {
      success
      message
    }
  }
`;

// ============================================================================
// ADMIN MUTATIONS - Contact Messages
// ============================================================================

/**
 * Update message status
 */
export const UPDATE_MESSAGE_STATUS = gql`
  mutation UpdateMessageStatus($id: ID!, $input: UpdateMessageStatusInput!) {
    updateMessageStatus(id: $id, input: $input) {
      id
      status
      adminNotes
      repliedAt
      updatedAt
    }
  }
`;

/**
 * Mark message as spam
 */
export const MARK_MESSAGE_AS_SPAM = gql`
  mutation MarkMessageAsSpam($id: ID!) {
    markMessageAsSpam(id: $id) {
      id
      status
      isSpam
      spamScore
    }
  }
`;

/**
 * Delete a message
 */
export const DELETE_MESSAGE = gql`
  mutation DeleteMessage($id: ID!) {
    deleteMessage(id: $id) {
      success
      message
    }
  }
`;

// ============================================================================
// ADMIN MUTATIONS - Leaderboard
// ============================================================================

/**
 * Verify a score
 */
export const VERIFY_SCORE = gql`
  mutation VerifyScore($id: ID!) {
    verifyScore(id: $id) {
      ...LeaderboardEntryFields
    }
  }
  ${LEADERBOARD_ENTRY_FRAGMENT}
`;

/**
 * Delete a score
 */
export const DELETE_SCORE = gql`
  mutation DeleteScore($id: ID!) {
    deleteScore(id: $id) {
      success
      message
    }
  }
`;

// ============================================================================
// ADMIN MUTATIONS - Analytics
// ============================================================================

/**
 * Generate analytics for a period
 */
export const GENERATE_ANALYTICS = gql`
  mutation GenerateAnalytics($periodType: PeriodType!) {
    generateAnalytics(periodType: $periodType) {
      id
      pageViews {
        home
        projects
        skills
        contact
        total
      }
      uniqueVisitors
      timestamp
      periodType
      createdAt
    }
  }
`;

// ============================================================================
// AUTHENTICATION MUTATIONS
// ============================================================================

/**
 * Admin login
 */
export const ADMIN_LOGIN = gql`
  mutation AdminLogin($input: LoginInput!) {
    adminLogin(input: $input) {
      success
      token
      user {
        id
        email
        name
        role
      }
      expiresIn
      message
    }
  }
`;

/**
 * Admin logout
 */
export const ADMIN_LOGOUT = gql`
  mutation AdminLogout {
    adminLogout
  }
`;

/**
 * Logout from all devices
 */
export const ADMIN_LOGOUT_ALL = gql`
  mutation AdminLogoutAll {
    adminLogoutAll
  }
`;

/**
 * Refresh access token
 */
export const REFRESH_TOKEN = gql`
  mutation RefreshToken {
    refreshToken {
      success
      token
      user {
        id
        email
        name
        role
      }
      expiresIn
      message
    }
  }
`;

/**
 * Get current user
 */
export const GET_ME = gql`
  mutation GetMe {
    me {
      id
      email
      name
      role
    }
  }
`;
