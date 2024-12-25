import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Org } from "@prisma/client";
import { useUser } from "@auth0/nextjs-auth0";

type Response = UseQueryResult<Org[], unknown>;

export function useOrgs(): Response {
  const { user } = useUser();

  return useQuery({
    queryKey: ["orgs"],
    enabled: Boolean(user),
    async queryFn() {
      const response = await fetch("/api/orgs");
      const data = await response.json();
      return data;
    },
  });
}
