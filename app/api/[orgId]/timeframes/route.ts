import { timeframe } from "@/app/[lng]/[orgId]/timeline/AddTimeframe";
import { displayExists, layoutExists, orgExists, prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ orgId: string }>;
};

export async function POST(
  req: NextRequest,
  { params }: Props,
): Promise<NextResponse> {
  const { orgId } = await params;
  if (!(await orgExists(orgId))) {
    return NextResponse.json(
      { message: "Organization does not exist" },
      { status: 400 },
    );
  }

  const body = await req.json();

  const check = timeframe.safeParse(body);

  if (!check.success) {
    return NextResponse.json({ message: "Invalid timeframe" }, { status: 400 });
  }

  if (!(await displayExists(check.data.displayId))) {
    return NextResponse.json(
      { message: "Display does not exist" },
      { status: 400 },
    );
  }

  if (!(await layoutExists(check.data.layoutId))) {
    return NextResponse.json(
      { message: "Layout does not exist" },
      { status: 400 },
    );
  }

  const newTimeframe = await prisma.timeframe.create({
    data: {
      start: dayjs(check.data.start).toDate(),
      end: dayjs(check.data.end).toDate(),
      layoutId: check.data.layoutId,
      displayId: check.data.displayId,
    },
  });

  return NextResponse.json(newTimeframe, { status: 201 });
}
