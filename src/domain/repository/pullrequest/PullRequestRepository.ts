import type { PullRequest } from '../../model/pullrequest/index.js';
import type { PullRequestQuery } from './PullRequestQuery.js';

/**
 * PullRequestRepository Interface
 *
 * Defines the contract for fetching pull requests.
 * Implementation is in the infrastructure layer.
 */
export interface PullRequestRepository {
  /**
   * Search for pull requests matching the query criteria
   * @param query - Search parameters
   * @returns Promise resolving to an array of PullRequest entities
   */
  search(query: PullRequestQuery): Promise<PullRequest[]>;
}
