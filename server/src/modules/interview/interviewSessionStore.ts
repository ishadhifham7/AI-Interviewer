/**
 * In-memory session store for active interview sessions.
 *
 * Sessions live here while the interview is in progress.
 * On completion, they are persisted to Firestore and removed from memory.
 */

import crypto from "crypto";
import { ActiveInterviewSession } from "./interviewTypes";

const sessions = new Map<string, ActiveInterviewSession>();

/**
 * Create a new session and store it in memory.
 */
export const createSession = (
  data: Omit<ActiveInterviewSession, "sessionId">,
): ActiveInterviewSession => {
  const sessionId = crypto.randomUUID();
  const session: ActiveInterviewSession = { ...data, sessionId };
  sessions.set(sessionId, session);

  console.log(
    `[SessionStore] Created session ${sessionId} for ${session.candidateName}`,
  );
  return session;
};

/**
 * Retrieve a session by ID.
 */
export const getSession = (
  sessionId: string,
): ActiveInterviewSession | undefined => {
  return sessions.get(sessionId);
};

/**
 * Update an existing session with partial data.
 */
export const updateSession = (
  sessionId: string,
  updates: Partial<ActiveInterviewSession>,
): ActiveInterviewSession | undefined => {
  const session = sessions.get(sessionId);
  if (!session) return undefined;

  const updated = { ...session, ...updates };
  sessions.set(sessionId, updated);
  return updated;
};

/**
 * Remove a session from memory (called after persisting to Firestore).
 */
export const deleteSession = (sessionId: string): boolean => {
  const deleted = sessions.delete(sessionId);
  if (deleted) {
    console.log(`[SessionStore] Deleted session ${sessionId} from memory`);
  }
  return deleted;
};

/**
 * Get count of active sessions (for health monitoring).
 */
export const getActiveSessionCount = (): number => {
  return sessions.size;
};
