import PlausibleTracker from "@/components/plausible-tracker";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export function generateMetadata(): Metadata {
  return {
    title: {
      default: "Palia Map",
      template: "%s | Palia Map",
    },
    twitter: {},
    openGraph: {},
  };
}

function OverwolfLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body
        className={cn(
          "font-sans dark min-h-dscreen bg-transparent text-white antialiased select-none relative flex flex-col overflow-hidden",
          fontSans.variable
        )}
      >
        {children}
        <PlausibleTracker
          domain={process.env.NEXT_PUBLIC_PLAUSIBLE_OVERWOLF_DOMAIN}
          apiHost={process.env.NEXT_PUBLIC_PLAUSIBLE_API_HOST}
        />
      </body>
    </html>
  );
}

export default OverwolfLayout;
