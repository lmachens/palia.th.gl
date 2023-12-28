"use client";
import { getNitroAds } from "@/lib/nitro-pay";
import { useEffect } from "react";

export default function NitroPayVideoPlayer({ id }: { id: string }) {
  useEffect(() => {
    getNitroAds().createAd(id, {
      format: "video-nc",
      video: {
        mobile: "compact",
      },
      mediaQuery: "(min-width: 768px)",
      debug: "silent",
    });
  }, []);

  return <div id={id} className="max-w-[400px]" />;
}
