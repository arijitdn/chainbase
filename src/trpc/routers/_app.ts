import { inngest } from "@/inngest/client";
import { polarClient } from "@/lib/polar";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "../init";

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

  testPremium: premiumProcedure.query(async () => {
    return {
      success: true,
      message: "Subscription active",
    };
  }),
});

export type AppRouter = typeof appRouter;
