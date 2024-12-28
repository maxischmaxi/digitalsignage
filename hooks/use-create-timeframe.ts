import { timeframe } from "@/app/[lng]/[orgId]/timeline/AddTimeframe";
import { Timeframe } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { z } from "zod";

export function useCreateTimeframe() {
  const { orgId = "" } = useParams();

  return useMutation({
    async mutationFn(data: z.infer<typeof timeframe>) {
      const body = JSON.stringify(data);

      const response = await fetch(`/api/${orgId}/timeframes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (response.status !== 201) {
        throw new Error("Failed to create timeframe");
      }

      return (await response.json()) as Timeframe;
    },
  });
}
