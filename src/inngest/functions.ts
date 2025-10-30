import { inngest } from "./client";

export const workflowTest = inngest.createFunction(
  {
    id: "workflow-test",
  },
  {
    event: "test/hello.world",
  },
  async ({ event, step }) => {
    await step.sleep("wait", "10s");

    await step.sleep("run a background calculation", "20s");

    await step.sleep("completing process", "5s");

    return {
      message: `Hello ${event.data.email}!`,
    };
  },
);
