"use client";
import { ICONS, SPAWN_ICONS, VILLAGER_ICONS } from "@/app/lib/icons";
import type { NODE } from "@/app/lib/nodes";
import { useRoutesStore } from "@/app/lib/storage/routes";
import type leaflet from "leaflet";
import { useEffect, useRef } from "react";
import { useDict } from "../(i18n)/i18n-provider";
import CanvasMarker from "./canvas-marker";

const Marker = function Marker({
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
  type: string;
  isHighlighted: boolean;
  iconSize: number;
  onClick: (node: NODE) => void;
  featureGroup: leaflet.FeatureGroup;
}) {
  const dict = useDict();
  const marker = useRef<CanvasMarker | null>(null);

  useEffect(() => {
    const interactive = type !== "area";
    const icon = node.isSpawnNode
      ? SPAWN_ICONS[type]
      : VILLAGER_ICONS[node.id] || ICONS[type as keyof typeof ICONS];

    marker.current = new CanvasMarker([node.y, node.x] as [number, number], {
      id,
      icon,
      name: dict.generated[type]?.[node.id]?.name,
      radius: icon.radius * iconSize,
      isHighlighted,
      pmIgnore: true,
      snapIgnore: false,
      interactive,
      isStar: node.isStar,
    });
    marker.current.addTo(featureGroup);

    if (interactive) {
      marker.current.on("click", () => {
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
        tooltipContent += `<p class="text-gray-300 text-sm flex gap-1 justify-center items-center">${
          node.isStar
            ? `<img src="/icons/star.webp" class="inline-block" width="14" height="14" alt="Star" />`
            : ""
        }${
          // @ts-ignore
          node.isSpawnNode
            ? dict.spawnNodes[type]?.name
            : ("name" in icon && icon.name) || dict.nodes[type]
        } ${
          node.isStar
            ? `<img src="/icons/star.webp" class="inline-block" width="14" height="14" alt="Star" />`
            : ""
        }</p>`;

        tooltipContent += `<p class="border-t border-t-gray-700 mt-2 pt-2 max-w-md whitespace-normal">${
          dictEntry?.description ?? ""
        }</p>`;
        const div = document.createElement("div");
        div.innerHTML = tooltipContent;
        return div;
      };
      marker.current.bindTooltip(tooltipContent, {
        permanent: isHighlighted,
        interactive: isHighlighted,
        direction: "top",
        offset: [0, -icon.radius * iconSize],
      });
      if (isHighlighted) {
        marker.current.bringToFront();
      }
    } else {
      marker.current.bringToBack();
    }

    return () => {
      if (marker.current) {
        featureGroup.removeLayer(marker.current);
        marker.current.remove();
      }
    };
  }, [type, isHighlighted, iconSize, dict]);

  useEffect(() => {
    if (!marker.current) {
      return;
    }

    marker.current.setLatLng([node.y, node.x] as [number, number]);
  }, [node.y, node.x]);

  return <></>;
};

export default Marker;
