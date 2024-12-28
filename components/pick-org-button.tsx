"use client";

import { Org } from "@prisma/client";
import { Button } from "./ui/button";
import { useRouter } from "@/i18n/routing";

type Props = {
  org: Org;
};

export default function PickOrgButton({ org }: Props) {
  const router = useRouter();

  function handleClick() {
    router.push(`/${org.id}`);
  }

  return (
    <Button type="button" onClick={handleClick}>
      {org.name}
    </Button>
  );
}
