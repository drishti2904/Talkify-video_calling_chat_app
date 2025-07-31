import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL;

// ✅ For flexible public access (replace this in production if needed)
app.use(cors({
  origin: true,        // allows any origin
  credentials: true,   // allows cookies (important for auth)
}));

// ✅ Preflight CORS support
app.options("*", cors());

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Talkify API is running.");
});

// ✅ 404 Catch-all route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 API available at: http://localhost:${PORT} or Render URL`);
  });
});
