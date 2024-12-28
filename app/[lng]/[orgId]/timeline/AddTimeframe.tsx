"use client";
import { useSetDayjsLocale } from "@/hooks/use-set-dayjs-locale";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Display } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTimeframe } from "@/hooks/use-create-timeframe";
import { DatePicker } from "@/components/date-picker";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export const timeframe = z.object({
  start: z.number(),
  end: z.number(),
  displayId: z.string(),
  layoutId: z.string(),
});

type Props = {
  display: Display;
};

export function AddTimeframe(props: Props) {
  const { display } = props;
  useSetDayjsLocale();
  const t = useTranslations("Timeline");

  const form = useForm<z.infer<typeof timeframe>>({
    resolver: zodResolver(timeframe),
  });

  const create = useCreateTimeframe();

  async function onSubmit(data: z.infer<typeof timeframe>) {
    await create.mutateAsync(data);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="p-4 flex flex-col gap-4"
    >
      <input type="hidden" {...form.register("displayId")} value={display.id} />
      <DatePicker
        className="w-full"
        label={t("start")}
        control={form.control}
        name="start"
      />
      <DatePicker
        className="w-full"
        label={t("end")}
        control={form.control}
        name="end"
      />
      <div className="w-full flex justify-end">
        <Button type="submit">{t("create")}</Button>
      </div>
    </form>
  );
}
