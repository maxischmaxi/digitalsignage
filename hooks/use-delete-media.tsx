import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function useDeleteMedia() {
  const { orgId } = useParams();

  return useMutation({
    async mutationFn(data: { id: string }) {
      await fetch(`/api/${orgId}/media/${data.id}`, {
        method: "DELETE",
      });
    },
  });
}
