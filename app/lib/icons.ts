import { spawnNodes } from "./nodes";
import { spawnGroups } from "./spawn-groups";
import { spawnIcons } from "./spawn-icons";

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
} as const;

export const SPAWN_ICONS = Object.keys(spawnNodes).reduce((acc, type) => {
  Object.entries(spawnGroups).find(([groupName, group]) => {
    if (group.includes(type)) {
      const spawnIcon = spawnIcons[type as keyof typeof spawnIcons];
      if (spawnIcon) {
        acc[type] = {
          src: `/icons/spawn/${spawnIcon}.webp`,
          radius: 10,
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
    }
    return false;
  });
  return acc;
}, {} as Record<string, { color: string; lineWidth: number; path: string; radius: number } | { src: string; radius: number }>);

export type ICON =
  | (typeof ICONS)[keyof typeof ICONS]
  | (typeof SPAWN_ICONS)[keyof typeof SPAWN_ICONS];
