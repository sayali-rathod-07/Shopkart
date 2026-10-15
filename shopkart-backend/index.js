import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { MongoMemoryServer } from "mongodb-memory-server";
import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import Product from "./models/product.model.js";

dotenv.config();
const app = express();

// GLOBAL MIDDLEWARES
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"], credentials: true }));
app.use(express.json());
app.use(cookieParser()); 

// MOUNT ROUTES
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes); 

const PORT = process.env.PORT || 8007;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopkart";

const seedInitialProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: "Mechanical Keyboard", description: "RGB tactile mechanical keyboard with mechanical blue switches.", price: 2999, category: "Electronics", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80", stock: 12 },
      { name: "Noise Cancelling Headphones", description: "Wireless over-ear headphones with 40h battery and active cancellation.", price: 4999, category: "Electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", stock: 25 },
      { name: "Classic Denim Jacket", description: "Vintage washed authentic denim jacket with dual front pockets.", price: 2499, category: "Fashion", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80", stock: 8 },
      { name: "Clean Code by Robert C. Martin", description: "A handbook of agile software craftsmanship for modern developers.", price: 899, category: "Books", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80", stock: 30 },
      { name: "Minimalist Ceramic Coffee Mug", description: "Handcrafted matte finish stoneware mug, 350ml capacity.", price: 499, category: "Home", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80", stock: 18 },
    ]);
    console.log("Seeded initial product catalog into database");
  }
};

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log("Connected to MongoDB Atlas successfully");
    await seedInitialProducts();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.log("Atlas connection failed. Starting local in-memory DB fallback...");
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log("Connected to Local In-Memory MongoDB successfully");
      await seedInitialProducts();
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (fallbackError) {
      console.error("Failed to start database:", fallbackError.message);
    }
  }
}

connectDB();
