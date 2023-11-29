import { useDict } from "@/app/components/(i18n)/i18n-provider";
import PlayerMarker from "@/app/components/(map)/player-marker";
import { getMapFromActor, modHousingCoords } from "@/app/lib/maps";
import type { NODE, spawnNodes } from "@/app/lib/nodes";
import {
  sendActorsToPaliaAPI,
  sendWeeklyWantsToPaliaAPI,
} from "@/app/lib/palia-api";
import { spawnGroups } from "@/app/lib/spawn-groups";
import type {
  Actor,
  ActorValeriaCharacter,
  CurrentGiftPreferences,
  GameActor,
  ValeriaCharacter,
} from "@/app/lib/storage/game-info";
import { useGameInfoStore } from "@/app/lib/storage/game-info";
import { useMapStore } from "@/app/lib/storage/map";
import { useParamsStore } from "@/app/lib/storage/params";
import { useSettingsStore } from "@/app/lib/storage/settings";
import leaflet from "leaflet";
import { useEffect, useRef } from "react";
import useOtherPlayers from "./useOtherPlayers";

export default function Player() {
  const { map, mapName } = useMapStore();
  const mounted = useRef(false);
  const gameInfo = useGameInfoStore();
  const followPlayerPosition = useSettingsStore(
    (state) => state.followPlayerPosition
  );
  const marker = useRef<PlayerMarker | null>(null);
  const setParams = useParamsStore((state) => state.setParams);
  const dict = useDict();
  useOtherPlayers();

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    let lastMapName = mapName;

    overwolf.extensions.current.getExtraObject("palia", (result) => {
      if (!result.success) {
        console.error("failed to create object: ", result);
        return;
      }

      const plugin = result.object;
      console.log("Initialized plugin");
      let prevPlayer: ActorValeriaCharacter = {
        guid: "",
        name: "",
        skillLevels: [],
        giftHistory: [],
        address: 0,
        className: "",
        x: 0,
        y: 0,
        z: 0,
        r: 0,
      };
      let lastPlayerError = "";
      let lastActorsError = "";
      let lastCurrentGiftsError = "";
      let firstData = false;
      let lastPreferenceDataVersionNumber = 0;

      const getPlayer = () => {
        plugin.GetPlayer(
          (player: ActorValeriaCharacter) => {
            try {
              if (!firstData) {
                firstData = true;
                console.log("Got first data", JSON.stringify(player));
              }
              if (lastPlayerError) {
                lastPlayerError = "";
              }
              if (
                player.x !== prevPlayer.x ||
                player.y !== prevPlayer.y ||
                player.z !== prevPlayer.z ||
                player.r !== prevPlayer.r
              ) {
                prevPlayer = player;
                const mapName = getMapFromActor(player);
                if (mapName) {
                  const position =
                    mapName === "housing"
                      ? modHousingCoords(player)
                      : { x: player.x, y: player.y, z: player.z };
                  gameInfo.setPlayer({
                    className: player.className,
                    position: position,
                    rotation: player.r,
                    mapName: mapName,
                    giftHistory: player.giftHistory,
                    skillLevels: player.skillLevels,
                    guid: player.guid,
                    name: player.name,
                  });
                  if (mapName && mapName !== lastMapName) {
                    console.log(
                      `Entering new map: ${mapName} on ${player.x},${player.y}`
                    );
                    lastMapName = mapName;
                    setParams({
                      mapName,
                      dict,
                    });
                  }
                }
              }
            } catch (err) {
              // ignore
            }
            setTimeout(getPlayer, 50);
          },
          (err: string) => {
            if (err !== lastPlayerError) {
              lastPlayerError = err;
              firstData = false;
              console.error("Player Error: ", err);
            }
            setTimeout(getPlayer, 200);
          }
        );
      };

      const getActors = () => {
        plugin.GetActors(
          (actors: Actor[]) => {
            try {
              if (lastActorsError) {
                lastActorsError = "";
              }
              const villagers: GameActor[] = [];
              const otherPlayers: ValeriaCharacter[] = [];
              const foundSpawnNodes: NODE[] = [];
              actors.forEach((actor) => {
                const mapName = getMapFromActor(actor);
                if (!mapName) {
                  return;
                }
                const position =
                  mapName === "housing"
                    ? modHousingCoords(actor)
                    : { x: actor.x, y: actor.y, z: actor.z };
                const className = actor.className.split(" ")[0];
                const type = className.replace("+", "");
                const isStar = className.includes("+");
                if (type.startsWith("BP_Villager")) {
                  villagers.push({
                    className: actor.className,
                    position: position,
                    rotation: 0,
                    mapName: mapName,
                  });
                } else if (
                  type.startsWith("BP_ValeriaCharacter") &&
                  "guid" in actor
                ) {
                  if (actor.guid !== prevPlayer.guid) {
                    otherPlayers.push({
                      name: actor.name!,
                      guid: actor.guid!,
                      giftHistory: actor.giftHistory,
                      skillLevels: actor.skillLevels,
                      className: actor.className,
                      position: position,
                      rotation: actor.r,
                      mapName: mapName,
                    });
                  }
                } else if (
                  Object.values(spawnGroups).some((group) =>
                    group.some((id) => type.startsWith(id))
                  )
                ) {
                  foundSpawnNodes.push({
                    type: type as keyof typeof spawnNodes,
                    id: actor.address.toString(),
                    x: actor.x,
                    y: actor.y,
                    mapName: mapName,
                    isSpawnNode: true,
                    isStar,
                  });
                }
              });

              gameInfo.setVillagers(villagers);
              gameInfo.setOtherPlayers(otherPlayers);
              gameInfo.setSpawnNodes(foundSpawnNodes);

              sendActorsToPaliaAPI(actors);
            } catch (err) {
              // ignore
            }
            setTimeout(getActors, 100);
          },
          (err: string) => {
            if (err !== lastActorsError) {
              lastActorsError = err;
              firstData = false;
              console.error("Actors Error: ", err);
            }
            setTimeout(getActors, 500);
          }
        );
      };

      const getCurrentGiftPreferences = () => {
        plugin.GetCurrentGiftPreferences(
          (currentGiftPreferences: CurrentGiftPreferences) => {
            try {
              if (lastCurrentGiftsError) {
                lastCurrentGiftsError = "";
              }

              if (
                lastPreferenceDataVersionNumber !==
                currentGiftPreferences.preferenceDataVersionNumber
              ) {
                gameInfo.setCurrentGiftPreferences(currentGiftPreferences);
                lastPreferenceDataVersionNumber =
                  currentGiftPreferences.preferenceDataVersionNumber;
                sendWeeklyWantsToPaliaAPI(currentGiftPreferences);
              }
            } catch (err) {
              // ignore
            }
            setTimeout(getCurrentGiftPreferences, 10000);
          },
          (err: string) => {
            if (err !== lastCurrentGiftsError) {
              lastCurrentGiftsError = err;
              firstData = false;
              console.error("Current Gift Error: ", err);
            }
            setTimeout(getCurrentGiftPreferences, 60000);
          }
        );
      };

      getPlayer();
      setTimeout(getActors, 1000);
      setTimeout(getCurrentGiftPreferences, 10000);
    });
  }, []);

  useEffect(() => {
    if (!map || mapName !== gameInfo.player?.mapName) {
      return;
    }
    if (!marker.current) {
      const icon = leaflet.icon({
        iconUrl: "/icons/Icon_PlayerMarker.png",
        className: "player",
        iconSize: [36, 36],
      });
      marker.current = new PlayerMarker(
        [gameInfo.player.position.y, gameInfo.player.position.x],
        {
          icon,
          interactive: false,
        }
      );
      marker.current.rotation = gameInfo.player.rotation;
    } else {
      marker.current.updatePosition(gameInfo.player);
    }
    marker.current.addTo(map);

    return () => {
      marker.current?.remove();
      marker.current = null;
    };
  }, [map, mapName, gameInfo.player?.mapName]);

  const lastAnimation = useRef(0);

  useEffect(() => {
    if (
      !map ||
      !gameInfo.player ||
      !marker.current ||
      mapName !== gameInfo.player?.mapName
    ) {
      return;
    }

    marker.current.updatePosition(gameInfo.player);

    if (followPlayerPosition) {
      const now = Date.now();
      if (now - lastAnimation.current > 500) {
        lastAnimation.current = now;
        document.querySelector(".leaflet-map-pane")?.classList.add("animate");
        map.panTo([gameInfo.player.position.y, gameInfo.player.position.x], {
          animate: false,
          duration: 0,
          easeLinearity: 1,
          noMoveStart: true,
        });
      }
    }
  }, [gameInfo.player, followPlayerPosition]);

  return <></>;
}
