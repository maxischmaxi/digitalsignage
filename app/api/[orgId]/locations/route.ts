import { auth } from "@/lib/auth";
import { findAllLocations, findUserByEmail } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ orgId: string }>;
};

export async function GET(
  _: NextRequest,
  { params }: Props,
): Promise<NextResponse> {
  const data = await auth.getSession();

  if (!data?.user?.email) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const user = await findUserByEmail(data.user.email);

  if (!user) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const locations = await findAllLocations({
    userId: user.id,
    orgId: (await params).orgId,
  });

  if (!locations) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(locations);
}
