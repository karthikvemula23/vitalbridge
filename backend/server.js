import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import { swaggerUi, swaggerDocs } from "./openapi/index.js";

import authRoutes from "./routes/authRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import facilityRoutes from "./routes/facilityRoutes.js";
import bloodLabRoutes from "./routes/bloodLabRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// API Documentation
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/facility", facilityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blood-lab", bloodLabRoutes);
app.use("/api/hospital", hospitalRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});