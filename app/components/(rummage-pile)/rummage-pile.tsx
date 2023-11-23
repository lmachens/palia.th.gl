import type { DICT } from "@/app/lib/i18n";
import type { NODE } from "@/app/lib/nodes";
import dynamic from "next/dynamic";
const Tiles = dynamic(() => import("@/app/components/(map)/tiles"), {
  ssr: false,
});
const Map = dynamic(() => import("@/app/components/(map)/map"), {
  ssr: false,
});
const SpecialNodes = dynamic(
  () => import("@/app/components/(map)/special-nodes"),
  {
    ssr: false,
  }
);

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
  return (
    <div className="overflow-auto h-[calc(100%-50px)]">
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">{dict.rummagePile.title}</h1>
        <p>{dict.rummagePile.description}</p>
        <div className="h-96 mt-4">
          <Map>
            <Tiles />
            <SpecialNodes nodes={[node]} />
          </Map>
        </div>
      </div>
    </div>
  );
}
