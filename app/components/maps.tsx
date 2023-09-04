import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { MAPS } from "../lib/maps";
import { useDict } from "./(i18n)/i18n-provider";

export default function Maps() {
  const dict = useDict();
  const params = useParams();
  const searchParams = useSearchParams();

  return (
    <div className="divide-y divide-neutral-700 border-t border-t-neutral-600 bg-neutral-900 text-gray-200 text-sm w-full md:border md:border-gray-600 md:rounded-lg">
      <div className="flex">
        {MAPS.map((map) => (
          <Link
            href={`/${params.lang}/${map}?${searchParams.toString()}`}
            key={map}
            className="p-2 uppercase hover:text-white w-1/2"
          >
            {dict.maps[map]}
          </Link>
        ))}
      </div>
    </div>
  );
}
