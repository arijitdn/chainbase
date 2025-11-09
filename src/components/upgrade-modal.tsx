"use client";

import { CrownIcon, GemIcon, PhoneIcon, SparklesIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProUpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <GemIcon className="size-7 text-blue-500" />
            <span>Upgrade to Pro</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have reached the limit of your Free plan. Upgrade to Pro to
            create more workflows and unlock additional features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => authClient.checkout({ slug: "chainbase-pro" })}
          >
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const GoldUpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CrownIcon className="size-7 text-primary" />
            <span>Upgrade to Gold</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have reached the limit of your Pro plan. Upgrade to Gold to
            create significantly more workflows and access premium features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => authClient.customer.portal()}>
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const EnterpriseUpgradeModal = ({
  open,
  onOpenChange,
}: UpgradeModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <SparklesIcon className="size-7 text-purple-500" />
            <span>Upgrade to Enterprise</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have reached the limit of your Gold plan. Upgrade to Enterprise
            for maximum workflow capacity and exclusive enterprise features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => authClient.customer.portal()}>
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ContactSalesModal = ({
  open,
  onOpenChange,
}: UpgradeModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <PhoneIcon className="size-7 text-green-500" />
            <span>Contact Sales</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have reached the limit of your Enterprise plan. Please contact
            our sales team to discuss custom solutions and increased limits
            tailored to your needs.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              // You can customize this to open email client or redirect to contact page
              window.location.href = "mailto:sales@chainbase.com";
            }}
          >
            Contact Sales
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Keep the old exports for backward compatibility
export const UpgradeModal = ProUpgradeModal;
