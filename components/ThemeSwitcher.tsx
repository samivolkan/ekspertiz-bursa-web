"use client";

import { useSyncExternalStore } from "react";

export const THEME_STORAGE_KEY = "ekspertiz_bursa_theme_v1";

type Theme = "amber" | "red";

const THEME_EVENT = "ekspertiz-bursa-theme-change";

function isTheme(value: string | null): value is Theme {
  return value === "amber" || value === "red";
}

function readTheme(): Theme {
  const current = document.documentElement.dataset.theme ?? null;
  return isTheme(current) ? current : "red";
}

function readServerTheme(): Theme {
  return "red";
}

function subscribe(onStoreChange: () => void) {
  const handleThemeChange = () => onStoreChange();
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    document.documentElement.dataset.theme = isTheme(event.newValue) ? event.newValue : "red";
    onStoreChange();
  };

  window.addEventListener(THEME_EVENT, handleThemeChange);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, handleThemeChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function chooseTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The visual choice still applies when browser storage is unavailable.
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, readServerTheme);

  return (
    <div className={`theme-switcher ${className}`.trim()} role="group" aria-label="Site renk teması">
      <span className="theme-switcher-label">Tema</span>
      <button
        type="button"
        className="theme-choice"
        aria-pressed={theme === "amber"}
        aria-label="Kehribar, siyah ve beyaz temayı kullan"
        data-event="theme_amber_select"
        data-theme-choice="amber"
        onClick={() => chooseTheme("amber")}
      >
        <span className="theme-swatch theme-swatch-amber" aria-hidden="true" />
        <span>Kehribar</span>
      </button>
      <button
        type="button"
        className="theme-choice"
        aria-pressed={theme === "red"}
        aria-label="Kırmızı, siyah ve beyaz temayı kullan"
        data-event="theme_red_select"
        data-theme-choice="red"
        onClick={() => chooseTheme("red")}
      >
        <span className="theme-swatch theme-swatch-red" aria-hidden="true" />
        <span>Kırmızı</span>
      </button>
    </div>
  );
}
