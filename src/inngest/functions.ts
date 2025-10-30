import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { inngest } from "./client";

const google = createGoogleGenerativeAI();

export const testAI = inngest.createFunction(
  { id: "execute-ai" },
  { event: "events/execute.ai" },
  async ({ event, step }) => {
    await step.sleep("Processing", "5s");

    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      system: "You are a helpful assistant",
      prompt: "What is 7 + 7?",
      model: google("gemini-2.5-flash"),
    });

    return steps;
  },
);
