import { prisma } from "@/lib/prisma";
import { Permission, Plan } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ success: true });
  }

  const org = await prisma.org.create({
    data: {
      name: "TestOrg",
      icon: "House",
      Plan: Plan.ENTERPRISE,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "max@jeschek.dev",
      currentOrg: org.id,
    },
  });

  await prisma.usersOnOrgs.create({
    data: {
      orgId: org.id,
      userId: user.id,
      assignedBy: user.id,
    },
  });

  await prisma.orgPermission.create({
    data: {
      orgId: org.id,
      userId: user.id,
      permissions: Object.values(Permission),
    },
  });

  const location = await prisma.location.create({
    data: {
      name: "test",
      orgId: org.id,
      zip: "12345",
      city: "TestCity",
      address: "TestStreet",
      state: "TestState",
      description: "TestDescription",
    },
  });

  await prisma.display.create({
    data: {
      orgId: org.id,
      name: "TestDisplay",
      locationId: location.id,
    },
  });

  return NextResponse.json({ success: true });
}
