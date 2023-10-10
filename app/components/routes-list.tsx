import { isOverwolfApp } from "../lib/env";
import { useRoutesStore } from "../lib/storage/routes";
import Toggle from "./toggle";

export default function RoutesList() {
  const routes = useRoutesStore();

  return (
    <>
      {routes.routes.length === 0 && (
        <div className="p-2">No routes created</div>
      )}
      {routes.routes.map((route) => {
        const filename = `route_${route.name
          .replaceAll(/[^a-z0-9]+/gi, " ")
          .replaceAll(/\s/g, "_")}_${route.id}.json`.toLowerCase();
        return (
          <article key={route.id} className={`p-2 space-y-1`}>
            <div className="flex justify-between">
              <Toggle
                checked={routes.activeRoutes.includes(route.id)}
                onChange={(checked) =>
                  checked
                    ? routes.addActiveRoute(route.id)
                    : routes.removeActiveRoute(route.id)
                }
                small
              />
              <div className="space-x-3">
                {isOverwolfApp ? (
                  <button
                    className="hover:text-white"
                    onClick={() => {
                      overwolf.io.writeFileContents(
                        `${overwolf.io.paths.documents}\\Palia Map\\${filename}`,
                        JSON.stringify(route),
                        "UTF8" as overwolf.io.enums.eEncoding.UTF8,
                        true,
                        () => console.log
                      );
                      overwolf.utils.openWindowsExplorer(
                        `${overwolf.io.paths.documents}\\Palia Map`,
                        console.log
                      );
                    }}
                  >
                    Export
                  </button>
                ) : (
                  <a
                    href={`data:text/json;charset=utf-8,${encodeURIComponent(
                      JSON.stringify(route)
                    )}`}
                    download={filename}
                    className="hover:text-white"
                  >
                    Export
                  </a>
                )}
                <button
                  className="hover:text-white"
                  onClick={() => {
                    routes.updateTempRoute(route);
                    routes.setIsCreating(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="hover:text-white"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this route?")
                    ) {
                      routes.removeRoute(route.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="truncate text-base">{route.name}</div>
          </article>
        );
      })}
    </>
  );
}
