"use client";
import type { NODE } from "@/lib/nodes";
import { useMap } from "@/lib/storage/map";
import leaflet from "leaflet";
import { useEffect, useMemo } from "react";
import Marker from "./marker";

export default function SpecialNodes({ nodes }: { nodes: Array<NODE> }) {
  const map = useMap();
  const featureGroup = useMemo(() => {
    const featureGroup = new leaflet.FeatureGroup();
    return featureGroup;
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }
    featureGroup.addTo(map);

    const bounds = featureGroup.getBounds();
    if (bounds.isValid() && map) {
      if (featureGroup.getLayers().length === 1) {
        map.panTo(bounds.getCenter());
      } else {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      featureGroup.removeFrom(map);
    };
  }, [map]);

  return (
    <>
      {nodes.map((node) => (
        <Marker
          key={node.id}
          id={node.id}
          node={node}
          type={node.type}
          isHighlighted={false}
          iconSize={1}
          featureGroup={featureGroup}
        />
      ))}
    </>
  );
}
