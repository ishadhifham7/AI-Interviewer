// // server/src/modules/cv/ai/cvPrompt.ts

// /**
//  * Build a strict prompt for Gemini to extract structured CV JSON from an attached PDF.
//  */
// export function buildCVPrompt(): string {
//   return `
// You are a CV parser AI. Read the attached PDF CV and return STRICTLY the JSON in this format:

// {
//   "name": "",
//   "professional_summary": "",
//   "skills": [],
//   "projects": [
//     {
//       "name": "",
//       "technologies": [],
//       "description": ""
//     }
//   ],
//   "experience": [
//     {
//       "role": "",
//       "company": "",
//       "duration": ""
//     }
//   ],
//   "education": [],
//   "achievements_and_volunteering": [],
//   "certifications": [],
//   "additional_information": "",
//   "experience_level": "junior | mid | senior"
// }

// Requirements:
// - ONLY return JSON (no explanations, no extra text)
// - Use empty arrays/strings when information is missing or not available
// - Validate JSON format
// - Keep output concise and structured
// - Focus on extracting relevant information for the CV, avoid unnecessary details
// -For the additional information section, focus on extracting information like soft skills, languages, interests, etc.
// `;
// }

/**
 * Build a strict prompt for Gemini to extract structured CV JSON from an attached PDF.
 */
export function buildCVPrompt(): string {
  return `
You are an advanced CV parsing AI. Your task is to read the attached PDF CV and extract structured information.

Return ONLY valid JSON in the exact structure below:

{
  "name": "",
  "professional_summary": "",
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
  "achievements_and_volunteering": [],
  "certifications": [],
  "additional_information": "",
  "experience_level": "junior | mid | senior"
}

STRICT RULES:
- DO NOT include any text outside the JSON
- DO NOT include explanations, comments, or markdown
- Output must be valid, parseable JSON
- Use double quotes for all keys and values
- Do not add extra fields

DATA EXTRACTION RULES:
- Extract information even if formatting is inconsistent or spread across sections
- Handle multi-column layouts by logically reconstructing the reading order
- Infer missing labels where possible (e.g., identify skills even if not explicitly labeled)
- Merge duplicate or repeated entries
- Keep all text concise and clean (no unnecessary words)

FIELD-SPECIFIC RULES:
- "name": Extract full name
- "professional_summary": concise sentences summarizing the candidate
- "skills": Array of relevant technical skills (no duplicates)
- "projects": Include only meaningful projects (ignore trivial ones)
- "technologies": Extract tools, frameworks, languages used
- "experience": Include only real work experience (internships included)
- "duration": Keep original format (e.g., "Jan 2022 - Dec 2023")
- "education": Include degrees, institutions, and years if available
- "achievements_and_volunteering": Include awards, leadership, or volunteer work
- "certifications": Include every certifications
- "additional_information": Include languages, interests, soft skills, or other relevant info

EXPERIENCE LEVEL CLASSIFICATION:
- "junior": 0–2 years or student/entry-level
- "mid": 2–5 years
- "senior": 5+ years or leadership roles

FALLBACK RULES:
- If a section is missing, return empty array [] or empty string ""
- Never return null or undefined
- If unsure, make the best reasonable inference based on context

FINAL CHECK:
- Ensure JSON is valid
- Ensure all fields are present
- Ensure no trailing commas
`;
}
