import 'dotenv/config';
import { dbConnect, User } from '../lib/models';
import { hashPassword } from '../lib/auth';

async function createAdmin() {
  try {
    // Connect to database
    await dbConnect();
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'muzlikgamer@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword('uNiAdmin#13');

    // Create the admin user
    const adminUser = new User({
      email: 'muzlikgamer@gmail.com',
      password: hashedPassword,
      firstName: 'Muzlik',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'publish', 'manage_users'],
      isActive: true,
    });

    await adminUser.save();
    console.log('Admin user created successfully');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();