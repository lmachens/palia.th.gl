export let leaflet: // eslint-disable-next-line @typescript-eslint/consistent-type-imports
| typeof import("/home/lmachens/palia.th.gl/node_modules/.pnpm/@types+leaflet@1.9.6/node_modules/@types/leaflet/index");
export type * from "leaflet";
async function importLeaflet() {
  const Leaflet = (await import("leaflet")).default;
  leaflet = Leaflet;
}
if (typeof window !== "undefined") {
  importLeaflet();
}
