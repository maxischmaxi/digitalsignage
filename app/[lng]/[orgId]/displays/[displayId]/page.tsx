import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ orgId: string; displayId: string }>;
};

export default async function Page({ params }: Props) {
  const { orgId, displayId } = await params;

  const display = await prisma.display.findUnique({
    where: {
      id: displayId,
      orgId,
    },
    include: {
      Location: true,
    },
  });

  if (!display) {
    notFound();
  }

  return (
    <div className="container mx-auto px-8">
      <Card>
        <CardHeader>
          <CardTitle>{display.name}</CardTitle>
        </CardHeader>
        <CardContent>{display.Location.address}</CardContent>
      </Card>
    </div>
  );
}
