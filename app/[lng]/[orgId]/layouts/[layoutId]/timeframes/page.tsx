import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

type Props = {
  params: Promise<{ orgId: string; layoutId: string }>;
};

export default async function Page({ params }: Props) {
  const { orgId, layoutId } = await params;

  const timeframes = await prisma.timeframe.findMany({
    where: {
      Layout: {
        id: layoutId,
        orgId,
      },
    },
  });

  return (
    <div className="container mx-auto px-8">
      <ul>
        {timeframes.map((timeframe) => (
          <li key={timeframe.id}>
            <p>{dayjs(timeframe.start).format("DD.MM.YYYY HH:mm")}</p>
            <p>{dayjs(timeframe.end).format("DD.MM.YYYY HH:mm")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
