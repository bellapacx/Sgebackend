// scripts/migrate-empty-crates.ts
import mongoose from 'mongoose';
import Store from '../models/stores';

const MONGO_URI = 'mongodb://localhost:27017/your-database'; // Replace with your MongoDB URI

const migrateEmptyCrates = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log('Connected to MongoDB.');

    // Update all stores to add the empty_crates field with a default value of 0
    const result = await Store.updateMany(
      {},
      { $set: { 'inventory.$[].empty_crates': 0 } }
    );

    console.log(`Matched ${result.matchedCount} documents and modified ${result.modifiedCount} documents.`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error during migration:', error);
    await mongoose.disconnect();
  }
};

migrateEmptyCrates();
