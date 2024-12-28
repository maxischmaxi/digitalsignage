import { Layout } from "@prisma/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function useLayout(
  layoutId: string = "",
): UseQueryResult<Layout, unknown> {
  const { orgId = "" } = useParams();
  return useQuery({
    queryKey: ["layout", layoutId, orgId],
    enabled: Boolean(layoutId && orgId),
    async queryFn() {
      const response = await fetch(`/api/${orgId}/layouts/${layoutId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await response.json();
      return data;
    },
  });
}
