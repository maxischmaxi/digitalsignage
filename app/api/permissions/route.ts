import { auth } from "@/lib/auth";
import { debug } from "@/lib/debug";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const data = await auth.getSession();

    if (!data) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (typeof data.user.email !== "string") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    debug(data);

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: data.user.email,
      },
    });

    debug(user);

    return NextResponse.json(user.permissions);
  } catch (error) {
    debug(error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
