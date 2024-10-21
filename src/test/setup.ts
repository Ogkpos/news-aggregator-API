import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

jest.setTimeout(30000); // 30 seconds

let mongo: any;
beforeAll(async () => {
  process.env.JWT_SECRET = "Believe,everythingwillbeallright";
  process.env.JWT_EXPIRES_IN = "90d";
  mongo = await MongoMemoryServer.create();

  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
