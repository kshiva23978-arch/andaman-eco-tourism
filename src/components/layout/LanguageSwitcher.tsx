"use client";

import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "ml", label: "മലയാളം" },
  { code: "bn", label: "বাংলা" },
  { code: "te", label: "తెలుగు" },
] as const;

const INCLUDED_LANGUAGE_CODES = LANGUAGES.filter((l) => l.code !== "en")
  .map((l) => l.code)
  .join(",");

const COOKIE_NAME = "googtrans";
const SCRIPT_ID = "google-translate-script";

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new (options: Record<string, unknown>, elementId: string): unknown;
          InlineLayout: { SIMPLE: number };
        };
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

function getStoredLanguageCode(): string {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-zA-Z-]+)/);
  const code = match?.[1];
  return LANGUAGES.some((l) => l.code === code) ? (code as string) : "en";
}

function loadGoogleTranslateScript(onReady: () => void) {
  if (typeof window === "undefined") return;

  if (window.google?.translate) {
    onReady();
    return;
  }

  window.googleTranslateElementInit = () => {
    if (!window.google) return;
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: INCLUDED_LANGUAGE_CODES,
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      },
      "google_translate_element"
    );
    onReady();
  };

  if (document.getElementById(SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  script.referrerPolicy = "no-referrer-when-downgrade";
  document.body.appendChild(script);
}

function setLanguageCookie(code: string) {
  const oneYear = 60 * 60 * 24 * 365;
  if (code === "en") {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  } else {
    document.cookie = `${COOKIE_NAME}=/en/${code}; path=/; max-age=${oneYear}; SameSite=Lax`;
  }
}

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = getStoredLanguageCode();
    setCurrent(stored);
    if (stored !== "en") {
      loadGoogleTranslateScript(() => {});
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(code: string) {
    if (code === current) {
      setOpen(false);
      return;
    }
    setLanguageCookie(code);
    window.location.reload();
  }

  return (
    <div ref={containerRef} className="notranslate relative">
      <div id="google_translate_element" aria-hidden="true" />

      <button
        type="button"
        onClick={() => {
          loadGoogleTranslateScript(() => {});
          setOpen((prev) => !prev);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose language"
        className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
      >
        <span className="material-symbols-outlined text-[20px]">translate</span>
        <span className="uppercase">{current}</span>
        <span className="material-symbols-outlined text-[18px]">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-40 bg-white border border-outline-variant rounded-lg shadow-lg overflow-hidden z-50"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                role="option"
                aria-selected={current === lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full text-left px-4 py-2 font-body-md text-body-md hover:bg-surface-container transition-colors ${
                  current === lang.code
                    ? "text-primary font-bold"
                    : "text-on-surface-variant"
                }`}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
