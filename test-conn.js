const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function test() {
  try {
    const content = fs.readFileSync('.env.local', 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        env[key] = value;
      }
    });

    const url = env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    console.log('Testing with URL:', url);
    if (!url || !key) {
      console.log('Error: Missing URL or Key in .env.local');
      console.log('Available keys:', Object.keys(env));
      return;
    }

    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('services').select('*').limit(1);

    if (error) {
      console.log('Connection failed:', error.message);
    } else {
      console.log('Connection successful! Found services:', data.length);
    }
  } catch (err) {
    console.log('Error during test:', err.message);
  }
}

test();
