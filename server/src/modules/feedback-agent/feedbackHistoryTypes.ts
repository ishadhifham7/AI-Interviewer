import { FeedbackRecord } from "./feedbackPersistenceTypes";

export type HistoryRecord = {
  id: string;
} & FeedbackRecord;
