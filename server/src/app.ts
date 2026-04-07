// src/app.ts
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies
app.use(morgan("dev")); // logging

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api", routes);

// Global Error Handler
app.use(errorHandler);

export default app;
