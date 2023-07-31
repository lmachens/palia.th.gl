"use client";
import { useOverwolfRouter } from "../(overwolf)/components/overwolf-router";
import { ICONS } from "../lib/icons";
import { staticNodes } from "../lib/nodes";
import { useDiscoveredNodesStore } from "../lib/storage/discovered-nodes";
import { useDict } from "./(i18n)/i18n-provider";
import useFilters from "./use-filters";

export default function DiscoveredNodes() {
  const { discoveredNodes, setDiscoveredNodes } = useDiscoveredNodesStore();
  const dict = useDict();
  const [filters, toggleFilter] = useFilters();
  const router = useOverwolfRouter();

  return (
    <div>
      <div className="grid grid-cols-3 justify-items-center text-sm">
        {"update" in router ? (
          <button
            className="p-1 uppercase hover:text-white"
            onClick={() => {
              overwolf.io.writeFileContents(
                `${
                  overwolf.io.paths.documents
                }\\Diablo 4 Map\\discovered_nodes_${Date.now()}.json`,
                JSON.stringify(discoveredNodes),
                "UTF8" as overwolf.io.enums.eEncoding.UTF8,
                true,
                () => console.log
              );
              overwolf.utils.openWindowsExplorer(
                `${overwolf.io.paths.documents}\\Diablo 4 Map`,
                console.log
              );
            }}
          >
            {dict.settings.backup}
          </button>
        ) : (
          <a
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(discoveredNodes)
            )}`}
            download="diablo_4_map_discovered_nodes.json"
            className="p-1 uppercase hover:text-white"
          >
            {dict.settings.backup}
          </a>
        )}
        <label className="p-1 uppercase hover:text-white cursor-pointer">
          <input
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              const reader = new FileReader();
              reader.addEventListener("load", (loadEvent) => {
                const text = loadEvent.target?.result;
                if (!text || typeof text !== "string") {
                  return;
                }
                try {
                  let discoveredNodes = JSON.parse(text);
                  if (!Array.isArray(discoveredNodes)) {
                    discoveredNodes = [];
                  } else if (
                    discoveredNodes.some((node) => typeof node !== "string")
                  ) {
                    discoveredNodes = [];
                  }

                  setDiscoveredNodes(discoveredNodes);
                } catch (error) {
                  // Do nothing
                }
                event.target.value = "";
              });
              reader.readAsText(file);
            }}
          />
          {dict.settings.restore}
        </label>
        <button
          className="p-1 uppercase hover:text-white"
          onClick={() => {
            if (
              confirm("Are you sure you want to reset all discovered nodes?")
            ) {
              setDiscoveredNodes([]);
            }
          }}
        >
          {dict.settings.reset}
        </button>
      </div>
      {Object.keys(staticNodes).map((_key) => {
        const key = _key as keyof typeof staticNodes;
        const icon = ICONS[key];
        return (
          <button
            key={key}
            className={`flex items-center hover:bg-neutral-700 p-2 w-full ${
              !filters.includes(key) ? "text-gray-500" : ""
            }`}
            onClick={() => {
              toggleFilter(key);
            }}
          >
            <svg viewBox="0 0 100 100" fill={icon.color} className="h-5">
              <path d={icon.path} />
            </svg>
            <span className="flex-1 text-left mx-3">
              {dict.nodes[key as keyof typeof ICONS]}
            </span>
            <span>
              {discoveredNodes.filter((node) => node.startsWith(key)).length}/
              {staticNodes[key].length}
            </span>
          </button>
        );
      })}
    </div>
  );
}
