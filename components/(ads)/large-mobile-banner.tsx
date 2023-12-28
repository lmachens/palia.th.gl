"use client";
import { getNitroAds } from "@/lib/nitro-pay";
import { useEffect } from "react";

export default function LargeMobileBanner({ id }: { id: string }) {
  useEffect(() => {
    getNitroAds().createAd(id, {
      refreshTime: 30,
      renderVisibleOnly: false,
      sizes: [["320", "100"]],
      mediaQuery: "(min-width: 320px) and (max-width: 767px)",
      demo: process.env.NEXT_PUBLIC_NITRO_PAY_DEMO === "true",
      debug: "silent",
    });
  }, []);

  return (
    <div
      id={id}
      className="md:hidden rounded h-[100px] bg-zinc-800/30 flex flex-col justify-center text-gray-400"
    >
      Loading Ad
    </div>
  );
}
