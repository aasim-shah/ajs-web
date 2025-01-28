import { cn } from "@/lib/utils";
import React from "react";

const Tag = ({
  value,
  filled = false,
  className = "",
}: {
  value: string;
  filled?: boolean;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-sm font-medium capitalize rounded-full px-2 py-1",
        filled ? "text-signature bg-signature/20" : "border border-foreground",
        className
      )}
    >
      {value}
    </p>
  );
};

export default Tag;
