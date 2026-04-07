// src/config/firestore.ts
import admin from "firebase-admin";
import { FIREBASE_SERVICE_ACCOUNT } from "./env";

let db: admin.firestore.Firestore;

export const connectFirestore = async () => {
  if (db) return db;

  admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
  });

  db = admin.firestore();
  console.log("✅ Firestore connected");
  return db;
};

export const getFirestoreDB = (): admin.firestore.Firestore => {
  if (!db) throw new Error("Firestore not initialized");
  return db;
};