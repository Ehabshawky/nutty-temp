import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function GET() {
  const report: any = {
    checks: {},
    env: {},
    config: {},
    testResult: null
  };

  try {
    // 1. Check ENV
    const apiKey = process.env.RESEND_API_KEY;
    report.env.hasApiKey = !!apiKey;
    report.env.apiKeyPrefix = apiKey ? apiKey.substring(0, 5) + '...' : 'MISSING';

    // 2. Check Database Config
    const { data: config, error: dbError } = await supabase
      .from('site_configs')
      .select('value')
      .eq('key', 'settings')
      .single();
    
    if (dbError) {
      report.checks.database = 'FAILED';
      report.config.error = dbError.message;
    } else {
      report.checks.database = 'OK';
      report.config.found = true;
      report.config.emails = config?.value?.notification_emails || [];
    }

    // 3. Attempt Test Send (if config and key exist)
    if (apiKey && report.config.emails && report.config.emails.length > 0) {
      const resend = new Resend(apiKey);
      try {
        const { data, error } = await resend.emails.send({
          from: 'Nutty Scientists <onboarding@resend.dev>',
          to: report.config.emails,
          subject: 'Debug Test Email',
          html: '<p>If you see this, email sending is working!</p>'
        });
        
        if (error) {
           report.testResult = { status: 'FAILED', error };
        } else {
           report.testResult = { status: 'SUCCESS', data };
        }
      } catch (e: any) {
        report.testResult = { status: 'EXCEPTION', error: e.message };
      }
    } else {
       report.testResult = { status: 'SKIPPED', reason: 'Missing API Key or No Emails Configured' };
    }

    return NextResponse.json(report, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Unexpected Error', 
      details: error.message, 
      report 
    }, { status: 500 });
  }
}
