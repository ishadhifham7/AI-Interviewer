// server/src/modules/cv/types/cvTypes.ts

// --------------------------
// File upload result
// --------------------------
export interface UploadCvResult {
  fileId: string; // Unique ID (DB or temp)
  filePath: string; // Where file is stored
  originalName: string; // Original uploaded file name
  size: number; // Size in bytes
}

// --------------------------
// Project information
// --------------------------
export interface CVProject {
  name: string;
  technologies: string[];
  description: string;
}

// --------------------------
// Work experience
// --------------------------
export interface CVExperience {
  role: string;
  company: string;
  duration: string;
}

// --------------------------
// Main CV structure returned by AI
// --------------------------
export interface CVData {
  name: string;
  skills: string[];
  projects: CVProject[];
  experience: CVExperience[];
  education: string[];
  experience_level: "junior" | "mid" | "senior";
}

// --------------------------
// Full CV object including upload metadata
// --------------------------
export interface CVFull extends UploadCvResult {
  cvData: CVData;
}
