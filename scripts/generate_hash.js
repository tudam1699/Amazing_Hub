const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('Usage: node scripts/generate_hash.js <password>');
  process.exit(1);
}

const saltRounds = 12;
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('\n--- YOUR ADMIN HASH ---');
  console.log(hash);
  console.log('-----------------------\n');
});

