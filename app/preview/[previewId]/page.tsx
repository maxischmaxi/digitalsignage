import { prisma } from "@/lib/prisma";
import { LayoutType } from "@prisma/client";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { LayoutPreview } from "../LayoutPreview";

type Props = {
  params: Promise<{ previewId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { previewId } = await params;
  const t = await getTranslations("Layouts");
  const layout = await prisma.layout.findUnique({
    where: {
      id: previewId,
    },
  });

  if (!layout) {
    return {
      title: t("layoutNotFound"),
      description: t("layoutNotFoundDescription"),
    };
  }

  return {
    title: layout.name,
    description: t("layoutDescription", { name: layout.name }),
  };
}

export default async function Page({ params }: Props) {
  const { previewId } = await params;

  const layout = await prisma.layout.findUnique({
    where: {
      id: previewId,
    },
  });

  if (!layout) {
    notFound();
  }

  if (layout.type === LayoutType.CANVAS) {
    return <LayoutPreview layout={layout} />;
  }

  return <h1>Not Supported yet</h1>;
}
