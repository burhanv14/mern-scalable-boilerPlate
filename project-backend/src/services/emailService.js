const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(options) {
    const message = {
      from: `${process.env.FROM_NAME || 'MERN App'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    try {
      const info = await this.transporter.sendMail(message);
      console.log('Email sent: ' + info.response);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email could not be sent');
    }
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested a password reset. Please click the link below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in ${process.env.RESET_TOKEN_EXPIRE || 10} minutes.
        </p>
        <p style="color: #666; font-size: 14px;">
          If you did not request this password reset, please ignore this email.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated message, please do not reply.
        </p>
      </div>
    `;

    await this.sendEmail({
      email,
      subject: 'Password Reset Request',
      html
    });
  }

  async sendWelcomeEmail(email, name) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to MERN App!</h2>
        <p>Hi ${name},</p>
        <p>Welcome to our platform! Your account has been successfully created.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}" 
             style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Get Started
          </a>
        </div>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated message, please do not reply.
        </p>
      </div>
    `;

    await this.sendEmail({
      email,
      subject: 'Welcome to MERN App!',
      html
    });
  }
}

module.exports = new EmailService();
