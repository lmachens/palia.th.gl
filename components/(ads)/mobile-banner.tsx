"use client";
import { getNitroAds } from "@/lib/nitro-pay";
import { useEffect } from "react";

export default function MobileBanner({ id }: { id: string }) {
  useEffect(() => {
    getNitroAds().createAd(id, {
      refreshTime: 30,
      renderVisibleOnly: false,
      sizes: [["320", "50"]],
      mediaQuery: "(min-width: 320px) and (max-width: 767px)",
      demo: process.env.VERCEL_ENV === "production" ? "false" : "true",
      debug: "silent",
    });
  }, []);

  return (
    <div
      id={id}
      className="md:hidden rounded h-[50px] bg-zinc-800/30 flex flex-col justify-center text-gray-400"
    >
      Loading Ad
    </div>
  );
}
