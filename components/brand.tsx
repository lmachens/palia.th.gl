import { cn } from "@/lib/utils";

export default function Brand() {
  return (
    <p
      className={cn(
        "text-lg md:text-2xl md:leading-6 font-extrabold tracking-tight whitespace-nowrap"
      )}
    >
      PALIA<span className={cn("text-xs text-gray-400")}>.TH.GL</span>
    </p>
  );
}
