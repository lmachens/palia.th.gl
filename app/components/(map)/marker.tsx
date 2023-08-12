"use client";
import { ICONS } from "@/app/lib/icons";
import { NODE, NODE_TYPE } from "@/app/lib/nodes";
import { useRoutesStore } from "@/app/lib/storage/routes";
import { getTerritoryByPoint } from "@/app/lib/territories";
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
  isAlternativeDiscoveredStyle,
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
  isAlternativeDiscoveredStyle?: boolean;
  onClick: (node: NODE) => void;
  onContextMenu: (id: string) => void;
  featureGroup: leaflet.FeatureGroup;
}) {
  const marker = useRef<CanvasMarker | null>(null);
  const dict = useDict();

  useEffect(() => {
    const icon = ICONS[type];
    const attribute = "attribute" in node ? node.attribute : undefined;
    const latLng = [node.x, node.y] as [number, number];
    marker.current = new CanvasMarker(latLng, {
      id,
      type,
      attribute,
      icon,
      radius: icon.radius * iconSize,
      isHighlighted,
      isDiscovered,
      isAlternativeDiscoveredStyle,
      pmIgnore: true,
      snapIgnore: false,
    });
    marker.current.addTo(featureGroup);

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
      const territory = getTerritoryByPoint([node.x, node.y]);
      const attributeColor =
        "attribute" in icon && attribute && icon.attribute(attribute);
      let tooltipContent = "";
      tooltipContent += `<p class="font-bold text-base">${
        dict.generated[type]?.["termId" in node ? node.termId : node.id]
          ?.name ?? ""
      }</p>`;
      tooltipContent += `<p class="text-gray-300 text-sm">${dict.nodes[type]}</p>`;
      if (territory) {
        tooltipContent += `<p class="text-amber-50 text-sm">${
          dict.generated.territories[territory.id].name
        }</p>`;
      }
      if ("aspectId" in node) {
        tooltipContent += `<p class="border-t border-t-gray-700 mt-2 pt-2 text-base font-bold">${
          dict.generated.generic.aspect.name
        } ${
          dict.generated.aspects[node.aspectId].name
        }</p><p class="text-orange-500 text-lg">${node.className}</p>`;
      }

      if ("description" in node) {
        tooltipContent += `<p class="border-t border-t-gray-700 mt-2 pt-2 max-w-md whitespace-normal">${
          attributeColor
            ? `<div class="inline-block w-2 h-2 rounded-full mr-1" style="background: ${attributeColor}"></div>`
            : ""
        }${node.description}</p>`;
      } else if ("id" in node) {
        tooltipContent += `<p class="border-t border-t-gray-700 mt-2 pt-2 max-w-md whitespace-normal">${
          attributeColor
            ? `<div class="inline-block w-2 h-2 rounded-full mr-1" style="background: ${attributeColor}"></div>`
            : ""
        }${dict.generated[type]?.[node.id]?.description ?? ""}</p>`;
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
    return () => {
      if (marker.current) {
        featureGroup.removeLayer(marker.current);
        marker.current.remove();
        marker.current = null;
      }
    };
  }, [
    type,
    isHighlighted,
    isDiscovered,
    iconSize,
    isAlternativeDiscoveredStyle,
    dict,
  ]);

  return <></>;
});

export default Marker;
