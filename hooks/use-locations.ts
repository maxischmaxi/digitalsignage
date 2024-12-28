import { Location } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function useLocations() {
  const { orgId } = useParams();

  return useQuery({
    queryKey: ["locations"],
    async queryFn() {
      const response = await fetch(`/api/${orgId}/locations`);
      const data = await response.json();

      if (response.status !== 200) {
        throw new Error("Not found");
      }

      if (!Array.isArray(data)) {
        throw new Error("error on server");
      }

      return data as Location[];
    },
  });
}
