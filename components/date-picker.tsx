import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
  wrapperClassName?: string;
};

export function DatePicker<T extends FieldValues>(props: Props<T>) {
  const { label, className, wrapperClassName, control, name } = props;
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("flex flex-col gap-1 w-full", wrapperClassName)}>
          {label && (
            <label className="text-xs" htmlFor={name}>
              {label}
            </label>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                id={name}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                  className,
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  dayjs(field.value).format("DD.MM.YYYY")
                ) : (
                  <span>{t("pickADate")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(value) => {
                  if (value) {
                    field.onChange(dayjs(value).unix());
                  } else {
                    field.onChange(undefined);
                  }
                  setOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {error && (
            <span className="text-xs text-red-500">{error.message}</span>
          )}
        </div>
      )}
    />
  );
}
