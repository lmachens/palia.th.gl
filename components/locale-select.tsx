"use client";
import Link from "next/link";
import { useState } from "react";
import { useI18N } from "./(i18n)/i18n-provider";
import Popover from "./popover";

import { isOverwolfApp } from "@/lib/env";
import { useSettingsStore } from "@/lib/storage/settings";
import { cn } from "@/lib/utils";
import "/node_modules/flag-icons/css/flag-icons.min.css";

const getFlagCode = (locale: string) => {
  if (locale === "en") {
    return "us";
  }
  if (locale === "ja") {
    return "jp";
  }
  if (locale === "ko") {
    return "kr";
  }
  if (locale === "pt-br") {
    return "br";
  }
  if (locale === "zh-hans") {
    return "cn";
  }
  if (locale === "zh-hant") {
    return "cn";
  }
  return locale;
};

export default function LocaleSelect({ className }: { className?: string }) {
  const i18n = useI18N();
  const [isOpen, setIsOpen] = useState(false);
  const settingsStore = useSettingsStore();

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      forceMount
      trigger={
        <button
          aria-label={i18n.locale}
          className={cn(
            "hover:bg-white/20 transition-colors p-2 flex border rounded-lg"
          )}
        >
          <span
            className={`fi fi-${getFlagCode(i18n.locale)} ${className ?? ""}`}
          />
        </button>
      }
    >
      <nav className="flex border rounded border-gray-600 bg-neutral-900 gap-3 p-2">
        {i18n.locales
          .filter((locale) => locale !== i18n.locale)
          .map((locale) => (
            <Link
              key={locale}
              href={`/${locale}`}
              onClick={(event) => {
                setIsOpen(false);
                if (isOverwolfApp) {
                  settingsStore.setLocale(locale);
                  event.preventDefault();
                }
              }}
              className="text-xl"
              prefetch={false}
            >
              <span className={`fi fi-${getFlagCode(locale)}`} />
            </Link>
          ))}
      </nav>
    </Popover>
  );
}
