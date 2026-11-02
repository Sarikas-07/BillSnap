import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-gradient-to-r from-bg-alt via-white to-bg-alt bg-[length:200%_100%]", className)}
      {...props}
    />
  );
}

export { Skeleton };
