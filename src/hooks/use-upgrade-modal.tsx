"use client";

import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { GoldUpgradeModal, UpgradeModal } from "@/components/upgrade-modal";

export const useUpgradeModal = () => {
  const [open, setOpen] = useState(false);
  const [showGoldModal, setShowGoldModal] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "FORBIDDEN") {
        const isUsageLimitError = error.message?.includes(
          "utilised all of the limits",
        );
        setShowGoldModal(isUsageLimitError);
        setOpen(true);
        return true;
      }
    }
    return false;
  };

  const modal = showGoldModal ? (
    <GoldUpgradeModal open={open} onOpenChange={setOpen} />
  ) : (
    <UpgradeModal open={open} onOpenChange={setOpen} />
  );

  return { handleError, modal };
};
