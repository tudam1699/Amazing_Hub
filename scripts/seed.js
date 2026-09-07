const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

async function seed() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI missing');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  
  const existingAdmin = await User.findOne({ username: 'admin' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hashedPassword });
    console.log('Admin user created successfully');
  } else {
    console.log('Admin already exists');
  }
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
