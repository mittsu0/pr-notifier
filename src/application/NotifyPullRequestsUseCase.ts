import {
  SlackMessage,
  type SlackMention,
} from '../domain/model/notification/index.js';
import type { PullRequest } from '../domain/model/pullrequest/index.js';
import type { NotificationRepository } from '../domain/repository/notification/index.js';
import {
  PullRequestQuery,
  type PullRequestRepository,
} from '../domain/repository/pullrequest/index.js';

/**
 * Input for NotifyPullRequestsUseCase
 */
export interface NotifyPullRequestsInput {
  readonly owner: string;
  readonly count: number;
  readonly includeDraft: boolean;
  readonly ignoreAfterDays?: number;
  readonly mention: SlackMention | null;
}

/**
 * Output for NotifyPullRequestsUseCase
 */
export interface NotifyPullRequestsOutput {
  readonly pullRequests: PullRequest[];
  readonly notified: boolean;
}

/**
 * NotifyPullRequestsUseCase
 *
 * Fetches pull requests and sends notifications.
 * This is the main application use case.
 */
export class NotifyPullRequestsUseCase {
  constructor(
    private readonly pullRequestRepository: PullRequestRepository,
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    input: NotifyPullRequestsInput
  ): Promise<NotifyPullRequestsOutput> {
    // Build domain query for review-requested PRs
    const query = PullRequestQuery.reviewRequestedToMe({
      owner: input.owner,
      count: input.count,
      includeDraft: input.includeDraft,
      ignoreAfterDays: input.ignoreAfterDays,
    });

    // Fetch pull requests
    const pullRequests = await this.pullRequestRepository.search(query);

    console.log(`📋 Found ${pullRequests.length} pull requests`);

    if (pullRequests.length === 0) {
      console.log('📭 No pull requests to notify');
      return { pullRequests, notified: false };
    }

    // Build and send notification
    const message = new SlackMessage(pullRequests, input.mention);
    await this.notificationRepository.send(message);

    return { pullRequests, notified: true };
  }
}
