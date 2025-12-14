/**
 * Pull request state filter
 */
export type PullRequestState = 'open' | 'closed' | 'all';

/**
 * Review filter options
 */
export type ReviewFilter = 'requested-to-me' | 'none';

/**
 * PullRequestQuery Value Object
 *
 * Represents the criteria for searching pull requests.
 * Encapsulates business rules for PR search queries.
 */
export class PullRequestQuery {
  private constructor(
    readonly owner: string,
    readonly count: number,
    readonly state: PullRequestState,
    readonly reviewFilter: ReviewFilter,
    readonly includeDraft: boolean,
    readonly ignoreAfterDays?: number
  ) {}

  /**
   * Creates a query for pull requests that are requested to review by the current user.
   * This is the primary business use case for this application.
   */
  static reviewRequestedToMe(params: {
    owner: string;
    count: number;
    includeDraft: boolean;
    ignoreAfterDays?: number;
  }): PullRequestQuery {
    const validatedCount = Math.min(Math.max(params.count, 1), 100);

    return new PullRequestQuery(
      params.owner,
      validatedCount,
      'open',
      'requested-to-me',
      params.includeDraft,
      params.ignoreAfterDays
    );
  }

  /**
   * Checks if the query filters by review requests to the current user
   */
  isReviewRequestedToMe(): boolean {
    return this.reviewFilter === 'requested-to-me';
  }

  /**
   * Checks if the query has a date filter
   */
  hasDateFilter(): boolean {
    return this.ignoreAfterDays !== undefined && this.ignoreAfterDays > 0;
  }

  /**
   * Gets the threshold date for filtering (if applicable)
   */
  getDateThreshold(): Date | null {
    if (!this.hasDateFilter()) {
      return null;
    }

    const threshold = new Date();
    threshold.setDate(threshold.getDate() - this.ignoreAfterDays!);
    return threshold;
  }
}
