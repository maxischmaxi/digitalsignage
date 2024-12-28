import { Location, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUserPermission({
  userId,
  orgId,
}: {
  userId: string;
  orgId: string;
}) {
  return prisma.orgPermission.findFirst({
    where: {
      userId,
      orgId,
    },
  });
}

export async function checkIfUserIsInOrg({
  userId,
  orgId,
}: {
  userId: string;
  orgId: string;
}) {
  const data = await prisma.usersOnOrgs.findFirst({
    where: {
      orgId,
      userId,
    },
  });

  return Boolean(data);
}

export async function findAllLocations({
  orgId,
  userId,
}: {
  orgId: string;
  userId: string;
}): Promise<Location[] | null> {
  const isInOrg = await checkIfUserIsInOrg({
    userId,
    orgId,
  });

  if (!isInOrg) {
    return null;
  }

  return await prisma.location.findMany({
    where: {
      orgId,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function displayExists(id: string): Promise<boolean> {
  const display = await prisma.display.findUnique({
    where: {
      id,
    },
  });

  return Boolean(display);
}

export async function layoutExists(id: string): Promise<boolean> {
  const layout = await prisma.layout.findUnique({
    where: {
      id,
    },
  });

  return Boolean(layout);
}

export async function orgExists(id: string): Promise<boolean> {
  const org = await prisma.org.findUnique({
    where: {
      id,
    },
  });

  return Boolean(org);
}
