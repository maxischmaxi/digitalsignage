import { Layout } from "@prisma/client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { fabric } from "fabric";
import { useParams } from "next/navigation";

export function useSaveLayout(): UseMutationResult<
  Layout,
  unknown,
  { layoutId: string | undefined; version: string; objects: fabric.Object[] }
> {
  const { orgId } = useParams();

  return useMutation({
    async mutationFn({
      version,
      objects,
      layoutId,
    }: {
      version: string;
      objects: fabric.Object[];
      layoutId: string | undefined;
    }) {
      const body = JSON.stringify({ version, objects, layoutId });

      const response = await fetch(`/api/${orgId}/layouts`, {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to save layout");
      }

      return await response.json();
    },
  });
}
