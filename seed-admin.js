const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Nutty2025';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('--- ADMIN SEED DATA ---');
  console.log('Username: admin');
  console.log('Password (Original):', password);
  console.log('Password (Hashed):', hash);
  console.log('-----------------------');
  console.log('\nRun this SQL in Supabase to create the admin:');
  console.log(`INSERT INTO admins (username, password) VALUES ('admin', '${hash}');`);
}

generateHash();
