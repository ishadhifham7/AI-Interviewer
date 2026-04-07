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

// Routes
app.use("/api", routes);

// Global Error Handler
app.use(errorHandler);

export default app;