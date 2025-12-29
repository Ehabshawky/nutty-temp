import { supabase } from './src/lib/supabase.js';
import fs from 'fs';
import path from 'path';

async function migrate() {
  console.log('Starting migration...');
  
  const dataPath = path.join(process.cwd(), 'data', 'site-content.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const data = JSON.parse(rawData);

  // 1. Migrate Services
  console.log('Migrating services...');
  if (data.services && Array.isArray(data.services)) {
    for (const svc of data.services) {
      const { error } = await supabase
        .from('services')
        .upsert({
          title_en: svc.title_en || svc.titleEn || '',
          title_ar: svc.title_ar || svc.titleAr || '',
          description_en: svc.description_en || svc.descriptionEn || '',
          description_ar: svc.description_ar || svc.descriptionAr || '',
          image: svc.image || '',
          created_at: new Date().toISOString()
        });
      if (error) console.error(`Error migrating service ${svc.title_en}:`, error.message);
    }
  }

  // 2. Migrate Site Configs (Hero, Footer, About, etc.)
  console.log('Migrating site configs...');
  const sections = ['hero', 'footer', 'about', 'sections'];
  for (const section of sections) {
    if (data[section]) {
      const { error } = await supabase
        .from('site_configs')
        .upsert({
          key: section,
          value: data[section],
          updated_at: new Date().toISOString()
        });
      if (error) console.error(`Error migrating section ${section}:`, error.message);
    }
  }

  console.log('Migration finished!');
}

migrate();
