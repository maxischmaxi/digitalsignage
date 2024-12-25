import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ lng: string }>;
};

export default async function Page({ params }: Props) {
  const lng = (await params).lng;

  const data = await auth.getSession();

  if (!data) {
    notFound();
  }

  if (!data.user.email) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.user.email,
    },
  });

  if (!user) {
    notFound();
  }

  if (user.currentOrg) {
    redirect(`/${lng}/${user.currentOrg}`);
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

  if (orgs.length === 0) {
    redirect(`/${lng}/create-org`);
  }

  redirect(`/${lng}/pick-org`);
}
