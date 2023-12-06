import type { DICT } from "@/lib/i18n";
import type { NODE } from "@/lib/nodes";
import { winterlightsChest } from "@/lib/nodes/winterlightsChest";
import dynamic from "next/dynamic";
import NitroAds from "../(ads)/nitro-ads";
import WideSkyscraper from "../(ads)/wide-skyscrapper";
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
    <div className="grow flex justify-center pt-[50px]">
      <NitroAds>
        <WideSkyscraper id="palia-wide-skyscraper-1" />
      </NitroAds>
      <div className="container p-4 text-center space-y-2">
        <h1 className="text-3xl font-bold mb-4">
          {dict.winterfestChallenge.title}
        </h1>
        <p>{dict.winterfestChallenge.description}</p>
        <div className="h-96 mt-4">
          <Map>
            <Tiles />
            <SpecialNodes nodes={nodes} />
          </Map>
        </div>
      </div>
      <NitroAds>
        <WideSkyscraper id="palia-wide-skyscraper-2" />
      </NitroAds>
    </div>
  );
}
