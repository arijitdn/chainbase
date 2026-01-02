import { channel, topic } from "@inngest/realtime";

export const STRIPE_TRIGGER_NAME = "stripe-trigger";

export const stripeTriggerChannel = channel(STRIPE_TRIGGER_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
