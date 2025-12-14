import type { NotificationMessage } from '../../../domain/model/notification/index.js';
import type { NotificationRepository } from '../../../domain/repository/notification/index.js';

/**
 * SlackClient
 *
 * Implementation of NotificationRepository using Slack Incoming Webhook.
 */
export class SlackClient implements NotificationRepository {
  constructor(private readonly webhookUrl: string) {
    if (!webhookUrl || webhookUrl.trim() === '') {
      throw new Error('Slack webhook URL is required');
    }

    console.log('✅ Slack client initialized');
  }

  async send(message: NotificationMessage): Promise<void> {
    if (!message.hasContent()) {
      console.log('📭 No content to send');
      return;
    }

    const payload = {
      text: message.toMessageText(),
    };

    console.log('📤 Sending notification to Slack...');

    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Slack API error: ${response.status} - ${errorText}`);
    }

    console.log('✅ Notification sent successfully');
  }
}
