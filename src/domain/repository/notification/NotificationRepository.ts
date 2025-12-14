import type { NotificationMessage } from '../../model/notification/index.js';

/**
 * NotificationRepository Interface
 *
 * Defines the contract for sending notifications.
 * Implementation is in the infrastructure layer.
 */
export interface NotificationRepository {
  /**
   * Sends a notification message
   * @param message - The message to send
   */
  send(message: NotificationMessage): Promise<void>;
}
