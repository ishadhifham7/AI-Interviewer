/**
 * Build the interview question generation prompt using the CV data.
 * Optimized for Gemma 4 instruction-following format.
 * The AI must return a JSON array of 15 questions.
 */
export function buildInterviewPrompt(cvDataJson: string): string {
  return `You are an expert technical interviewer. Given the candidate's CV data below, generate exactly 15 tailored interview questions.

CANDIDATE CV DATA:
${cvDataJson}

QUESTION BREAKDOWN (MUST follow exactly — 15 questions total):
- 3 questions with category "screening"   — high-level questions to assess role fit, motivation, and background
- 5 questions with category "project"     — deep-dive into specific projects listed in the CV (tech choices, challenges, outcomes)
- 3 questions with category "technical"   — assess depth of technical skills, tools, and languages mentioned in the CV
- 2 questions with category "behavioural" — assess soft skills, collaboration, and professional conduct
- 2 questions with category "challenge"   — present or hypothetical problems the candidate would need to reason through

DIFFICULTY ASSIGNMENT:
- "junior" experience_level → mostly "easy" and "medium" questions
- "mid" experience_level    → mostly "medium" with some "hard"
- "senior" experience_level → mostly "hard" with some "medium"

Return ONLY valid JSON — an array of exactly 15 objects with no surrounding text:

[
  {
    "id": 1,
    "category": "screening",
    "question": "...",
    "difficulty": "easy",
    "hint": "optional short hint for the interviewer"
  }
]

STRICT RULES:
- Output ONLY the JSON array, nothing else
- Do NOT wrap the JSON in markdown code fences or any other text
- All 4 fields (id, category, question, difficulty) are required; hint is optional
- category MUST be one of: "screening", "project", "technical", "behavioural", "challenge"
- difficulty MUST be one of: "easy", "medium", "hard"
- Questions must be specific to THIS candidate's CV — do NOT ask generic questions unrelated to their profile
- Each question must be a complete, clearly phrased sentence
- No duplicate questions
- No trailing commas, ensure valid JSON`;
}

/**
 * Build a prompt to evaluate a candidate's answer.
 * Returns a compact JSON score object.
 */
export function buildEvalPrompt(
  question: string,
  answer: string,
  category: string,
): string {
  return `You are an expert interview evaluator. Score the candidate's answer to the following interview question.

QUESTION (${category}):
${question}

CANDIDATE'S ANSWER:
${answer}

Score the answer on these 4 dimensions (0 to 10 each):
- clarity: How clearly the candidate expressed their thoughts
- relevance: How directly the answer addresses the question
- depth: How much technical or professional depth was demonstrated
- overall: A weighted average of the above

Also provide a brief one-sentence feedback comment.

Return ONLY valid JSON with no surrounding text:

{
  "clarity": 0,
  "relevance": 0,
  "depth": 0,
  "overall": 0,
  "feedback": "..."
}

STRICT RULES:
- Output ONLY the JSON object, nothing else
- Do NOT wrap the JSON in markdown code fences
- All 5 fields are required
- Scores must be integers from 0 to 10
- feedback must be a single concise sentence`;
}
