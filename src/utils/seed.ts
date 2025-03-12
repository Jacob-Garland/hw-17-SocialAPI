import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import User from '../models/User';
import Thought from '../models/Thought';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialNetworkDB';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});

    console.log('Existing data deleted.');

    const users = [];
    const thoughts = [];

    // Create users
    for (let i = 0; i < 5; i++) {
      users.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
      });
    }

    const createdUsers = await User.insertMany(users);
    console.log('Users seeded:', createdUsers.length);

    // Create thoughts
    for (const user of createdUsers) {
      for (let i = 0; i < 2; i++) {
        const thought = await Thought.create({
          thoughtText: faker.hacker.phrase(),
          username: user.username,
        });

        user.thoughts.push(thought._id as mongoose.Types.ObjectId);
        thoughts.push(thought);
      }
      await user.save();
    }

    console.log('Thoughts seeded:', thoughts.length);

    console.log('Database seeding complete!');
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

// Run the seeding function
seedDatabase();