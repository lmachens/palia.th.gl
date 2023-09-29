import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useOverwolfRouter } from "../(overwolf)/components/overwolf-router";
import { CONFIGS } from "../lib/maps";
import { useVisibleNodeStore } from "../lib/storage/visible-nodes";
import { useDict, useI18N } from "./(i18n)/i18n-provider";

export default function Maps() {
  const dict = useDict();
  const params = useParams();
  const searchParams = useSearchParams();
  const overwolfRouter = useOverwolfRouter();
  const i18n = useI18N();
  const visibleNodesByMap = useVisibleNodeStore(
    (state) => state.visibleNodesByMap
  );

  const mapName = overwolfRouter
    ? dict.maps[overwolfRouter.value.mapName!]
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
            className={`p-2 basis-1/2 hover:text-white w-1/2 text-center truncate ${
              dict.maps[map] === mapName ? "text-gray-200" : "text-gray-500"
            }`}
            onClick={(event) => {
              if (overwolfRouter) {
                overwolfRouter.update({ mapName: map });
                event.preventDefault();
              }
            }}
          >
            {dict.maps[map]} ({visibleNodesByMap[map]?.length ?? 0})
          </Link>
        ))}
      </div>
    </div>
  );
}
