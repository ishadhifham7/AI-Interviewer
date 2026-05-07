import React from "react";
import { Feedback } from "../types/feedback";

export type FeedbackRecord = Feedback & {
  id: string;
  createdAt: any;
  interviewId?: string;
};
