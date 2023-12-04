import { useGameInfoStore } from "@/lib/storage/game-info";
import { promisifyOverwolf } from "@/lib/wrapper";
import { useEffect, useRef } from "react";
import { useDict } from "../(i18n)/i18n-provider";

export default function DiscordRPC() {
  const mounted = useRef(false);
  const player = useGameInfoStore((state) => state.player);
  const discordRPCPlugin = useRef<any>(null);
  const dict = useDict();

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    promisifyOverwolf(overwolf.extensions.current.getExtraObject)(
      "discord"
    ).then((result) => {
      if (!result.success) {
        console.error("failed to create object: ", result);
        return;
      }

      discordRPCPlugin.current = result.object;
      discordRPCPlugin.current.initialize("1176153275918204928", 3, () => {
        console.log("Initialized DiscordRPC plugin");
      });

      discordRPCPlugin.current.onLogLine.addListener((message: any) => {
        console.log(`DISCORD RPC - ${message.level} - ${message.message}`);

        if (message.message == "Failed to connect for some reason.") {
          console.log(
            "Shutting down Discord RPC because of too many connections errors"
          );
          discordRPCPlugin.current.dispose();
        }

        if (
          message.message ==
          "We have been told to terminate by discord: (4000) Invalid Client ID"
        ) {
          console.log(
            "Shutting down Discord RPC because of too many connections errors"
          );
          discordRPCPlugin.current.dispose();
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
    const details = `${player.name} | ${mapTitle} | ${dict.leaderboard.level} ${level}`;
    discordRPCPlugin.current.updatePresence(
      "Playing Palia",
      details,
      "palia",
      "Palia",
      "palia-map",
      "Palia Map App",
      true,
      0,
      "Open Map",
      "https://palia.th.gl/",
      "",
      "",
      () => null
    );
  }, [player?.mapName, level]);

  return <></>;
}
