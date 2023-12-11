import { spawnGroups } from "./spawn-groups";
import { spawnIcons } from "./spawn-icons";
import { villagers } from "./villagers";

export const VIEWBOX = "0 0 100 100";
export const CIRCLE_PATH =
  "M43 .44C85.9-5.06 115.91 42 91.64 78A50.02 50.02 0 0 1 78 91.64c-6.54 4.41-13.25 6.71-21 7.92-5.55.87-11.52.55-17-.56-40.84-8.33-53.92-59.51-23-86.82C25.02 5.1 32.71 2.34 43 .44Z";

export const ICONS = {
  location: {
    src: "/icons/Icon_Map_Marker.png",
    radius: 12,
  },
  area: {
    src: "/icons/area.png",
    color: "#fff",
    radius: 14,
    isText: true,
  },
  landmark: {
    src: "/icons/Icon_Landmark_01.png",
    radius: 14,
  },
  stable: {
    src: "/icons/Icon_Compass_Stable_01.png",
    radius: 14,
  },
  housingPlot: {
    src: "/icons/Icon_Compass_Home_01.png",
    radius: 14,
  },
  zone: {
    src: "/icons/WT_Icon_Compass_Zone.png",
    radius: 14,
  },
  wardrobe: {
    src: "/icons/WT_Icon_Wardrobe.png",
    radius: 14,
  },
  villager: {
    src: "/icons/T_Compass_Villager.png",
    radius: 14,
  },
  otherPlayer: {
    src: "/icons/Icon_PlayerMarker.png",
    radius: 14,
  },
  rummagePile: {
    src: "/icons/WT_Backer_Map_Marker_White.png",
    radius: 14,
  },
  winterlightsChest: {
    src: "/icons/WT_Icon_Chest_Treasure_Winterlights.png",
    radius: 14,
  },
} as const;

export const SPAWN_ICONS = Object.entries(spawnGroups).reduce(
  (acc, [groupName, group]) => {
    group.forEach((type) => {
      const spawnIcon = spawnIcons[type as keyof typeof spawnIcons];
      if (spawnIcon) {
        let radius = 10;
        if (type.includes("Sapling")) {
          radius = 7;
        } else if (type.includes("Small")) {
          radius = 8;
        } else if (type.includes("Medium")) {
          radius = 10;
        } else if (type.includes("Large")) {
          radius = 13;
        }
        acc[type] = {
          src: `/icons/spawn/${spawnIcon}.webp`,
          radius,
        };
      } else {
        acc[type] = {
          src: `/icons/spawn/Icon_ResourceTracker_${groupName[0].toUpperCase()}${groupName.slice(
            1
          )}.webp`,
          radius: 10,
        };
      }
      return true;
    });
    return acc;
  },
  {} as Record<string, { src: string; radius: number }>
);

export const VILLAGER_ICONS = villagers.reduce((acc, villager) => {
  acc[villager.className] = {
    src: `/icons/Icons_Characters/${villager.icon}.webp`,
    name: villager.name,
    radius: 14,
  };
  return acc;
}, {} as Record<string, { src: string; name: string; radius: number }>);

export type ICON =
  | (typeof ICONS)[keyof typeof ICONS]
  | (typeof SPAWN_ICONS)[keyof typeof SPAWN_ICONS];
