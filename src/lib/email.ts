import { supabase } from "@/lib/supabase";
import { Resend } from 'resend';

export async function sendNotificationEmail({
  subject,
  html,
  type
}: {
  subject: string;
  html: string;
  type: 'contact' | 'review' | 'comment';
}) {
  try {
    // 1. Fetch notification settings (emails)
    const { data: config } = await supabase
      .from('site_configs')
      .select('value')
      .eq('key', 'settings')
      .single();

    const emails = config?.value?.notification_emails;
    
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      console.log('No notification emails configured.');
      return;
    }

    const apiKey = process.env.RESEND_API_KEY;

    // Fallback if no API key
    if (!apiKey) {
      console.log('------------------------------------------------');
      console.log('⚠️ RESEND_API_KEY is missing in .env');
      console.log('To send real emails, add RESEND_API_KEY=re_... to your .env file.');
      console.log('------------------------------------------------');
      console.log(`[Email Notification] Would send to: ${emails.join(', ')}`);
      console.log(`[Subject]: ${subject}`);
      console.log(`[Content]: ${html}`);
      return { success: false, error: 'Missing API Key' };
    }

    const resend = new Resend(apiKey);
    
    // 2. Send Email
    // Note: On Resend's free tier, you can only send to the email address set up in your account
    // or you must verify a domain. 'onboarding@resend.dev' works for testing if sending to your own email.
    
    const { data, error } = await resend.emails.send({
      from: 'Nutty Scientists <onboarding@resend.dev>', 
      to: emails, 
      subject: subject,
      html: html
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };

  } catch (error) {
    console.error("Failed to send notification:", error);
    return { success: false, error };
  }
}
