import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function FormActions({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}
