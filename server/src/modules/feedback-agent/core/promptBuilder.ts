import { InterviewTranscript } from "./types";
import { SYSTEM_PROMPT } from "../prompts/systemPrompt";

export function buildPrompt(transcript: InterviewTranscript) {
  return `<start_of_turn>user
${SYSTEM_PROMPT}

INPUT TRANSCRIPT:
${JSON.stringify(transcript, null, 2)}

Return ONLY valid JSON output. Do not wrap the JSON in markdown code fences.
<end_of_turn>
<start_of_turn>model
`;
}

