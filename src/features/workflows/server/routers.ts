import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { generateSlug } from "random-word-slugs";
import z from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    const workflows = await prisma.workflow.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
    });
    const subscriptions = await auth.api.subscriptions({
      headers: await headers(),
    });

    if (
      !subscriptions ||
      (subscriptions.result.items[0].productId !==
        "1991f990-dfb8-46dc-a5bc-799ee8f07437" &&
        workflows.length >= 5)
    ) {
      throw new TRPCError({
        message: `You have utilised all of the limits. (${workflows.length}/5)`,
        code: "FORBIDDEN",
      });
    }

    return prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
      },
    });
  }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return prisma.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return prisma.workflow.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return prisma.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  getMany: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
    });
  }),
});
