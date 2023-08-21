export const VIEWBOX = "0 0 100 100";
const CIRCLE_PATH =
  "M43 .44C85.9-5.06 115.91 42 91.64 78A50.02 50.02 0 0 1 78 91.64c-6.54 4.41-13.25 6.71-21 7.92-5.55.87-11.52.55-17-.56-40.84-8.33-53.92-59.51-23-86.82C25.02 5.1 32.71 2.34 43 .44Z";

export const ICONS = {
  copper: {
    color: "#abcdef",
    lineWidth: 2,
    path: CIRCLE_PATH,
    radius: 8,
  },
  // copper: {
  //   color: "#ded3bd",
  //   attribute: (attribute: string) => {
  //     switch (attribute) {
  //       case "Dexterity":
  //         return "#FFC107";
  //       case "Strength":
  //         return "#FF5722";
  //       case "Obol_Cap":
  //         return "#9C27B0";
  //       case "Intelligence":
  //         return "#3F51B5";
  //       case "Willpower":
  //         return "#4CAF50";
  //       default:
  //         return null;
  //     }
  //   },
  //   lineWidth: 2,
  //   path: "M21 0c4.79 9.35 5.13 6 14 7.19C42.53 8.2 42.8 12.44 49 4h2c1.55 2.11 3.24 4.73 6 5.34 2.34.52 5.45-1.41 8-1.95C71.56 5.99 76.5 9.18 78 0h3c-.04 11.39-1.87 9.92-9.72 15.81-1.81 1.36-3.69 3.52-5.28 5.37 9.44-2.45 10.34 1.67 14.99 0 3.05-.8 4.81-3.81 7.18-5.77C91.57 12.6 95.7 11.45 100 11c-2.33 4.06-4.94 4.67-7.03 8.09-2.33 3.8-3.48 12.96-11.97 15.15-4.18 1.45-6.42-.74-13 0 .76 3.88.86 4.61-2 7.76l-6-7-3.83 15 4.68 21 3.28 8.83L60 85l9-3c.11 6.18-3.23 6.71-8 10-2.52 1.74-6.89 4.95-10 5.09-2.7.12-4.85-1.64-7-3.02-5.35-3.43-10.9-5.42-12-12.07l9 3-4.11-5.26L40.06 71l5.61-23.96L40 36l-4 6c-3.88-2.33-3.97-3.72-3-8-7.67-.58-15.71 3.7-21.02-5.1-1.6-2.67-1.3-6.18-3.86-9.73C5.4 15.4 2.75 15.67 1 11c4.28.55 7.53 1.59 11 4.3 2.45 1.91 5 5.13 8 6.01 3.07.91 9.45-1.68 13-2.31-6.09-5.09-16.5-9.2-12-19Z",
  //   radius: 18,
  // },
  recipe: {
    color: "#ded3bd",
    lineWidth: 2,
    path: CIRCLE_PATH,
    radius: 5,
  },
  area: {
    color: "black",
    radius: 14,
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
