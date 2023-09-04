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
    (key: string | string[]) => {
      if (Array.isArray(key)) {
        const newFilters = globalSettingsStore.filters.some((filter) =>
          key.includes(filter)
        )
          ? globalSettingsStore.filters.filter((f) => !key.includes(f))
          : [...globalSettingsStore.filters, ...key];
        setFilters(newFilters);
      } else {
        const newFilters = globalSettingsStore.filters.includes(key)
          ? globalSettingsStore.filters.filter((f) => f !== key)
          : [...globalSettingsStore.filters, key];
        setFilters(newFilters);
      }
    },
    [globalSettingsStore.filters]
  );
  return [globalSettingsStore.filters, toggleFilter, setFilters] as const;
}
