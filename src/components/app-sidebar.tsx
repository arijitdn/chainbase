"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ChevronsUpDown,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { useActiveSubscription } from "@/features/payments/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
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
  const { subscription, isLoading: isSubscriptionLoading } =
    useActiveSubscription();
  const trpc = useTRPC();
  const { data: usage } = useQuery({
    ...trpc.workflows.getUsage.queryOptions(),
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return data;
    },
  });

  const getSubscriptionName = (subscriptionId: string) => {
    switch (subscriptionId) {
      case "9cc1a72a-96fc-4d07-ae0d-2f13cad572f2":
        return "Pro";
      case "1991f990-dfb8-46dc-a5bc-799ee8f07437":
        return "Gold";
      case "201afdb8-2dcc-45b0-b358-fa5482ac205e":
        return "Enterprise";
      default:
        return "Upgrade to Pro";
    }
  };

  const getSubscriptionIcon = (subscriptionId?: string) => {
    switch (subscriptionId) {
      case "9cc1a72a-96fc-4d07-ae0d-2f13cad572f2": // Pro
        return <GemIcon className="mr-2 h-4 w-4 text-blue-500" />;
      case "1991f990-dfb8-46dc-a5bc-799ee8f07437": // Gold
        return <CrownIcon className="mr-2 h-4 w-4 text-yellow-500" />;
      case "201afdb8-2dcc-45b0-b358-fa5482ac205e": // Enterprise
        return <SparklesIcon className="mr-2 h-4 w-4 text-purple-500" />;
      default:
        return <StarIcon className="mr-2 h-4 w-4 text-muted-foreground" />;
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
          <SidebarMenuItem>
            {isSubscriptionLoading ? (
              <SidebarMenuButton className="gap-x-4 h-10 px-4">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
              </SidebarMenuButton>
            ) : subscription?.productId ? (
              <SidebarMenuButton
                tooltip="Billing Portal"
                className="gap-x-4 h-10 px-4"
                onClick={() => authClient.customer.portal()}
              >
                <CreditCardIcon className="h-4 w-4" />
                <span>Billing Portal</span>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className="gap-x-4 h-10 px-4"
                onClick={() => authClient.checkout({ slug: "chainbase-pro" })}
              >
                <GemIcon className="h-4 w-4 text-blue-500" />
                <span>Upgrade to Pro</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            {isSessionLoading ? (
              <div className="flex items-center gap-2 p-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:ring-0"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt={session?.user?.name || ""}
                      />
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                        {session?.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user?.name}
                      </span>
                      <span className="truncate text-xs">
                        {subscription?.productId
                          ? getSubscriptionName(subscription.productId)
                          : "Free"}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={session?.user?.image || ""}
                          alt={session?.user?.name || ""}
                        />
                        <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                          {session?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {session?.user?.name}
                        </span>
                        <span className="truncate text-xs">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      {getSubscriptionIcon(subscription?.productId)}
                      <span>
                        {subscription?.productId
                          ? getSubscriptionName(subscription.productId)
                          : "Free"}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <div className="p-2">
                      <p className="text-xs font-medium mb-2">Usage</p>
                      <Progress
                        value={
                          ((usage?.workflowsCount || 0) / (usage?.limit || 1)) *
                          100
                        }
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {usage?.workflowsCount || 0} / {usage?.limit || 0}{" "}
                        Workflows
                      </p>
                    </div>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            toast.success("Signed out successfully");
                            router.replace("/login");
                          },
                          onError: ({ error }) => {
                            if (error.message) {
                              toast.error(
                                `Failed to sign out: ${error.message}`,
                              );
                            } else {
                              toast.error("Failed to sign out");
                            }
                          },
                        },
                      });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
