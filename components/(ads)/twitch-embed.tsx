"use client";
import Script from "next/script";
import { useState } from "react";
import { trackEvent } from "../plausible-tracker";

declare global {
  interface Window {
    Twitch: any;
  }
}

const CHANNEL = "thehiddengaminglair";
export default function TwitchEmbed() {
  const [closed, setClosed] = useState(false);

  const handleLoad = () => {
    const twitchEmbed = new window.Twitch.Player("player", {
      channel: CHANNEL,
      width: 320,
      height: 180,
      muted: true,
      autoplay: true,
      showMature: false,
      quality: "160p30",
      controls: false,
    });

    twitchEmbed.addEventListener(window.Twitch.Player.ONLINE, () => {
      trackEvent("Ad Fallback: Twitch", {
        props: { url: `https://www.twitch.tv/${CHANNEL}` },
      });
    });
  };

  if (closed) {
    return <></>;
  }
  return (
    <div className="relative">
      <Script
        src="https://embed.twitch.tv/embed/v1.js"
        async
        onLoad={handleLoad}
        onError={() => setClosed(true)}
      />
      <div id="player" className="twitch-embed">
        <div className="twitch-embed-close absolute top-0 left-0 right-0 z-10 transition-all flex justify-between items-center px-2 py-1 bg-black bg-opacity-50 text-white text-sm">
          <span>
            Watching{" "}
            <a
              className="text-orange-400 hover:underline font-bold"
              href="https://www.twitch.tv/thehiddengaminglair?tt_content=channel_name&tt_medium=embed"
              target="_blank"
            >
              The Hidden Gaming Lair
            </a>
          </span>
          <button
            onClick={() => setClosed(true)}
            className="text-neutral-200 hover:text-white"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}
