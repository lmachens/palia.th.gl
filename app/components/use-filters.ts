import { useCallback } from "react";
import {
  ALL_FILTERS,
  useGlobalSettingsStore,
} from "../lib/storage/global-settings";

export default function useFilters() {
  const globalSettingsStore = useGlobalSettingsStore();
  const setFilters = useCallback((newFilters: string[]) => {
    newFilters = newFilters.filter((f) => ALL_FILTERS.includes(f));
    globalSettingsStore.setFilters(newFilters);
  }, []);

  const toggleFilter = useCallback(
    (key: string) => {
      const newFilters = globalSettingsStore.filters.includes(key)
        ? globalSettingsStore.filters.filter((f) => f !== key)
        : [...globalSettingsStore.filters, key];
      setFilters(newFilters);
    },
    [globalSettingsStore.filters],
  );
  return [globalSettingsStore.filters, toggleFilter, setFilters] as const;
}
