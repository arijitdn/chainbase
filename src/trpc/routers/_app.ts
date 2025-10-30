import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  testAI: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "events/execute.ai",
    });

    return { success: true, message: "Job queued" };
  }),

  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "contact@arijit.dev",
      },
    });

    return { success: true, message: "Job queued" };
  }),
});

export type AppRouter = typeof appRouter;
