import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import NextLink from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ orgId: string }>;
};

export default async function Page({ params }: Props) {
  const { orgId } = await params;
  const t = await getTranslations("Layouts");

  const layouts = await prisma.layout.findMany({
    where: {
      orgId,
    },
    include: {
      Timeframe: true,
    },
  });

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-row justify-end gap-2 items-center container mx-auto px-8">
        <Link
          href={`/${orgId}/layouts/create`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
          title={t("createLayout")}
        >
          <Plus className="size-4" />
        </Link>
      </div>
      <div className="h-full overflow-y-auto">
        <div className="w-full grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container gap-4 px-8 mx-auto">
          {layouts.map((layout) => (
            <Card key={layout.id}>
              <CardHeader>
                <Link
                  href={`/${orgId}/layouts/${layout.id}`}
                  title={layout.name}
                  className="font-bold hover:underline"
                >
                  {layout.name}
                </Link>
                <NextLink
                  href={`/preview/${layout.id}`}
                  title={t("preview")}
                  className="hover:underline text-sm"
                >
                  {t("preview")}
                </NextLink>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/${orgId}/layouts/${layout.id}/timeframes`}
                  title={t("timeframes")}
                  className="hover:underline"
                >
                  {layout.Timeframe.length} Timeframes
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
