"use client";
import { getNitroAds } from "@/lib/nitro-pay";
import { useEffect } from "react";

export default function WideSkyscraper({ id }: { id: string }) {
  useEffect(() => {
    getNitroAds().createAd(id, {
      refreshTime: 30,
      renderVisibleOnly: false,
      sizes: [["160", "600"]],
      mediaQuery: "(min-width: 768px)",
      demo:
        process.env.NEXT_PUBLIC_NITRO_PAY_DEMO === "true" ? "true" : "false",
      debug: "silent",
    });
  }, []);

  return (
    <div
      id={id}
      className="md:flex hidden bg-zinc-800/30 text-gray-400 flex-col justify-center text-center"
    >
      Loading Ad
    </div>
  );
}
