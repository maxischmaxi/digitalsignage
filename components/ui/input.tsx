import * as React from "react";

import { cn } from "@/lib/utils";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Label } from "./label";

type Props<T extends FieldValues> = {
  label?: string | React.ReactNode;
  control: Control<T>;
  name: Path<T>;
  wrapperClassName?: string;
} & React.ComponentPropsWithRef<"input">;

export function Input<T extends FieldValues>(props: Props<T>) {
  const {
    label,
    className,
    control,
    wrapperClassName,
    type,
    name,
    ref,
    ...rest
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div
          className={cn(
            "flex flex-col flex-nowrap w-full gap-1",
            wrapperClassName,
          )}
        >
          {typeof label === "string" && (
            <Label htmlFor={name}>{props.label}</Label>
          )}
          {Boolean(label) && typeof label !== "string" && label}
          <input
            {...rest}
            value={field.value}
            onChange={field.onChange}
            type={type}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className,
            )}
            ref={ref}
            id={name}
          />
        </div>
      )}
    />
  );
}
