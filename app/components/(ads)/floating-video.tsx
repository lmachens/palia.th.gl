"use client";
import { getNitroAds } from "@/app/lib/nitro-pay";
import { useEffect } from "react";

export default function FloatingVideo() {
  useEffect(() => {
    getNitroAds().createAd("palia-video", {
      format: "video-nc",
      debug: "silent",
    });
  }, []);

  return <div id="palia-video" className="w-full h-56" />;
}
