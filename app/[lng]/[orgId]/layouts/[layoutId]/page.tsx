import { LayoutEditor } from "./LayoutEditor";

type Props = {
  params: Promise<{ orgId: string; layoutId: string }>;
};

export default async function Page({ params }: Props) {
  const { layoutId } = await params;

  return <LayoutEditor layoutId={layoutId} />;
}
