import type { ReactNode } from "react";
import { trackOutboundLinkClick } from "./plausible-tracker";

export default function ExternalLink({
  href,
  text,
  className,
  ...props
}: {
  href: string;
  text: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      key={href}
      href={href}
      target="_blank"
      className={`flex items-center gap-1 text-gray-300 hover:text-white ${
        className ?? ""
      }`}
      onClick={() => {
        trackOutboundLinkClick(href);
      }}
      {...props}
    >
      {text}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6"></path>
        <path d="M11 13l9 -9"></path>
        <path d="M15 4h5v5"></path>
      </svg>
    </a>
  );
}
