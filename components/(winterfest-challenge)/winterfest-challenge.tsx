import type { DICT } from "@/lib/i18n";
import type { NODE } from "@/lib/nodes";
import { winterlightsChest } from "@/lib/nodes/winterlightsChest";
import dynamic from "next/dynamic";
import ContentPage from "../(layouts)/content-page";
const Tiles = dynamic(() => import("@/components/(map)/tiles"), {
  ssr: false,
});
const Map = dynamic(() => import("@/components/(map)/map"), {
  ssr: false,
});
const SpecialNodes = dynamic(() => import("@/components/(map)/special-nodes"), {
  ssr: false,
});

export default function WinterfestChallenge({ dict }: { dict: DICT }) {
  const nodes: NODE[] = Object.entries(winterlightsChest).flatMap(
    ([id, more]) =>
      Object.entries(more).flatMap(([key, nodes]) => {
        return nodes.map(([x, y]) => ({
          id,
          x,
          y,
          type: "winterlightsChest",
          mapName: key,
        }));
      })
  );

  return (
    <ContentPage
      header={
        <h1 className="text-3xl font-bold mb-4">
          {dict.winterfestChallenge.title}
        </h1>
      }
      content={
        <>
          <p>{dict.winterfestChallenge.description}</p>
          <div className="h-96 mt-4">
            <Map>
              <Tiles />
              <SpecialNodes nodes={nodes} />
            </Map>
          </div>
        </>
      }
    />
  );
}
