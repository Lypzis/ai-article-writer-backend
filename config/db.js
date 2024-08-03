import pkg from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const { connect, connection } = pkg;

// Get the database URI from environment variables
const dbURI = process.env.MONGO_URI;

// Function to connect to the database
export const connectDB = async () => {
  try {
    await connect(dbURI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

// Handle Mongoose connection events
connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

connection.on('error', err => {
  console.error('Mongoose connection error:', err.message);
});

connection.on('disconnected', () => {
  console.log('Mongoose disconnected from DB');
});

// Call connectDB function to establish connection
connectDB();
