import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useOverwolfRouter } from "../(overwolf)/components/overwolf-router";
import { CONFIGS } from "../lib/maps";
import { nodes } from "../lib/nodes";
import { useDict, useI18N } from "./(i18n)/i18n-provider";

export default function Maps() {
  const dict = useDict();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useOverwolfRouter();
  const i18n = useI18N();
  const isOverwolf = "value" in router;

  const search = useMemo(() => {
    return (
      (isOverwolf ? router.value.search : searchParams.get("search")) ?? ""
    ).toLowerCase();
  }, [searchParams, isOverwolf && router.value.search]);

  const mapNodesCount = useMemo(() => {
    return nodes.reduce(
      (acc, node) => {
        if (
          dict.generated[node.type]?.[node.id]?.name
            .toLowerCase()
            .includes(search) ||
          node.id.toLowerCase().includes(search) ||
          dict.spawnNodes[node.type]?.name.toLowerCase().includes(search)
        ) {
          acc[node.mapName as keyof typeof acc] += 1;
        }
        return acc;
      },
      {
        "kilima-valley": 0,
        "bahari-bay": 0,
        fairgrounds: 0,
        housing: 0,
      }
    );
  }, [search]);

  const mapName =
    "update" in router
      ? dict.maps[router.value.mapName!]
      : decodeURIComponent(params.map as string);
  return (
    <div className="divide-y divide-neutral-700 border-t border-t-neutral-600 bg-neutral-900 text-sm w-full md:border md:border-gray-600 md:rounded-lg">
      <div className="flex flex-wrap">
        {Object.keys(CONFIGS).map((map) => (
          <Link
            href={`/${i18n.locale}/${encodeURIComponent(
              dict.maps[map]
            )}?${searchParams.toString()}`}
            key={map}
            className={`p-2 basis-1/2 hover:text-white w-1/2 text-center ${
              dict.maps[map] === mapName ? "text-gray-200" : "text-gray-500"
            }`}
            onClick={(event) => {
              if ("update" in router) {
                router.update({ mapName: map });
                event.preventDefault();
              }
            }}
          >
            {dict.maps[map]} ({mapNodesCount[map as keyof typeof mapNodesCount]}
            )
          </Link>
        ))}
      </div>
    </div>
  );
}
