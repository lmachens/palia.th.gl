"use client";
import Script from "next/script";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useAccountStore } from "../../lib/storage/account";

export default function NitroAds({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const accountStore = useAccountStore();
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");

  useEffect(() => {
    if (state !== "loading" || accountStore.isPatron) {
      return;
    }
    const timeoutId = setTimeout(() => {
      setState("error");
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [state]);

  if (accountStore.isPatron) {
    return <></>;
  }

  return (
    <>
      <Script
        src="https://s.nitropay.com/ads-1487.js"
        onLoad={() => setState("ready")}
        onError={() => {
          setState("error");
        }}
      />
      {state === "ready" && children}
      {state === "error" && fallback}
    </>
  );
}
