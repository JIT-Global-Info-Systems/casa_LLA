import mongoose from "mongoose";

const connectDB = async () => {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
     console.log("EXIT CONNECTION...");
    console.error(error);
    process.exit(1);
    
  }
};

export default connectDB;
