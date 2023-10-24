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
      className={`drawer fixed top-0 z-[500] w-[401px] max-w-full h-full transition-all duration-500 bg-neutral-900 shadow-lg ${
        show ? "left-0" : "left-[-402px]"
      }`}
      {...props}
    >
      {children}
    </aside>
  );
}
