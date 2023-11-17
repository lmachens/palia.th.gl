import { isOverwolfApp } from "../lib/env";
import { cn } from "../lib/utils";

export default function Drawer({
  children,
  show,
  ...props
}: {
  children: React.ReactNode;
  show: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <aside
      className={cn(
        `drawer fixed top-[50px] z-[500] w-[401px] max-w-full transition-all duration-500 bg-neutral-900 shadow-lg`,
        show ? "left-0" : "left-[-402px]",
        isOverwolfApp ? "h-full" : " h-[calc(100%-50px)]"
      )}
      {...props}
    >
      {children}
    </aside>
  );
}
