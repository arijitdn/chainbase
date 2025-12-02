import { NonRetriableError } from "inngest";
import type { NodeType } from "@/generated/prisma";
import prisma from "@/lib/db";
import { getExecutor } from "@/lib/executor-registry";
import { googleFormTriggerChannel } from "./channels/googleFormTrigger";
import { httpRequestChannel } from "./channels/httpRequest";
import { manualTriggerChannel } from "./channels/manualTrigger";
import { inngest } from "./client";
import { topologicalSort } from "./utils";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries: 0 },
  {
    event: "events/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Invalid workflow");
    }

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowId,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    let context = event.data.initialData || {};

    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    return { workflowId, result: context };
  },
);
