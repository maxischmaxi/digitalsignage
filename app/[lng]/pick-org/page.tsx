import PickOrgButton from "@/components/pick-org-button";
import { auth } from "@/lib/auth";
import { findUserByEmail, prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function Page() {
  const data = await auth.getSession();
  if (!data?.user.email) {
    notFound();
  }

  const user = await findUserByEmail(data.user.email);

  if (!user) {
    notFound();
  }

  const orgs = await prisma.org.findMany({
    where: {
      UsersOnOrgs: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8 p-8">
      {orgs.map((org) => (
        <li key={org.id}>
          <PickOrgButton org={org} />
        </li>
      ))}
    </ul>
  );
}
