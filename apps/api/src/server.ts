import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { authRouter } from "./routes/auth.routes.js";
import { machineRouter } from "./routes/machine.routes.js";
import { partRouter } from "./routes/part.routes.js";
import { stepRouter } from "./routes/step.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";
import { vehicleRouter } from "./routes/vehicle.routes.js";
import { garageRouter } from "./routes/garage.routes.js";
import { leaderboardRouter } from "./routes/leaderboard.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Security & Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI CDN assets to render cleanly
  })
);

app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "morphdrive-api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Swagger / OpenAPI UI Documentation
const possiblePaths = [
  path.resolve("docs/openapi.yaml"),
  path.resolve("../../docs/openapi.yaml"),
  path.resolve("../docs/openapi.yaml"),
  path.join(process.cwd(), "docs/openapi.yaml"),
  path.join(process.cwd(), "../../docs/openapi.yaml"),
];

const openapiPath = possiblePaths.find((p) => fs.existsSync(p));

if (openapiPath) {
  const swaggerDocument = YAML.load(openapiPath);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`📖 Interactive Swagger API Documentation loaded from ${openapiPath}`);
} else {
  console.warn("⚠ openapi.yaml not found at any expected paths.");
}

// Mount Educational & Machine API Routers
app.use("/api/auth", authRouter);
app.use("/api/machines", machineRouter);
app.use("/api/machines", partRouter);
app.use("/api/machines", stepRouter);
app.use("/api/upload", uploadRouter);

// Mount Driving Sandbox & Vehicle Garage Routers
app.use("/api/vehicles", vehicleRouter);
app.use("/api/garage", garageRouter);
app.use("/api/leaderboard", leaderboardRouter);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🏎️ MorphDrive API server listening on http://localhost:${PORT}`);
    console.log(`📄 Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}

export default app;
