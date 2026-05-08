import { InterviewTranscript, Feedback } from "./types";
import { MockModel } from "../models/mockModel";
import { buildPrompt } from "./promptBuilder";

export class FeedbackAgent {
  private model: MockModel;

  constructor() {
    this.model = new MockModel();
  }

  async generate(transcript: InterviewTranscript): Promise<Feedback> {
    // Step 1: build prompt (future Gemma usage)
    const prompt = buildPrompt(transcript);

    // Step 2: call model (mock for now)
    const result = this.model.generateFeedback(transcript);

    return result;
  }
}
