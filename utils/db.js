import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const MONGO_URI = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to db', error.message);
  }
};

export default connectDb;
