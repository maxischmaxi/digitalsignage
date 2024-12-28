import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ orgId: string }>;
};

export default async function Page({ params }: Props) {
  const { orgId } = await params;

  const displays = await prisma.display.findMany({
    where: {
      orgId,
    },
    include: {
      Location: true,
    },
  });

  return (
    <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {displays.map((display) => (
        <Card key={display.id}>
          <CardHeader>
            <Link
              href={`/${orgId}/displays/${display.id}`}
              title={display.name}
              className="font-bold hover:underline"
            >
              {display.name}
            </Link>
          </CardHeader>
          <CardContent>{display.Location.address}</CardContent>
        </Card>
      ))}
    </div>
  );
}
