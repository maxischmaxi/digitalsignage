import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { User } from "@auth0/nextjs-auth0/types";

type Response = UseQueryResult<string[], unknown>;

export function usePermissions(user: User | null | undefined): Response {
  return useQuery({
    enabled: Boolean(user),
    queryKey: ["permissions", user?.email],
    async queryFn() {
      const response = await fetch(`/api/permissions`);
      const data = await response.json();
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    },
  });
}
