import { auth } from "@/lib/auth";
import { checkIfUserIsInOrg, findUserByEmail, prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ orgId: string }>;
};

export async function GET(
  _: NextRequest,
  { params }: Props,
): Promise<NextResponse> {
  const orgId = (await params).orgId;
  const data = await auth.getSession();

  if (!data?.user?.email) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const user = await findUserByEmail(data.user.email);

  if (!user) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const isInOrg = await checkIfUserIsInOrg({
    userId: user.id,
    orgId,
  });

  if (!isInOrg) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const displays = await prisma.display.findMany({
    where: {
      orgId,
    },
    include: {
      Location: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(displays);
}
