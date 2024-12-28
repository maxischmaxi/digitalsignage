import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { User } from "@auth0/nextjs-auth0/types";
import { useParams } from "next/navigation";

type Response = UseQueryResult<string[], unknown>;

export function usePermissions(user: User | null | undefined): Response {
  const { orgId } = useParams();

  return useQuery({
    enabled: Boolean(user),
    queryKey: ["permissions", user?.email, orgId],
    async queryFn() {
      const response = await fetch(`/api/${orgId}/permissions`);
      const data = await response.json();
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    },
  });
}
