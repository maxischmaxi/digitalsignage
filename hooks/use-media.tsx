import { Media } from "@prisma/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function useMedia(): UseQueryResult<Media[], unknown> {
  const { orgId } = useParams();

  return useQuery({
    queryKey: ["media", orgId],
    enabled: !!orgId,
    initialData: [],
    queryFn: async () => {
      const res = await fetch(`/api/${orgId}/media`);
      return res.json();
    },
  });
}
