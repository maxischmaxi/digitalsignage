import { auth } from "@/lib/auth";
import { findUserByEmail, orgExists, prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ orgId: string; layoutId: string }>;
};

export async function GET(
  _: NextRequest,
  { params }: Props,
): Promise<NextResponse> {
  const { layoutId, orgId } = await params;

  if (!layoutId) {
    return NextResponse.json(
      { message: "Layout ID is required" },
      { status: 400 },
    );
  }

  if (!(await orgExists(orgId))) {
    return NextResponse.json({ message: "Org not found" }, { status: 404 });
  }

  const data = await auth.getSession();

  if (!data?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await findUserByEmail(data.user.email);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const layout = await prisma.layout.findUnique({
    where: {
      id: layoutId,
    },
  });

  if (!layout) {
    return NextResponse.json({ message: "Layout not found" }, { status: 404 });
  }

  return NextResponse.json(layout, { status: 200 });
}
