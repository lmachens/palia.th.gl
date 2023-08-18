export const territories = [
  {
    id: "territories:1",
    points: [
      [-44.36409, 97.95766],
      [-44.62329, 99.87993],
      [-43.01642, 101.28722],
      [-42.06788, 102.61002],
      [-40.64557, 102.13589],
      [-39.26066, 100.75097],
      [-38.46239, 99.82748],
      [-39.52271, 98.49266],
      [-40.72043, 97.41974],
      [-42.57975, 97.72692],
      [-44.36409, 97.95766],
    ],
  },
] as const;

export const isPointInsidePolygon = (
  point: readonly [number, number],
  polygon: readonly (readonly [number, number])[]
) => {
  const x = point[0];
  const y = point[1];

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0],
      yi = polygon[i][1];
    const xj = polygon[j][0],
      yj = polygon[j][1];

    const intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

export const getTerritoryByPoint = (point: [number, number]) => {
  return territories.find((territory) =>
    isPointInsidePolygon(point, territory.points)
  );
};
