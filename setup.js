const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Lost & Found Portal...\n');

// Create uploads directory
const uploadsDir = path.join(__dirname, 'server', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Create environment file if it doesn't exist
const envFile = path.join(__dirname, 'server', 'config.env');
if (!fs.existsSync(envFile)) {
  const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/lost-found-portal
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-${Date.now()}
NODE_ENV=development`;
  
  fs.writeFileSync(envFile, envContent);
  console.log('✅ Created environment configuration file');
}

// Create a sample teacher account
const createSampleTeacher = async () => {
  try {
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/lost-found-portal');
    
    const User = require('./server/models/User');
    
    // Check if teacher1 already exists
    const existingTeacher = await User.findOne({ username: 'teacher1' });
    if (!existingTeacher) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const teacher = new User({
        username: 'teacher1',
        password: hashedPassword,
        role: 'teacher'
      });
      
      await teacher.save();
      console.log('✅ Created sample teacher account (teacher1/password123)');
    } else {
      console.log('ℹ️  Sample teacher account already exists');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.log('⚠️  Could not create sample teacher account:', error.message);
    console.log('   You can create one manually through the registration form');
  }
};

console.log('\n📋 Setup Summary:');
console.log('1. Install dependencies: npm run install-all');
console.log('2. Start MongoDB service');
console.log('3. Run the application: npm run dev');
console.log('4. Access at http://localhost:5173');
console.log('\n🔑 Demo Credentials:');
console.log('Username: teacher1');
console.log('Password: password123');

// Try to create sample teacher
createSampleTeacher().then(() => {
  console.log('\n✨ Setup complete! Happy coding!');
}).catch(() => {
  console.log('\n✨ Setup complete! Happy coding!');
});








