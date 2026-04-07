// src/server.ts
import app from "./app";
import { PORT } from "./config/env";
import { connectFirestore } from "./config/firestore";

const startServer = async () => {
  try {
    // Connect to Firestore
    await connectFirestore();
    console.log("✅ Firestore connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
