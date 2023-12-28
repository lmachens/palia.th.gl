"use client";
import { getNitroAds } from "@/lib/nitro-pay";
import { useEffect } from "react";

export default function FloatingOutstreamVideoPlayer({ id }: { id: string }) {
  useEffect(() => {
    getNitroAds().createAd(id, {
      format: "floating",
      floating: {
        reduceMobileSize: true,
      },
      mediaQuery: "(min-width: 320px) and (max-width: 767px)",
      demo:
        process.env.NEXT_PUBLIC_NITRO_PAY_DEMO === "true" ? "false" : "true",
      debug: "silent",
    });
  }, []);

  return <></>;
}
