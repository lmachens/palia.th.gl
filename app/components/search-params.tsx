"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { API_BASE_URI, isOverwolfApp } from "../lib/env";
import { useUpdateSearchParams } from "../lib/search-params";
import { useAccountStore } from "../lib/storage/account";
import { ALL_FILTERS } from "../lib/storage/global-settings";
import useFilters from "./use-filters";

export default function SearchParams() {
  const searchParams = useSearchParams()!;
  const updateSearchParams = useUpdateSearchParams();
  const [filters] = useFilters();
  const code = searchParams.get("code");
  const filtersParam = searchParams.get("filters");
  const accountStore = useAccountStore();

  useEffect(() => {
    if (isOverwolfApp || filters.join(",") === filtersParam) {
      return;
    }

    let filtersString = "";
    if (filters.length === 0) {
      filtersString = "none";
    } else if (filters.length !== ALL_FILTERS.length) {
      filtersString = filters.join(",");
    }
    updateSearchParams("filters", filtersString);
  }, [filters, filtersParam]);

  useEffect(() => {
    if (isOverwolfApp || !code) {
      return;
    }
    updateSearchParams(["code", "state"], ["", ""]);
    fetch(`${API_BASE_URI}/api/patreon/v2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, redirectURI: API_BASE_URI }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          accountStore.setIsPatron(true);
        } else {
          console.log(res);
          alert(res.error ?? "Something went wrong, please try again.");
          accountStore.setIsPatron(false);
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err?.message || "Unexpect error! Please try again.");
      });
  }, [code]);

  useEffect(() => {
    if (accountStore.isPatron) {
      fetch(`${API_BASE_URI}/api/patreon/v2`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            accountStore.setIsPatron(true);
          } else {
            console.log(res);
            accountStore.setIsPatron(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return <></>;
}
