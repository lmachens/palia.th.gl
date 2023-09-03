export const VIEWBOX = "0 0 100 100";
const CIRCLE_PATH =
  "M43 .44C85.9-5.06 115.91 42 91.64 78A50.02 50.02 0 0 1 78 91.64c-6.54 4.41-13.25 6.71-21 7.92-5.55.87-11.52.55-17-.56-40.84-8.33-53.92-59.51-23-86.82C25.02 5.1 32.71 2.34 43 .44Z";

export const ICONS = {
  waterFlower: {
    color: "#3F51B5",
    lineWidth: 2,
    path: CIRCLE_PATH,
    radius: 8,
  },
  wildGarlic: {
    color: "#4CAF50",
    lineWidth: 2,
    path: CIRCLE_PATH,
    radius: 8,
  },
  sundropLillies: {
    color: "#FFC107",
    lineWidth: 1,
    path: CIRCLE_PATH,
    radius: 8,
  },
  location: {
    src: "/icons/Icon_Map_Marker.png",
    radius: 12,
  },
  recipe: {
    color: "#abcdef",
    lineWidth: 2,
    path: CIRCLE_PATH,
    radius: 7,
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
} as const;
export type ICON = (typeof ICONS)[keyof typeof ICONS];
