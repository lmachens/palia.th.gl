"use client";
import { getNitroAds } from "@/lib/nitro-pay";
import { useEffect } from "react";

export default function WideSkyscraper({ id }: { id: string }) {
  useEffect(() => {
    getNitroAds().createAd(id, {
      refreshTime: 30,
      renderVisibleOnly: true,
      sizes: [["160", "600"]],
      mediaQuery: "(min-width: 768px)",
      debug: "silent",
    });
  }, []);

  return <div id={id} className="h-[600px] w-[160px] md:block hidden" />;
}
