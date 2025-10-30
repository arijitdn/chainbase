import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  createWorkflow: protectedProcedure.mutation(async ({ ctx }) => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "contact@arijit.dev",
      },
    });
  }),
});

export type AppRouter = typeof appRouter;
