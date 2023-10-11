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
      controls: false,
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
    <div className="relative">
      <Script
        src="https://embed.twitch.tv/embed/v1.js"
        async
        onLoad={handleLoad}
        onError={onClose}
      />
      <div id="player" className="twitch-embed">
        <div
          onClick={onClose}
          className="twitch-embed-close absolute top-0 left-0 right-0 z-10 opacity-0 transition-all flex justify-between items-center px-2 py-1 bg-black bg-opacity-50 text-white text-sm"
        >
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
          <button className="text-neutral-200 hover:text-white">X</button>
        </div>
      </div>
    </div>
  );
}
