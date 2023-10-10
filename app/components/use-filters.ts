"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { spawnNodes, staticNodes } from "../lib/nodes";
import { useUpdateSearchParams } from "../lib/search-params";

const ALL_FILTERS = [...Object.keys(staticNodes), ...Object.keys(spawnNodes)];

export default function useFilters() {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const filtersString = searchParams.get("filters");
  const filters = useMemo(() => {
    let filters = ALL_FILTERS;
    if (typeof overwolf === "undefined") {
      if (filtersString) {
        filters = filtersString.split(",");
      }
    }
    return filters;
  }, [filtersString]);

  const setFilters = (filters: string[]) => {
    const newFilters = filters.filter((f) => ALL_FILTERS.includes(f));
    let filtersString = "";
    if (newFilters.length === 0) {
      filtersString = "none";
    } else if (newFilters.length !== ALL_FILTERS.length) {
      filtersString = filters.join(",");
    }
    updateSearchParams("filters", filtersString, true);
  };

  const toggleFilter = useCallback(
    (key: string | string[]) => {
      if (Array.isArray(key)) {
        const newFilters = filters.some((filter) => key.includes(filter))
          ? filters.filter((f) => !key.includes(f))
          : [...filters, ...key];
        setFilters(newFilters);
      } else {
        const newFilters = filters.includes(key)
          ? filters.filter((f) => f !== key)
          : [...filters, key];
        setFilters(newFilters);
      }
    },
    [filters]
  );
  return [filters, toggleFilter, setFilters] as const;
}
