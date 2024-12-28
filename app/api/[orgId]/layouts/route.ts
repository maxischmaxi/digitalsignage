import { auth } from "@/lib/auth";
import {
  checkIfUserIsInOrg,
  findUserByEmail,
  orgExists,
  prisma,
} from "@/lib/prisma";
import { Layout, LayoutType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ orgId: string }>;
};

export async function GET(
  _: NextRequest,
  { params }: Props,
): Promise<NextResponse> {
  const { orgId } = await params;

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

  if (
    !(await checkIfUserIsInOrg({
      userId: user.id,
      orgId,
    }))
  ) {
    return NextResponse.json(
      { message: "User is not in org" },
      { status: 401 },
    );
  }

  const layouts = await prisma.layout.findMany({
    where: {
      orgId,
    },
  });

  return NextResponse.json(layouts, { status: 200 });
}

export async function POST(
  req: NextRequest,
  { params }: Props,
): Promise<NextResponse> {
  const { orgId } = await params;

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

  if (
    !(await checkIfUserIsInOrg({
      userId: user.id,
      orgId,
    }))
  ) {
    return NextResponse.json(
      { message: "User is not in org" },
      { status: 401 },
    );
  }

  const { layoutId, version, objects } = (await req.json()) as {
    layoutId: string | undefined;
    version: string;
    objects: fabric.Object[];
  };

  let layout: Layout;

  if (!layoutId) {
    layout = await prisma.layout.create({
      data: {
        type: LayoutType.CANVAS,
        data: JSON.stringify({ version, objects }),
        name: "New Layout",
        orgId,
      },
    });
  } else {
    layout = await prisma.layout.update({
      where: {
        id: layoutId,
      },
      data: {
        data: JSON.stringify({ version, objects }),
      },
    });
  }

  return NextResponse.json(layout, { status: 200 });
}
