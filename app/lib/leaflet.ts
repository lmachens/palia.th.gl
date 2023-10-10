export let leaflet: // eslint-disable-next-line @typescript-eslint/consistent-type-imports
typeof import("leaflet");
export type * from "leaflet";
async function importLeaflet() {
  const Leaflet = (await import("leaflet")).default;
  leaflet = Leaflet;
}
if (typeof window !== "undefined") {
  importLeaflet();
}
