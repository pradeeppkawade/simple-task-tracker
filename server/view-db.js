// Utility script to inspect MongoDB collections directly from terminal
// College viva helper: proves that registered users and tasks are persisted in MongoDB!

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Task = require('./models/Task');

async function inspectDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-tracker');
    console.log('Connected to MongoDB successfully!\n');

    console.log('====================================================');
    console.log('1. REGISTERED USERS IN MONGODB ("users" collection)');
    console.log('====================================================');
    const users = await User.find({}).lean();
    console.log(`Total Users Found: ${users.length}\n`);

    if (users.length === 0) {
      console.log('No users registered in database yet.');
    } else {
      users.forEach((u, index) => {
        console.log(`User #${index + 1}:`);
        console.log(`  - Database _id    : ${u._id}`);
        console.log(`  - Full Name       : ${u.name}`);
        console.log(`  - Email           : ${u.email}`);
        console.log(`  - Hashed Password : ${u.password} (bcrypt encrypted)`);
        console.log(`  - Registered At   : ${u.createdAt}`);
        console.log('----------------------------------------------------');
      });
    }

    console.log('\n====================================================');
    console.log('2. STORED TASKS IN MONGODB ("tasks" collection)');
    console.log('====================================================');
    const tasks = await Task.find({}).lean();
    console.log(`Total Tasks Found: ${tasks.length}\n`);

    if (tasks.length === 0) {
      console.log('No tasks stored in database yet.');
    } else {
      tasks.forEach((t, index) => {
        console.log(`Task #${index + 1}:`);
        console.log(`  - Database _id : ${t._id}`);
        console.log(`  - Title        : ${t.title}`);
        console.log(`  - Priority     : ${t.priority}`);
        console.log(`  - Category     : ${t.category}`);
        console.log(`  - Completed    : ${t.completed ? 'YES (Done)' : 'NO (Pending)'}`);
        console.log(`  - Due Date     : ${t.dueDate || 'None'}`);
        console.log(`  - Owner User ID: ${t.user}`);
        console.log('----------------------------------------------------');
      });
    }

    console.log('\nInspection finished.');
    process.exit(0);
  } catch (error) {
    console.error('Database Inspection Error:', error.message);
    process.exit(1);
  }
}

inspectDatabase();
