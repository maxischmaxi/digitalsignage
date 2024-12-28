import { auth } from "@/lib/auth";
import { findUserByEmail, findUserPermission, prisma } from "@/lib/prisma";
import { Permission } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

type Props = {
  params: Promise<{ orgId: string; id: string }>;
};

export async function DELETE(
  _: NextRequest,
  { params }: Props,
): Promise<NextResponse> {
  const { orgId, id } = await params;

  const data = await auth.getSession();

  if (!data?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await findUserByEmail(data.user.email);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const permission = await findUserPermission({ userId: user.id, orgId });

  if (!permission) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!permission.permissions.includes(Permission.DELETE_MEDIA)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const utApi = new UTApi();
    await utApi.deleteFiles(id);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete file" },
      { status: 500 },
    );
  }

  await prisma.media.delete({
    where: {
      orgId,
      id,
    },
  });

  return NextResponse.json({ message: "Deleted" });
}
