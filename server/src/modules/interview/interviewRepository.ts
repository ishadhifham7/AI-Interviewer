import admin from "firebase-admin";
import { getFirestoreDB } from "../../config/firestore";
import { ActiveInterviewSession } from "./interviewTypes";

const COLLECTION = "interview_sessions";

/**
 * Save a completed interview session to Firestore.
 */
export const saveInterviewSession = async (
  session: ActiveInterviewSession,
): Promise<string> => {
  const db = getFirestoreDB();
  const ref = db.collection(COLLECTION).doc(session.sessionId);

  // Exclude undefined values and prepare for Firestore
  const sessionData = {
    ...session,
    savedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await ref.set(sessionData);

  console.log(`[InterviewRepo] Saved session ${session.sessionId} to Firestore`);
  return session.sessionId;
};

/**
 * Fetch the history of completed interview sessions.
 */
export const getInterviewHistory = async (limit = 20) => {
  const db = getFirestoreDB();
  const snapshot = await db
    .collection(COLLECTION)
    .where("status", "==", "completed")
    .orderBy("completedAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ActiveInterviewSession, "sessionId">),
  }));
};
