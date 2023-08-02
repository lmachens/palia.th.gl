import Script from "next/script";
import { trackEvent } from "./plausible-tracker";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: any;
      PlayerState: any;
    };
    Twitch: any;
  }
}

const CHANNEL = "thehiddengaminglair";
export default function TwitchEmbed({ onClose }: { onClose: () => void }) {
  const handleLoad = () => {
    const twitchEmbed = new window.Twitch.Embed("player", {
      width: "100%",
      height: "100%",
      channel: CHANNEL,
      layout: "video",
      autoplay: true,
      muted: true,
      parent: ["diablo4.th.gl"],
    });

    twitchEmbed.addEventListener(window.Twitch.Player.ONLINE, () => {
      trackEvent("Ad Fallback: Twitch", {
        props: { url: `https://www.twitch.tv/${CHANNEL}` },
      });
    });
  };

  return (
    <>
      <Script
        src="https://embed.twitch.tv/embed/v1.js"
        async
        onLoad={handleLoad}
        onError={onClose}
      />
      <div onClick={onClose} className="twitch-embed-close">
        X
      </div>
      <div id="player" className="twitch-embed" />
    </>
  );
}
