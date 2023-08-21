"use client";
import { ICONS } from "@/app/lib/icons";
import { NODE, NODE_TYPE } from "@/app/lib/nodes";
import { useRoutesStore } from "@/app/lib/storage/routes";
import leaflet from "leaflet";
import { memo, useEffect, useRef } from "react";
import { useDict } from "../(i18n)/i18n-provider";
import CanvasMarker from "./canvas-marker";
const Marker = memo(function Marker({
  id,
  node,
  type,
  isHighlighted,
  isDiscovered,
  iconSize,
  onClick,
  onContextMenu,
  featureGroup,
}: {
  id: string;
  node: NODE;
  type: NODE_TYPE;
  isHighlighted: boolean;
  isDiscovered: boolean;
  iconSize: number;
  onClick: (node: NODE) => void;
  onContextMenu: (id: string) => void;
  featureGroup: leaflet.FeatureGroup;
}) {
  const marker = useRef<CanvasMarker | null>(null);
  const dict = useDict();

  useEffect(() => {
    const icon = ICONS[type];
    const latLng = [node.y, node.x] as [number, number];
    const interactive = type !== "area";
    marker.current = new CanvasMarker(latLng, {
      id,
      type,
      icon,
      name: dict.generated[type]?.[node.id]?.name,
      radius: icon.radius * iconSize,
      isHighlighted,
      isDiscovered,
      pmIgnore: true,
      snapIgnore: false,
      interactive,
    });
    marker.current.addTo(featureGroup);

    if (interactive) {
      marker.current.on("click", () => {
        if (!useRoutesStore.getState().isCreating) {
          onClick(node);
        }
      });
      marker.current.on("contextmenu", () => {
        if (!useRoutesStore.getState().isCreating) {
          onContextMenu(id);
        }
      });

      const tooltipContent = () => {
        let tooltipContent = "";
        tooltipContent += `<p class="font-bold text-base">${
          dict.generated[type]?.[node.id]?.name ?? ""
        }</p>`;
        tooltipContent += `<p class="text-gray-300 text-sm">${dict.nodes[type]}</p>`;
        tooltipContent += `<p class="text-gray-300 text-xs font-bold">${node.id}</p>`;

        if ("description" in node) {
          tooltipContent += `<p class="border-t border-t-gray-700 mt-2 pt-2 max-w-md whitespace-normal">${node.description}</p>`;
        } else if ("id" in node) {
          tooltipContent += `<p class="border-t border-t-gray-700 mt-2 pt-2 max-w-md whitespace-normal">${
            dict.generated[type]?.[node.id]?.description ?? ""
          }</p>`;
        }
        const div = document.createElement("div");
        div.innerHTML = tooltipContent;
        const note = document.createElement("p");
        note.className = "text-gray-300 text-xs italic mt-2 hide-on-print";
        note.innerHTML = dict.settings.rightClickToggle;

        div.append(note);
        return div;
      };
      marker.current.bindTooltip(tooltipContent, {
        permanent: isHighlighted,
        interactive: isHighlighted,
        direction: "top",
        offset: [0, -icon.radius * iconSize],
      });
      if (isDiscovered) {
        marker.current.bringToBack();
      } else if (isHighlighted) {
        marker.current.bringToFront();
      }
    } else {
      marker.current.bringToBack();
    }
    return () => {
      if (marker.current) {
        featureGroup.removeLayer(marker.current);
        marker.current.remove();
        marker.current = null;
      }
    };
  }, [type, isHighlighted, isDiscovered, iconSize, dict]);

  return <></>;
});

export default Marker;
