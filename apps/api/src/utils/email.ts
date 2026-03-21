import { config } from '../config';
import { logger } from './logger';

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

/**
 * Check if email notifications are enabled
 */
export const isEmailEnabled = (): boolean => {
  return !!config.email.web3formsAccessKey;
};

if (isEmailEnabled()) {
  logger.info('📧 Web3Forms email service enabled');
} else {
  logger.warn('⚠️  WEB3FORMS_ACCESS_KEY not set — email notifications disabled');
}

/**
 * Send email notification when a new contact message is received
 * Uses Web3Forms API (free, no sender verification needed)
 */
export const sendContactNotification = async (message: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  priority: string;
}): Promise<boolean> => {
  if (!isEmailEnabled()) {
    logger.debug('Email notifications disabled — skipping contact notification');
    return false;
  }

  const priorityBadge =
    message.priority === 'HIGH'
      ? '🔴 HIGH PRIORITY'
      : message.priority === 'LOW'
        ? '🟡 LOW'
        : '🟢 NORMAL';

  const subject = message.subject
    ? `[Portfolio Contact] ${message.subject}`
    : `[Portfolio Contact] New message from ${message.name}`;

  try {
    const response = await fetch(WEB3FORMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: config.email.web3formsAccessKey,
        subject,
        from_name: 'Voyager.OS Portfolio',
        name: message.name,
        email: message.email,
        message: `${priorityBadge}\n\nFrom: ${message.name}\nEmail: ${message.email}${message.subject ? `\nSubject: ${message.subject}` : ''}\n\n--- Message ---\n${message.message}`,
      }),
    });

    const data = (await response.json()) as { success: boolean; message?: string };

    if (data.success) {
      logger.info('📧 Contact notification sent via Web3Forms');
      return true;
    } else {
      logger.error('Web3Forms error:', { message: data.message, status: response.status, data });
      return false;
    }
  } catch (error: any) {
    logger.error('Failed to send contact notification:', {
      error: error.message,
      stack: error.stack,
    });
    // Don't throw — email failure shouldn't break the contact form
    return false;
  }
};
