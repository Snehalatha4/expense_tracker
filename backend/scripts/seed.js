require('dotenv').config({ path: __dirname + '/../.env' });
const { connectDB, disconnectDB } = require('../config/db');
const { seedData } = require('./seedHelper');

const runSeed = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await connectDB();

    console.log('Clearing and seeding demonstration transactions...');
    const result = await seedData(true);
    console.log(`🌸 Successfully seeded ${result.count} sample transactions!`);
    console.log('🌸 Seeded monthly budget of ₹20,000 for 2026-10.');
    console.log('Database seeding complete. All records persisted in MongoDB.');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  }
};

runSeed();
