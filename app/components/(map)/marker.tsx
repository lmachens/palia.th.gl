"use client";
import { ICONS, SPAWN_ICONS } from "@/app/lib/icons";
import type { NODE, NODE_TYPE } from "@/app/lib/nodes";
import { useRoutesStore } from "@/app/lib/storage/routes";
import type leaflet from "leaflet";
import { memo, useEffect } from "react";
import { useDict } from "../(i18n)/i18n-provider";
import CanvasMarker from "./canvas-marker";
const Marker = memo(function Marker({
  id,
  node,
  type,
  isHighlighted,
  iconSize,
  onClick,
  featureGroup,
}: {
  id: string;
  node: NODE;
  type: NODE_TYPE;
  isHighlighted: boolean;
  iconSize: number;
  onClick: (node: NODE) => void;
  featureGroup: leaflet.FeatureGroup;
}) {
  const dict = useDict();

  useEffect(() => {
    const icon = node.isSpawnNode
      ? SPAWN_ICONS[type]
      : ICONS[type as keyof typeof ICONS];
    const latLng = [node.y, node.x] as [number, number];
    const interactive = type !== "area";
    const marker = new CanvasMarker(latLng, {
      id,
      icon,
      // @ts-ignore
      name: dict.generated[type]?.[node.id]?.name,
      radius: icon.radius * iconSize,
      isHighlighted,
      pmIgnore: true,
      snapIgnore: false,
      interactive,
    });
    marker.addTo(featureGroup);

    if (interactive) {
      marker.on("click", () => {
        if (!useRoutesStore.getState().isCreating) {
          onClick(node);
        }
      });

      const tooltipContent = () => {
        const dictEntry = node.isSpawnNode
          ? dict.spawnNodes[type as keyof typeof dict.spawnNodes]
          : // @ts-ignore
            dict.generated[type]?.[node.id];
        let tooltipContent = `<p class="font-bold text-base">${
          dictEntry?.name ?? ""
        }</p>`;
        tooltipContent += `<p class="text-gray-300 text-sm">${
          // @ts-ignore
          node.isSpawnNode ? dict.spawnNodes[type].name : dict.nodes[type]
        }</p>`;
        tooltipContent += `<p class="border-t border-t-gray-700 mt-2 pt-2 max-w-md whitespace-normal">${
          dictEntry?.description ?? ""
        }</p>`;
        const div = document.createElement("div");
        div.innerHTML = tooltipContent;
        return div;
      };
      marker.bindTooltip(tooltipContent, {
        permanent: isHighlighted,
        interactive: isHighlighted,
        direction: "top",
        offset: [0, -icon.radius * iconSize],
      });
      if (isHighlighted) {
        marker.bringToFront();
      }
    } else {
      marker.bringToBack();
    }
    return () => {
      featureGroup.removeLayer(marker);
      marker.remove();
    };
  }, [type, isHighlighted, iconSize, dict]);

  return <></>;
});

export default Marker;
