import { InterviewTranscript } from "./types";
import { SYSTEM_PROMPT } from "../prompts/systemPrompt";

export function buildPrompt(transcript: InterviewTranscript) {
  return `
${SYSTEM_PROMPT}

INPUT TRANSCRIPT:
${JSON.stringify(transcript, null, 2)}

Return ONLY JSON output.
`;
}
