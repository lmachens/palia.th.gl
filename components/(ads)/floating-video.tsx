"use client";
import { getNitroAds } from "@/lib/nitro-pay";
import { useEffect } from "react";

export default function FloatingVideo() {
  useEffect(() => {
    getNitroAds().createAd("palia-video", {
      format: "video-nc",
      debug: "silent",
    });
  }, []);

  return <div id="palia-video" className="max-w-[400px]" />;
}
