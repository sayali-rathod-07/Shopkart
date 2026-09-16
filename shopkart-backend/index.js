import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { MongoMemoryServer } from "mongodb-memory-server";
import customerRoutes from "./routes/customer.routes.js";

dotenv.config();

const app = express();

// CORS configuration (enables frontend requests and cookie handling)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body and cookie parsing middlewares
app.use(express.json());
app.use(cookieParser());

// Mount customer routes
app.use("/customers", customerRoutes);

const PORT = process.env.PORT || 8007;
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  "mongodb://127.0.0.1:27017/shopkart";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log("Connected to MongoDB Atlas successfully");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.log("Atlas connection failed. Starting local in-memory DB fallback...");
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log("Connected to Local In-Memory MongoDB successfully");
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (fallbackError) {
      console.error("Failed to start database:", fallbackError.message);
    }
  }
}

connectDB();