"use client";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import Anchor from "./(ads)/anchor";
import FloatingOutstreamVideoPlayer from "./(ads)/floating-outstream-video-player";
import NitroAds from "./(ads)/nitro-ads";
import NitroPayVideoPlayer from "./(ads)/nitropay-video-player";
import TwitchEmbed from "./(ads)/twitch-embed";

export default function Footer() {
  const params = useParams();
  const show =
    params.map === "download" ||
    params.map === "leaderboard" ||
    params.map === "rummage-pile" ||
    params.map === "winterfest-challenge";
  return (
    <footer
      className={cn(
        "w-full border-t bg-gradient-to-b px-6 py-4 border-neutral-800 bg-zinc-800/30 text-gray-300 from-inherit",
        !show && "fixed z-[11000] bottom-[-100%]"
      )}
    >
      <div className="block text-center">
        <p>&copy; {new Date().getFullYear()} The Hidden Gaming Lair</p>
        <p className="text-xs text-gray-400">
          This is a fan-site; all assets and intellectual property related to
          Palia are reserved by Singularity 6.
        </p>
      </div>
      <div className="fixed z-[11001] bottom-[-100%]">
        <NitroAds fallback={<TwitchEmbed />}>
          <NitroPayVideoPlayer id="palia-video-player" />
          <FloatingOutstreamVideoPlayer id="palia-floating-outstream-video-player" />
          <Anchor id="palia-anchor" />
        </NitroAds>
      </div>
    </footer>
  );
}
