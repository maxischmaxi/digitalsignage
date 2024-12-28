import "./timeline.css";
import { auth } from "@/lib/auth";
import dayjs from "dayjs";
import de from "dayjs/locale/de";
import en from "dayjs/locale/en";
import { checkIfUserIsInOrg, findUserByEmail, prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Timeline } from "./Timeline";

type Props = {
  params: Promise<{ lng: string; orgId: string }>;
};

export default async function Page({ params }: Props) {
  const { orgId, lng } = await params;

  dayjs.locale(lng === "de" ? de : en);

  const data = await auth.getSession();

  if (!data?.user?.email) {
    notFound();
  }

  const user = await findUserByEmail(data.user.email);
  if (!user) {
    notFound();
  }

  const isInOrg = await checkIfUserIsInOrg({
    userId: user.id,
    orgId,
  });

  if (!isInOrg) {
    notFound();
  }

  const displays = await prisma.display.findMany({
    where: {
      orgId,
    },
    include: {
      Location: true,
      timeframes: {
        include: {
          Layout: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return <Timeline displays={displays} />;
}
