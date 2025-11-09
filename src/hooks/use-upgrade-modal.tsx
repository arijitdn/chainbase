"use client";

import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import {
  ContactSalesModal,
  EnterpriseUpgradeModal,
  GoldUpgradeModal,
  ProUpgradeModal,
} from "@/components/upgrade-modal";

type PlanType = "free" | "pro" | "gold" | "enterprise";

export const useUpgradeModal = () => {
  const [open, setOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanType>("free");

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "FORBIDDEN") {
        const isUsageLimitError = error.message?.includes(
          "utilised all of the limits",
        );

        if (isUsageLimitError) {
          // Extract plan from error message
          const message = error.message.toLowerCase();
          if (message.includes("free plan")) {
            setCurrentPlan("free");
          } else if (message.includes("pro plan")) {
            setCurrentPlan("pro");
          } else if (message.includes("gold plan")) {
            setCurrentPlan("gold");
          } else if (message.includes("enterprise plan")) {
            setCurrentPlan("enterprise");
          }
        }

        setOpen(true);
        return true;
      }
    }
    return false;
  };

  const getModal = () => {
    switch (currentPlan) {
      case "free":
        return <ProUpgradeModal open={open} onOpenChange={setOpen} />;
      case "pro":
        return <GoldUpgradeModal open={open} onOpenChange={setOpen} />;
      case "gold":
        return <EnterpriseUpgradeModal open={open} onOpenChange={setOpen} />;
      case "enterprise":
        return <ContactSalesModal open={open} onOpenChange={setOpen} />;
      default:
        return <ProUpgradeModal open={open} onOpenChange={setOpen} />;
    }
  };

  const modal = getModal();

  return { handleError, modal };
};
