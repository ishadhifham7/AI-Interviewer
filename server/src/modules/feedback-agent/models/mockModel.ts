import { InterviewTranscript, Feedback } from "../core/types";

export class MockModel {
  generateFeedback(transcript: InterviewTranscript): Feedback {
    return {
      overall_score: 76,

      interview_summary:
        "Candidate shows good foundational knowledge but lacks deeper technical reasoning in certain areas.",

      strengths: [
        "Clear communication",
        "Good foundational understanding",
        "Able to explain projects confidently",
      ],

      weaknesses: [
        "Limited system-level depth",
        "Some answers lacked technical completeness",
      ],

      question_analysis: transcript.conversation.map((item, index) => ({
        question: item.question,

        evaluation:
          index === 0
            ? "Good introductory response with clear career interests."
            : index === 1
              ? "Correct explanation but lacked deeper REST architectural concepts."
              : "Good project explanation but could include technical challenges and scalability aspects.",

        score: index === 0 ? 8 : index === 1 ? 7 : 8,

        what_went_wrong:
          index === 0
            ? "Could provide more detail about technical strengths and goals."
            : index === 1
              ? "Did not mention statelessness, resources, or API architecture."
              : "Did not explain technical decisions or engineering challenges.",

        improvement_suggestion:
          index === 0
            ? "Add more technical and career-focused details."
            : index === 1
              ? "Include REST principles and real-world API examples."
              : "Discuss architecture, challenges, and impact of the project.",
      })),

      communication_analysis: {
        clarity: 8 / 10,
        structure: 7 / 10,
        technical_depth: 6 / 10,
      },

      final_mentor_advice:
        "Focus on expanding technical explanations with deeper reasoning, architecture discussions, and real-world engineering trade-offs.",

      next_steps: [
        "Study backend architecture concepts",
        "Practice answering with structured STAR format",
        "Improve depth in system design discussions",
      ],
    };
  }
}
