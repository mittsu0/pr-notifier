import type { PullRequest } from '../pullrequest/index.js';
import type { NotificationMessage } from './NotificationMessage.js';
import type { SlackMention } from './SlackMention.js';

/**
 * SlackMessage
 *
 * Represents a Slack notification message.
 * Contains domain logic for building message content.
 * Implements NotificationMessage interface for abstraction.
 */
export class SlackMessage implements NotificationMessage {
  constructor(
    readonly pullRequests: PullRequest[],
    readonly mention: SlackMention | null
  ) {}

  /**
   * Builds the mention string for Slack
   */
  private buildMentionText(): string {
    if (!this.mention) {
      return '';
    }

    switch (this.mention.type) {
      case 'here':
        return '<!here> ';
      case 'channel':
        return '<!channel> ';
      case 'group':
        return `<!subteam^${this.mention.id}> `;
      case 'user':
        return `<@${this.mention.id}> `;
      default:
        return '';
    }
  }

  /**
   * Builds the message text for Slack webhook
   */
  toMessageText(): string {
    const mentionText = this.buildMentionText();
    const header = `${mentionText}🔔 レビュー待ちのPRがあります (${this.pullRequests.length}件)\n\n`;

    const prList = this.pullRequests
      .map((pr) => {
        return `• <${pr.url}|${pr.title}>\n  📁 <${pr.repository.url}|${pr.repository.name}>`;
      })
      .join('\n\n');

    return header + prList;
  }

  /**
   * Checks if there are any pull requests to notify
   */
  hasContent(): boolean {
    return this.pullRequests.length > 0;
  }
}
