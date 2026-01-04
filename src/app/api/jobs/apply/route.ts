import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const jobId = formData.get('jobId') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const cvFile = formData.get('cv') as File;

    if (!name || !email || !jobId || !cvFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Server-side validation for security
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];
    const fileExtension = cvFile.name.split('.').pop()?.toLowerCase();

    if (cvFile.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size too large (Max 10MB)' }, { status: 400 });
    }

    if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and DOC are allowed.' }, { status: 400 });
    }

    // 1. Send Notification Email with CV Attachment
    try {
      const { sendNotificationEmail, sendApplicationConfirmationEmail } = await import('@/lib/email');

      // Convert file to Buffer for email attachment
      const buffer = Buffer.from(await cvFile.arrayBuffer());

      // Fetch career email from settings if available
      const { data: config } = await supabaseAdmin
        .from('site_configs')
        .select('value')
        .eq('key', 'settings')
        .single();
      
      const settings = config?.value || {};
      const targetEmail = settings.career_email || settings.contact_email;

      // Admin Notification with Attachment
      await sendNotificationEmail({
        subject: `New Job Application: ${jobTitle}`,
        html: `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #444; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Application Details</h3>
            <p><strong>Job Title:</strong> ${jobTitle}</p>
            <p><strong>Applicant Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          </div>
          <div style="margin-bottom: 20px;">
            <h3 style="color: #444; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Message / Cover Letter</h3>
            <p style="background: #f9fafb; padding: 15px; border-radius: 5px; font-style: italic;">"${message || 'No message provided'}"</p>
          </div>
          <div style="margin-bottom: 20px;">
            <h3 style="color: #444; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Resume / CV</h3>
            <p>The applicant's CV is attached to this email.</p>
            <p style="font-size: 12px; color: #cc0000; font-weight: bold;">Note: This application was NOT saved to the database to save storage space.</p>
          </div>
        `,
        type: 'job',
        attachments: [
          {
            filename: cvFile.name,
            content: buffer
          }
        ]
      });

      // Applicant Confirmation
      await sendApplicationConfirmationEmail({
        toEmail: email,
        userName: name,
        jobTitle: jobTitle
      });

    } catch (e) {
      console.error('Failed to send email operations:', e);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Application submission error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
