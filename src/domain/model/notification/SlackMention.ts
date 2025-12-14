/**
 * SlackMention
 *
 * Mention configuration for Slack notifications.
 */
export interface SlackMention {
  readonly type: 'here' | 'channel' | 'group' | 'user';
  readonly id?: string;
}
