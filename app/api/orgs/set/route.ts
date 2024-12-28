import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    const id = body.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    const org = await prisma.org.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const data = await auth.getSession();

    if (!data) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!data.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: {
        email: data.user.email,
      },
      data: {
        currentOrg: org.id,
      },
    });

    return NextResponse.json(org);
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
