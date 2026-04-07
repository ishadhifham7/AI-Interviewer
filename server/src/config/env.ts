import dotenv from "dotenv";
import type { ServiceAccount } from "firebase-admin";

dotenv.config();

export const PORT = Number(process.env.PORT) || 5000;

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!privateKey) {
  throw new Error("Missing FIREBASE_PRIVATE_KEY in environment variables");
}

export const FIREBASE_SERVICE_ACCOUNT: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || "ai-interviewer-7c593",
  clientEmail:
    process.env.FIREBASE_CLIENT_EMAIL ||
    "firebase-adminsdk-fbsvc@ai-interviewer-7c593.iam.gserviceaccount.com",
  privateKey,
};
