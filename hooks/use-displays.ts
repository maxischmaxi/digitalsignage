import { Prisma } from "@prisma/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function useDisplays(): UseQueryResult<
  Prisma.DisplayGetPayload<{
    include: {
      Location: true;
      Timeframe: true;
    };
  }>[],
  unknown
> {
  const { orgId } = useParams();

  return useQuery({
    queryKey: ["displays", orgId],
    async queryFn() {
      const response = await fetch(`/api/${orgId}/displays`);
      const data = await response.json();

      if (response.status !== 200) {
        throw new Error("Not found");
      }

      if (!Array.isArray(data)) {
        throw new Error("error on server");
      }

      return data as Prisma.DisplayGetPayload<{
        include: {
          Location: true;
          Timeframe: true;
        };
      }>[];
    },
  });
}
