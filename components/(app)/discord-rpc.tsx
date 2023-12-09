import type { DiscordRPCPlugin } from "@/lib/discord-rpc";
import { loadDiscordRPCPlugin } from "@/lib/discord-rpc";
import { useGameInfoStore } from "@/lib/storage/game-info";
import { promisifyOverwolf } from "@/lib/wrapper";
import { useEffect, useRef } from "react";
import { useDict } from "../(i18n)/i18n-provider";

export default function DiscordRPC() {
  const player = useGameInfoStore((state) => state.player);
  const dict = useDict();

  const discordRPCPlugin = useRef<DiscordRPCPlugin | null>(null);
  useEffect(() => {
    if (discordRPCPlugin.current) return;

    loadDiscordRPCPlugin("1181323945866178560").then((result) => {
      discordRPCPlugin.current = result;
      discordRPCPlugin.current.onLogLine.addListener((message) => {
        console.log(`DISCORD RPC - ${message.level} - ${message.message}`);

        if (message.message == "Failed to connect for some reason.") {
          console.log(
            "Shutting down Discord RPC because of too many connections errors"
          );
          discordRPCPlugin.current = null;
          promisifyOverwolf(result.dispose)();
        }

        if (
          message.message ==
          "We have been told to terminate by discord: (4000) Invalid Client ID"
        ) {
          console.log(
            "Shutting down Discord RPC because of too many connections errors"
          );
          discordRPCPlugin.current = null;
          promisifyOverwolf(result.dispose)();
        }
      });
    });
  }, []);

  const level = player?.skillLevels.reduce(
    (acc, cur) => acc + (cur.level - 1),
    1
  );

  useEffect(() => {
    if (!discordRPCPlugin.current || !player?.mapName || !level) {
      return;
    }
    const mapTitle = dict.maps[player.mapName] as string;
    discordRPCPlugin.current.updatePresence(
      `${player.name} | ${dict.leaderboard.level} ${level}`,
      mapTitle,
      "palia",
      "Palia",
      "thgl",
      "Palia Map・The Hidden Gaming Lair",
      true,
      0,
      "Open Palia Map",
      "https://palia.th.gl/",
      "",
      "",
      () => null
    );
  }, [player?.mapName, level]);

  return <></>;
}
