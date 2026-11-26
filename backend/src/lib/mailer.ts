import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';

class MailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (env.SMTP_HOST && env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT || 587,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS || '',
        },
      });
    }
  }

  async sendPasswordResetEmail(to: string, token: string, name?: string): Promise<void> {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    const subject = 'Pulse CRM - Password Reset Request';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
        <h2 style="color: #2563eb;">Pulse CRM Password Reset</h2>
        <p>Hello ${name || 'User'},</p>
        <p>You recently requested to reset your password. Click the button below to proceed:</p>
        <p style="margin: 25px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
            Reset My Password
          </a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #64748b; font-size: 14px; word-break: break-all;">${resetUrl}</p>
        <p>This link is valid for 1 hour. If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8;">Pulse CRM Security Team</p>
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: env.EMAIL_FROM,
          to,
          subject,
          html,
        });
        logger.info({ to }, 'Password reset email sent via SMTP');
      } catch (err) {
        logger.error({ err, to }, 'Failed to send reset email via SMTP, falling back to console log');
        logger.info(`[DEV EMAIL] Password reset token for ${to}: ${token} | URL: ${resetUrl}`);
      }
    } else {
      logger.info(`[DEV EMAIL] Password reset token for ${to}: ${token} | URL: ${resetUrl}`);
    }
  }
}

export const mailService = new MailService();
