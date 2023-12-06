import type { DICT } from "@/lib/i18n";
import type { NODE } from "@/lib/nodes";
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

type TimedLootPiles = {
  BP_ChapaaPile_C: {
    mapName: string;
    position: Array<number>;
    timestamp: number;
  };
};

export default async function RummagePile({ dict }: { dict: DICT }) {
  const respone = await fetch(
    "https://palia-api.th.gl/nodes?type=timedLootPiles",
    {
      next: { revalidate: 60 },
    }
  );
  const data = (await respone.json()) as TimedLootPiles;
  const node: NODE = {
    id: "BP_ChapaaPile_C",
    x: data.BP_ChapaaPile_C.position[0],
    y: data.BP_ChapaaPile_C.position[1],
    type: "rummagePile",
    mapName: data.BP_ChapaaPile_C.mapName,
  };

  function formatDate(date: Date) {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }
  return (
    <div className="grow flex justify-center pt-[50px]">
      <NitroAds>
        <WideSkyscraper id="palia-wide-skyscraper-1" />
      </NitroAds>
      <div className="container p-4 text-center space-y-2">
        <h1 className="text-3xl font-bold mb-4">{dict.rummagePile.title}</h1>
        <p>{dict.rummagePile.description}</p>
        <div className="h-96 mt-4">
          <Map>
            <Tiles />
            <SpecialNodes nodes={[node]} />
          </Map>
        </div>
        <p className="text-zinc-200 text-sm">
          Updated at {formatDate(new Date(data.BP_ChapaaPile_C.timestamp))}
        </p>
      </div>
      <NitroAds>
        <WideSkyscraper id="palia-wide-skyscraper-2" />
      </NitroAds>
    </div>
  );
}
