import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const data = await auth.getSession();

  if (!data) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const orgs = await prisma.org.findMany();

  return NextResponse.json(orgs);
}
