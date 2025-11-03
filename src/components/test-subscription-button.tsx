"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { Button } from "./ui/button";

export const SubscriptionTestButton = () => {
  const trpc = useTRPC();
  const query = useQuery(trpc.testPremium.queryOptions());

  return (
    <Button
      onClick={() => {
        if (query.data?.success) {
          toast.success(query.data?.message);
        } else {
          toast.error("Something went wrong");
        }
      }}
    >
      Check Subscription
    </Button>
  );
};
