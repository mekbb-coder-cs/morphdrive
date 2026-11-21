import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.routes.js";
import { vehicleRouter } from "./routes/vehicle.routes.js";
import { garageRouter } from "./routes/garage.routes.js";
import { leaderboardRouter } from "./routes/leaderboard.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Security & Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "morphdrive-api", timestamp: new Date().toISOString() });
});

// Mount API Routers
app.use("/api/auth", authRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/garage", garageRouter);
app.use("/api/leaderboard", leaderboardRouter);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🏎️ MorphDrive API server listening on http://localhost:${PORT}`);
  });
}

export default app;
