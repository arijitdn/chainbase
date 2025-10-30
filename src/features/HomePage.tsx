"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";

export const HomePage = () => {
  const router = useRouter();
  const trpc = useTRPC();

  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Workflow called");
      },
    }),
  );

  const testAI = useMutation(trpc.testAI.mutationOptions());

  return (
    <div className="flex flex-col gap-6 w-full h-svh justify-center items-center">
      <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>
        Test AI
      </Button>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create Workflow
      </Button>
      <Button
        onClick={() => {
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.replace("/login");
                toast.success("Logged out successfully");
              },
              onError: ({ error }) => {
                console.log(error);
                toast.error("Something went wrong while logging out");
              },
            },
          });
        }}
      >
        Logout
      </Button>
    </div>
  );
};
