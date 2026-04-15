/**
 * Build the interview question generation prompt using the CV data.
 * The AI must return a JSON array of 15 questions.
 */
export function buildInterviewPrompt(cvDataJson: string): string {
  return `
You are an expert technical interviewer. Given the candidate's CV data below, generate exactly 15 tailored interview questions.

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
- All 4 fields (id, category, question, difficulty) are required; hint is optional
- category MUST be one of: "screening", "project", "technical", "behavioural", "challenge"
- difficulty MUST be one of: "easy", "medium", "hard"
- Questions must be specific to THIS candidate's CV — do NOT ask generic questions unrelated to their profile
- Each question must be a complete, clearly phrased sentence
- No duplicate questions
- No trailing commas, ensure valid JSON
`;
}
