import { supabaseAdmin } from "@/lib/supabase";
import nodemailer from 'nodemailer';

const TRANSPORTER_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

const EMAIL_STYLES = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #eaeaea;
`;

const HEADER_STYLE = `
  background: linear-gradient(90deg, #F97316 0%, #06b6d4 100%);
  color: white;
  padding: 20px;
  border-radius: 8px 8px 0 0;
  margin: -20px -20px 20px -20px;
  text-align: center;
`;

const BUTTON_STYLE = `
  display: inline-block;
  background-color: #06b6d4;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
  margin-top: 20px;
`;

export async function sendNotificationEmail({
  subject,
  html,
  type,
  attachments
}: {
  subject: string;
  html: string;
  type: 'contact' | 'review' | 'comment' | 'job';
  attachments?: any[];
}) {
  try {
    const { data: config } = await supabaseAdmin
      .from('site_configs')
      .select('value')
      .eq('key', 'settings')
      .single();

    const emails = config?.value?.notification_emails;
    
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      console.log('No notification emails configured.');
      return;
    }

    const transporter = nodemailer.createTransport(TRANSPORTER_CONFIG);

    const improvedHtml = `
      <div style="${EMAIL_STYLES}">
        <div style="${HEADER_STYLE}">
          <h2 style="margin:0;">New Website Activity</h2>
        </div>
        <div style="padding: 20px 0;">
          ${html}
        </div>
        <div style="text-align: center; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
          <a href="https://nuttyscientists.vercel.app/admin" style="${BUTTON_STYLE}">
            View Admin Dashboard
          </a>
          <p style="font-size: 12px; color: #888; margin-top: 15px;">
            Nutty Scientists Egypt Admin System
          </p>
        </div>
      </div>
    `;

    console.log(`[Email Notification] Sending to: ${emails.join(', ')}`);

    const info = await transporter.sendMail({
      from: '"Nutty Scientists Admin" <support@nuttyscientists.fun>',
      to: emails.join(', '),
      subject: `🔔 ${subject}`,
      html: improvedHtml,
      attachments: attachments
    });

    console.log("Notification Sent: %s", info.messageId);
    return { success: true, data: info };

  } catch (error) {
    console.error("Failed to send notification:", error);
    return { success: false, error };
  }
}

export async function sendApplicationConfirmationEmail({
  toEmail,
  userName,
  jobTitle
}: {
  toEmail: string;
  userName: string;
  jobTitle: string;
}) {
  try {
    const transporter = nodemailer.createTransport(TRANSPORTER_CONFIG);

    const confirmationHtml = `
      <div style="${EMAIL_STYLES}">
        <div style="${HEADER_STYLE}">
          <h2 style="margin:0;">Application Received!</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>Thank you for applying for the position of <strong>${jobTitle}</strong> at <strong>Nutty Scientists Egypt</strong>.</p>
          <p>We have successfully received your application and CV. Our recruitment team will review your profile and if there's a match, we will contact you for the next steps.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #555;">In the meantime, feel free to visit our <a href="https://nuttyscientists-egypt.com" style="color: #06b6d4;">website</a> to learn more about our mission.</p>
          </div>

          <p>Best Regards,<br/><strong>HR Team - Nutty Scientists Egypt</strong></p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 15px;">
          <p>&copy; ${new Date().getFullYear()} Nutty Scientists Egypt. All rights reserved.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Nutty Scientists Egypt" <support@nuttyscientists.fun>',
      to: toEmail,
      subject: `Application Received: ${jobTitle} - Nutty Scientists Egypt`,
      html: confirmationHtml
    });

    console.log("Application Confirmation Sent: %s", info.messageId);
    return { success: true, data: info };

  } catch (error) {
    console.error("Failed to send application confirmation email:", error);
    return { success: false, error };
  }
}

export async function sendConfirmationEmail({
  toEmail,
  userName,
}: {
  toEmail: string;
  userName: string;
}) {
  try {
    const transporter = nodemailer.createTransport(TRANSPORTER_CONFIG);

    const confirmationHtml = `
      <div style="${EMAIL_STYLES}">
        <div style="${HEADER_STYLE}">
          <h2 style="margin:0;">Message Received!</h2>
        </div>
        <div style="padding: 20px;">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>Thank you for contacting <strong>Nutty Scientists Egypt</strong>.</p>
          <p>We have successfully received your message and our team will review it shortly. We typically respond within 24-48 business hours.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #555;">In the meantime, feel free to explore our <a href="https://nuttyscientists-egypt.com/services" style="color: #06b6d4;">latest programs and workshops</a>.</p>
          </div>

          <p>Best Regards,<br/><strong>Nutty Scientists Egypt Team</strong></p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 15px;">
          <p>&copy; ${new Date().getFullYear()} Nutty Scientists Egypt. All rights reserved.</p>
          <p><a href="mailto:support@nuttyscientists.fun" style="color: #999;">support@nuttyscientists.fun</a></p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"Nutty Scientists Egypt" <support@nuttyscientists.fun>',
      to: toEmail,
      subject: "We received your message - Nutty Scientists Egypt",
      html: confirmationHtml
    });

    console.log("Confirmation Email Sent: %s", info.messageId);
    return { success: true, data: info };

  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return { success: false, error };
  }
}
