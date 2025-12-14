import type { SlackMention } from '../../../domain/model/notification/index.js';

/**
 * Slack Configuration
 */
export interface SlackConfig {
  readonly webhookUrl: string;
  readonly mention: SlackMention | null;
}

/**
 * Loads Slack configuration from environment variables
 */
export function loadSlackConfig(): SlackConfig {
  const webhookUrl = process.env['SLACK_WEBHOOK_URL'];
  if (!webhookUrl) {
    throw new Error('SLACK_WEBHOOK_URL environment variable is required');
  }

  const mentionType = process.env['SLACK_MENTION_TYPE']?.toLowerCase() as
    | SlackMention['type']
    | undefined;
  const mentionId = process.env['SLACK_MENTION_ID'];

  // Validate mention config
  if (mentionType === 'user' && !mentionId) {
    throw new Error(
      'SLACK_MENTION_ID is required when SLACK_MENTION_TYPE is "user"'
    );
  }
  if (mentionType === 'group' && !mentionId) {
    throw new Error(
      'SLACK_MENTION_ID is required when SLACK_MENTION_TYPE is "group"'
    );
  }

  // Build mention config
  const mention: SlackMention | null = mentionType
    ? { type: mentionType, id: mentionId }
    : null;

  return {
    webhookUrl,
    mention,
  };
}
