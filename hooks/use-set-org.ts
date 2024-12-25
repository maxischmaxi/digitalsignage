import { Org } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

export function useSetOrg() {
  return useMutation({
    async mutationFn(org: Org) {
      await fetch("/api/orgs/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(org),
      });
    },
  });
}
