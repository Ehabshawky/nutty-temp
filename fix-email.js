import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixEmails() {
  console.log('Fixing notification emails...');
  
  // Fetch current settings first
  const { data: current, error: fetchError } = await supabase
    .from('site_configs')
    .select('value')
    .eq('key', 'settings')
    .single();
    
  if (fetchError) {
    console.error('Error fetching settings:', fetchError);
    return;
  }
  
  const currentSettings = current.value || {};
  
  // Overwrite notification_emails with the correct one
  const newSettings = {
    ...currentSettings,
    notification_emails: ['ehab.shawky38@gmail.com']
  };
  
  const { error: updateError } = await supabase
    .from('site_configs')
    .update({ value: newSettings })
    .eq('key', 'settings');
    
  if (updateError) {
    console.error('Error updating settings:', updateError);
  } else {
    console.log('SUCCESS: Notification emails updated to ["ehab.shawky38@gmail.com"]');
  }
}

fixEmails();
