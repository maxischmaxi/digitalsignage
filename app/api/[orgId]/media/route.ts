import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ orgId: string }> },
): Promise<NextResponse> {
  const orgId = (await params).orgId;

  const org = await prisma.org.findUnique({
    where: {
      id: orgId,
    },
    include: {
      Media: true,
    },
  });

  if (!org) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(org.Media);
}
