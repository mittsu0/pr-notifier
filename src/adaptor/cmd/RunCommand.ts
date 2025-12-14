import {
  NotifyPullRequestsUseCase,
  type NotifyPullRequestsInput,
} from '../../application/index.js';
import type { GitHubConfig, SlackConfig } from '../infra/config/index.js';
import { GitHubClient } from '../infra/github/index.js';
import { SlackClient } from '../infra/slack/index.js';

/**
 * RunCommand
 *
 * Entry point command that orchestrates the PR notification flow.
 * Responsible for wiring up dependencies and executing the use case.
 */
export class RunCommand {
  private readonly useCase: NotifyPullRequestsUseCase;
  private readonly input: NotifyPullRequestsInput;

  constructor(githubConfig: GitHubConfig, slackConfig: SlackConfig) {
    // Wire up dependencies
    const githubClient = new GitHubClient(githubConfig.token);
    const slackClient = new SlackClient(slackConfig.webhookUrl);

    this.useCase = new NotifyPullRequestsUseCase(githubClient, slackClient);

    this.input = {
      owner: githubConfig.owner,
      count: githubConfig.count,
      includeDraft: githubConfig.includeDraft,
      ignoreAfterDays: githubConfig.ignoreAfterDays,
      mention: slackConfig.mention,
    };
  }

  async execute(): Promise<void> {
    console.log('🚀 PR Notifier started');
    console.log(
      `📦 Target: owner=${this.input.owner}, count=${this.input.count}`
    );

    const result = await this.useCase.execute(this.input);

    if (result.notified) {
      console.log(`📨 Notified ${result.pullRequests.length} pull requests`);
    }

    console.log('✅ PR Notifier completed');
  }
}
