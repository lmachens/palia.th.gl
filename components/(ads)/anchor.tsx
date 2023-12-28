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
      demo: process.env.NODE_ENV === "development" ? "true" : "false",
      debug: "silent",
    });
  }, []);

  return <></>;
}
