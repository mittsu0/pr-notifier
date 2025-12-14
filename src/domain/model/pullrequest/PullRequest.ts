import { Repository } from './Repository.js';

/**
 * PullRequest Entity
 *
 * Represents a GitHub Pull Request with associated domain logic.
 */
export class PullRequest {
  constructor(
    readonly title: string,
    readonly url: string,
    readonly repository: Repository,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly isDraft: boolean
  ) {}

  /**
   * Checks if the PR is stale (not updated within the specified days)
   */
  isStale(days: number): boolean {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - days);
    return this.updatedAt < threshold;
  }
}
