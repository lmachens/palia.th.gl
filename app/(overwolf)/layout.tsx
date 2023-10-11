import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PlausibleTracker from "../components/plausible-tracker";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

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
        className={`${inter.className} h-screen text-white antialiased select-none overflow-hidden`}
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
