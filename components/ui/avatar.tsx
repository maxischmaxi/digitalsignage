"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

type AvatarProps = React.ComponentPropsWithRef<typeof AvatarPrimitive.Root>;

function Avatar(props: AvatarProps) {
  const { className, ...rest } = props;

  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...rest}
    />
  );
}

type AvatarImageProps = React.ComponentPropsWithRef<
  typeof AvatarPrimitive.Image
>;

function AvatarImage(props: AvatarImageProps) {
  const { className, ...rest } = props;

  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square h-full w-full", className)}
      {...rest}
    />
  );
}

type AvatarFallbackProps = React.ComponentPropsWithRef<
  typeof AvatarPrimitive.Fallback
>;

function AvatarFallback(props: AvatarFallbackProps) {
  const { className, ...rest } = props;

  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...rest}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
