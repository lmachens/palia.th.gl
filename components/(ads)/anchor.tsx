"use client";
import { getNitroAds } from "@/lib/nitro-pay";
import { useEffect } from "react";

export default function Anchor({ id }: { id: string }) {
  useEffect(() => {
    getNitroAds().createAd(id, {
      refreshTime: 30,
      format: "anchor",
      anchor: "bottom",
      anchorPersistClose: false,
      anchorBgColor: "none",
      mediaQuery: "(min-width: 320px)",
      demo:
        process.env.NEXT_PUBLIC_NITRO_PAY_DEMO === "true" ? "true" : "false",
      debug: "silent",
    });
  }, []);

  return <></>;
}
