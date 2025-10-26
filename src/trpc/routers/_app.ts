import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    return {
      greeting: `Hello, ${ctx.auth.user.name}`,
    };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
