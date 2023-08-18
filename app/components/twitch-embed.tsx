import Script from "next/script";
import { trackEvent } from "./plausible-tracker";

declare global {
  interface Window {
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
      parent: ["palia.th.gl"],
      quality: "160p30",
    });

    twitchEmbed.addEventListener(window.Twitch.Player.ONLINE, () => {
      trackEvent("Ad Fallback: Twitch", {
        props: { url: `https://www.twitch.tv/${CHANNEL}` },
      });
    });

    const REFRESH_INTERVAL = 1000 * 60;
    let lastUpdate = Date.now();
    let timeout = setTimeout(refreshTwitchEmbed, REFRESH_INTERVAL);
    function refreshTwitchEmbed() {
      lastUpdate = Date.now();
      if (
        !(
          twitchEmbed.getPlayerState()?.playback === "Playing" &&
          twitchEmbed.getDuration() === 0
        )
      ) {
        twitchEmbed.setChannel(
          [...twitchEmbed.getChannel()]
            ?.map((char) =>
              char === char.toUpperCase()
                ? char.toLowerCase()
                : char.toUpperCase()
            )
            .join("")
        );
      }
      timeout = setTimeout(refreshTwitchEmbed, REFRESH_INTERVAL);
    }

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        const timeLeft = REFRESH_INTERVAL - (Date.now() - lastUpdate);
        if (timeLeft < 0) {
          refreshTwitchEmbed();
        } else {
          timeout = setTimeout(refreshTwitchEmbed, timeLeft);
        }
      } else {
        clearTimeout(timeout);
      }
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
