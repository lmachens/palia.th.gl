import type { DICT } from "@/lib/i18n";
import type { NODE } from "@/lib/nodes";
import { RUMMAGE_PILE_TAG } from "@/lib/revalidate";
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

type TimedLootPiles = {
  BP_ChapaaPile_C: {
    mapName: string;
    position: Array<number>;
    timestamp: number;
  };
};

export default async function RummagePile({
  dict,
  isScreenshot,
}: {
  dict: DICT;
  isScreenshot?: boolean;
}) {
  const respone = await fetch(
    "https://palia-api.th.gl/nodes?type=timedLootPiles",
    {
      next: { tags: [RUMMAGE_PILE_TAG] },
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

  if (isScreenshot) {
    return (
      <Map>
        <Tiles />
        <SpecialNodes nodes={[node]} />
      </Map>
    );
  }
  return (
    <ContentPage
      header={
        <h1 className="text-3xl font-bold mb-4">{dict.rummagePile.title}</h1>
      }
      content={
        <>
          <div className="h-60 md:h-96 mt-4">
            <Map>
              <Tiles />
              <SpecialNodes nodes={[node]} />
            </Map>
          </div>
          <p className="text-zinc-200 text-sm">
            Updated at {formatDate(new Date(data.BP_ChapaaPile_C.timestamp))}
          </p>
          <p>{dict.rummagePile.description}</p>
        </>
      }
    />
  );
}
