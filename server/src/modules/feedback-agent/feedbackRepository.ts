import admin from "firebase-admin";
import { getFirestoreDB } from "../../config/firestore";
import {
  FeedbackPersistenceResult,
  FeedbackRecordInput,
} from "./feedbackPersistenceTypes";

const FEEDBACK_COLLECTION = "interview_feedback";

export const saveFeedbackRecord = async (
  record: FeedbackRecordInput,
): Promise<FeedbackPersistenceResult> => {
  const db = getFirestoreDB();
  const docRef = db.collection(FEEDBACK_COLLECTION).doc();

  await docRef.set({
    ...record,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { id: docRef.id };
};

export const getFeedbackHistory = async () => {
  const db = getFirestoreDB();
  const snapshot = await db
    .collection(FEEDBACK_COLLECTION)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
