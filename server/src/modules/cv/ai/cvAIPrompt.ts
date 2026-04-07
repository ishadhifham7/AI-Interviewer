// server/src/modules/cv/ai/cvPrompt.ts

/**
 * Build a strict prompt for Gemini to extract structured CV JSON from an attached PDF.
 */
export function buildCVPrompt(): string {
  return `
You are a CV parser AI. Read the attached PDF CV and return STRICTLY the JSON in this format:

{
  "name": "",
  "skills": [],
  "projects": [
    {
      "name": "",
      "technologies": [],
      "description": ""
    }
  ],
  "experience": [
    {
      "role": "",
      "company": "",
      "duration": ""
    }
  ],
  "education": [],
  "experience_level": "junior | mid | senior"
}

Requirements:
- ONLY return JSON (no explanations, no extra text)
- Use empty arrays/strings when information is missing
- Validate JSON format
- Keep output concise and structured
`;
}
