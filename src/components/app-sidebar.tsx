"use client";

import {
  CreditCardIcon,
  CrownIcon,
  FolderOpenIcon,
  GemIcon,
  HistoryIcon,
  KeyIcon,
  LogOut,
  type LucideProps,
  SparklesIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { toast } from "sonner";
import { useActiveSubscription } from "@/features/payments/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";

interface IMenuItems {
  title: string;
  items: {
    title: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    url: string;
  }[];
}

const menuItems: IMenuItems[] = [
  {
    title: "Workflows",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

export const AppSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { hasActiveSubscription, isLoading, subscription } =
    useActiveSubscription();

  const getSubscriptionName = (subscriptionId: string) => {
    switch (subscriptionId) {
      case "9cc1a72a-96fc-4d07-ae0d-2f13cad572f2":
        return "Chainbase Pro";
      case "1991f990-dfb8-46dc-a5bc-799ee8f07437":
        return "Chainbase Gold";
      case "201afdb8-2dcc-45b0-b358-fa5482ac205e":
        return "Chainbase Enterprise";
      default:
        return "Upgrade to Pro";
    }
  };

  const getSubscriptionLogo = (subscriptionId: string) => {
    switch (subscriptionId) {
      case "9cc1a72a-96fc-4d07-ae0d-2f13cad572f2":
        return <GemIcon className="h-4 w-4 text-blue-500" />;
      case "1991f990-dfb8-46dc-a5bc-799ee8f07437":
        return <CrownIcon className="size-7 text-primary" />;
      case "201afdb8-2dcc-45b0-b358-fa5482ac205e":
        return <SparklesIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <StarIcon className="h-4 w-4" />;
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
            <Link href="/" prefetch>
              <Image
                src="/logos/logo.svg"
                alt="Chainbase"
                width={30}
                height={30}
              />
              <span className="font-semibold text-sm">Chainbase</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                      }
                      asChild
                      className="gap-x-4 h-10 px-4"
                    >
                      <Link href={item.url} prefetch>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {isLoading ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-[150px]" />
              </div>
            </div>
          ) : (
            <SidebarMenuItem>
              {!hasActiveSubscription ? (
                <SidebarMenuButton
                  tooltip="Upgrade to Pro"
                  className="gap-x-4 h-10 px-4"
                  onClick={() =>
                    authClient.checkout({
                      slug: "chainbase-pro",
                    })
                  }
                >
                  <StarIcon className="h-4 w-4" />
                  <span>Upgrade to Pro</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  tooltip={getSubscriptionName(subscription?.productId ?? "")}
                  className="gap-x-4 h-10 px-4"
                  onClick={() =>
                    toast.success(
                      `${getSubscriptionName(
                        subscription?.productId ?? "",
                      )} is active`,
                    )
                  }
                >
                  {getSubscriptionLogo(subscription?.productId ?? "")}
                  <span>
                    {getSubscriptionName(subscription?.productId ?? "")}
                  </span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Billing Portal"
              className="gap-x-4 h-10 px-4"
              onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className="h-4 w-4" />
              <span>Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              className="gap-x-4 h-10 px-4"
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      toast.success("Signed out successfully");
                      router.replace("/login");
                    },
                    onError: ({ error }) => {
                      if (error.message) {
                        toast.error(`Failed to sign out: ${error.message}`);
                      } else {
                        toast.error("Failed to sign out");
                      }
                    },
                  },
                });
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
