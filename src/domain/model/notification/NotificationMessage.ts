/**
 * NotificationMessage Interface
 *
 * Abstract interface for notification messages.
 * Allows different notification implementations (Slack, Teams, Email, etc.)
 */
export interface NotificationMessage {
  /**
   * Checks if there is content to notify
   */
  hasContent(): boolean;

  /**
   * Converts the message to text format for notification
   */
  toMessageText(): string;
}
