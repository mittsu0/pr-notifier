import { graphql } from '@octokit/graphql';
import type { PullRequest } from '../../../domain/model/pullrequest/index.js';
import {
  PullRequestQuery,
  type PullRequestRepository,
} from '../../../domain/repository/pullrequest/index.js';
import type { GitHubPullRequestDto } from './dto/index.js';
import { toPullRequests } from './dto/index.js';

/**
 * GraphQL response type
 */
interface GitHubSearchResponse {
  search: {
    issueCount: number;
    nodes: GitHubPullRequestDto[];
  };
}

/**
 * GraphQL query for searching pull requests
 */
const SEARCH_PULL_REQUESTS_QUERY = `
  query SearchPullRequests($searchQuery: String!, $first: Int!) {
    search(query: $searchQuery, type: ISSUE, first: $first) {
      issueCount
      nodes {
        ... on PullRequest {
          title
          url
          createdAt
          updatedAt
          isDraft
          repository {
            name
            url
          }
        }
      }
    }
  }
`;

/**
 * GitHubClient
 *
 * Implementation of PullRequestRepository using GitHub GraphQL API.
 */
export class GitHubClient implements PullRequestRepository {
  private readonly client: typeof graphql;

  constructor(token: string) {
    if (!token || token.trim() === '') {
      throw new Error('GitHub token is required');
    }

    this.client = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });

    console.log('✅ GitHub client initialized');
  }

  /**
   * Builds the search query string for GitHub GraphQL API.
   * Translates domain query criteria to GitHub-specific query syntax.
   */
  private buildSearchQuery(query: PullRequestQuery): string {
    const parts: string[] = [`org:${query.owner}`, 'is:pr'];

    // Add state filter
    if (query.state !== 'all') {
      parts.push(`state:${query.state}`);
    }

    // Add review filter
    if (query.isReviewRequestedToMe()) {
      parts.push('review-requested:@me');
    }

    // Sort by updated date
    parts.push('sort:updated-desc');

    // Draft filter
    if (!query.includeDraft) {
      parts.push('-is:draft');
    }

    // Date filter
    const dateThreshold = query.getDateThreshold();
    if (dateThreshold) {
      const dateStr = dateThreshold.toISOString().split('T')[0];
      parts.push(`updated:>=${dateStr}`);
    }

    return parts.join(' ');
  }

  async search(query: PullRequestQuery): Promise<PullRequest[]> {
    const searchQuery = this.buildSearchQuery(query);

    console.log(`🔍 Searching PRs with query: "${searchQuery}"`);

    try {
      const response = await this.client<GitHubSearchResponse>(
        SEARCH_PULL_REQUESTS_QUERY,
        {
          searchQuery,
          first: query.count,
        }
      );

      const pullRequests = toPullRequests(response.search.nodes);

      console.log(
        `📋 Found ${response.search.issueCount} PRs, fetched ${pullRequests.length}`
      );

      return pullRequests;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`GitHub API error: ${error.message}`);
      }
      throw new Error('Unknown GitHub API error');
    }
  }
}
