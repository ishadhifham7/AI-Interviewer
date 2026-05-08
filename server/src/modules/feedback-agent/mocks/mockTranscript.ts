import { InterviewTranscript } from "../core/types";

export const mockTranscript: InterviewTranscript = {
  conversation: [
    {
      question: "Tell me about yourself",
      answer:
        "I am a second year Computer Science student interested in cloud engineering and AI systems.",
    },
    {
      question: "What is REST API?",
      answer:
        "REST API is a way for systems to communicate using HTTP methods like GET and POST.",
    },
    {
      question: "Explain a project you worked on",
      answer:
        "I built an AI interview system using React and Node where users can take mock interviews.",
    },
  ],
};
