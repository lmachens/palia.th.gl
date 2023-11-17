"use client";

import { useWeeklyWantsStore } from "@/app/lib/storage/weekly-wants";

export default function Checkbox({
  itemId,
  villagerId,
  version,
}: {
  itemId: string;
  villagerId: string;
  version: number;
}) {
  const weeklyWants = useWeeklyWantsStore();

  return (
    <input
      type="checkbox"
      checked={weeklyWants.finished.some(
        (v) =>
          v.id === itemId &&
          v.villagerId === villagerId &&
          v.version === version
      )}
      onChange={() => weeklyWants.toggleFinished(villagerId, itemId, version)}
    />
  );
}
