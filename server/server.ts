import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import wishlistRoutes from "./routes/wishlist.js";
import tourRoutes from "./routes/tours.js";
import userRoutes from "./routes/users.js";
import contactRoutes from "./routes/contact.js";
import "./cron/bookingJobs.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/assets", express.static("assets"));

// The ! tells TS the variable is definitely there
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("🚀 MongoDB Connected!"))
  .catch((err) => console.log("❌ DB Error:", err));

app.use("/auth", authRoutes);
app.use("/bookings", bookingRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/tours", tourRoutes);
app.use("/users", userRoutes);
app.use("/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`📡 Server on port ${PORT}`));
