"use client";

import {
  CreditCardIcon,
  FolderOpenIcon,
  GemIcon,
  HistoryIcon,
  KeyIcon,
  LogOut,
  type LucideProps,
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
                  tooltip={
                    subscription?.productId ===
                    "1991f990-dfb8-46dc-a5bc-799ee8f07437"
                      ? "Chainbase Gold"
                      : "Chainbase Pro"
                  }
                  className="gap-x-4 h-10 px-4"
                  onClick={() =>
                    toast.success(
                      `${
                        subscription?.productId ===
                        "1991f990-dfb8-46dc-a5bc-799ee8f07437"
                          ? "Chainbase Gold"
                          : "Chainbase Pro"
                      } is active`,
                    )
                  }
                >
                  {subscription?.productId ===
                  "1991f990-dfb8-46dc-a5bc-799ee8f07437" ? (
                    <GemIcon className="h-4 w-4 text-orange-500" />
                  ) : (
                    <GemIcon className="h-4 w-4" />
                  )}

                  <span>
                    {subscription?.productId ===
                    "1991f990-dfb8-46dc-a5bc-799ee8f07437"
                      ? "Chainbase Gold"
                      : "Chainbase Pro"}
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
