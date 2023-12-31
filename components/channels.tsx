import { useDict } from "@/components/(i18n)/i18n-provider";
import Toggle from "@/components/toggle";
import { useAccountStore } from "@/lib/storage/account";
import { promisifyOverwolf } from "@/lib/wrapper";
import { useState } from "react";
import useSWR from "swr";

export default function Channels() {
  const dict = useDict();
  const previewAccess = useAccountStore((state) => state.previewAccess);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: extensionSettings, mutate: refreshExtensionSettings } = useSWR(
    "extensionSettings",
    () => promisifyOverwolf(overwolf.settings.getExtensionSettings)()
  );
  const { data: manifest } = useSWR("manifest", () =>
    promisifyOverwolf(overwolf.extensions.current.getManifest)()
  );
  const { data: extensionUpdate, mutate: refreshCheckForExtensionUpdate } =
    useSWR("extensionUpdate", () =>
      promisifyOverwolf(overwolf.extensions.checkForExtensionUpdate)()
    );

  const version = manifest?.meta.version;
  const channel = extensionSettings?.settings?.channel || "production";
  let state = extensionUpdate?.state || "UpToDate";
  if (version === extensionUpdate?.updateVersion) {
    state = "UpToDate";
  }
  return (
    <>
      <h2 className="category-title">{dict.menu.status}</h2>
      <label className="flex items-center">
        <span className="w-1/2">{dict.menu.previewAccess}</span>
        <Toggle
          checked={channel === "preview-access"}
          onChange={(checked) => {
            promisifyOverwolf(overwolf.settings.setExtensionSettings)({
              channel: checked ? "preview-access" : "production",
            })
              .then(() => refreshExtensionSettings())
              .then(() => refreshCheckForExtensionUpdate())
              .catch(console.error);
          }}
          disabled={!previewAccess}
        />
      </label>
      <p className="text-sm text-gray-400">
        {dict.menu.previewAccessDesc}{" "}
        <a
          href="https://www.th.gl/support-me"
          target="_blank"
          className="hover:text-white text-brand"
        >
          {dict.menu.eliteSupporters}
        </a>
        .
      </p>
      <label className="flex">
        <span className="w-1/2">{dict.menu.version}</span>
        <span>v{version}</span>
      </label>
      <p className="text-sm text-gray-400">
        {state === "UpToDate" && dict.menu.runningLatestVersion}
        {state === "UpdateAvailable" && !isUpdating && (
          <>
            {dict.menu.updateIsAvailable}{" "}
            <button
              className="hover:text-white text-brand"
              onClick={() => {
                setIsUpdating(true);
                promisifyOverwolf(overwolf.extensions.updateExtension)()
                  .then(() => refreshCheckForExtensionUpdate())
                  .catch(console.error)
                  .finally(() => setIsUpdating(false));
              }}
            >
              {dict.menu.updateNow}
            </button>
          </>
        )}
        {state === "UpdateAvailable" && isUpdating && dict.menu.isUpdating}
        {state === "PendingRestart" && (
          <>
            {dict.menu.pendingRestart}{" "}
            <button
              className="hover:text-white text-brand"
              onClick={() => overwolf.extensions.relaunch()}
            >
              {dict.menu.restartNow}
            </button>
          </>
        )}
      </p>
    </>
  );
}
