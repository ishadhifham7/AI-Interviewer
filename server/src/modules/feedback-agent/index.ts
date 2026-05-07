import { FeedbackAgent } from "./core/feedbackAgent";
import { mockTranscript } from "./mocks/mockTranscript";

async function main() {
  const agent = new FeedbackAgent();

  const feedback = await agent.generate(mockTranscript);

  console.log("FINAL FEEDBACK:");
  console.log(JSON.stringify(feedback, null, 2));
}

main();
