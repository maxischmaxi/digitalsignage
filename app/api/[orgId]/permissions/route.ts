import { auth } from "@/lib/auth";
import { findUserByEmail, findUserPermission } from "@/lib/prisma";
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
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await findUserByEmail(data.user.email);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const permission = await findUserPermission({ userId: user.id, orgId });

    return NextResponse.json(permission?.permissions ?? [], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
