import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import charityRoutes from "./routes/charityRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import drawRoutes from "./routes/drawRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Stripe Webhook needs the raw body to verify signature
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

// Middleware for other routes
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/charity", charityRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/draws", drawRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});