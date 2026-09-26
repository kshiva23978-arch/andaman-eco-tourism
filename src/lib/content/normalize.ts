/**
 * Validation helpers for editable page content. Each takes an unknown value and a
 * fallback, and returns a safe value of the right type — used both when saving
 * (admin input) and when reading (stored data may predate newer fields).
 */

export type Obj = Record<string, unknown>;

export const obj = (v: unknown): Obj =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {};

/** A trimmed string capped at `max`, or the fallback when missing/not a string. */
export function text(v: unknown, fallback: string, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : fallback;
}

/** Site-relative path ("/…") or http(s) URL; anything else (e.g. javascript:) falls back. */
export function url(v: unknown, fallback: string): string {
  const s = text(v, fallback, 500);
  if (s === "") return "";
  return /^\/(?!\/)/.test(s) || /^https?:\/\//i.test(s) ? s : fallback;
}

/** Local media path only ("/images/…", "/uploads/…") — the CSP blocks other hosts anyway. */
export function media(v: unknown, fallback: string): string {
  const s = text(v, fallback, 500);
  if (s === "") return "";
  return /^\/(?!\/)[^\s"'<>()]*$/.test(s) ? s : fallback;
}

/** Material Symbols icon name (lowercase_with_underscores). */
export function icon(v: unknown, fallback: string): string {
  const s = text(v, fallback, 60);
  return /^[a-z0-9_]+$/.test(s) ? s : fallback;
}

export function list<T>(v: unknown, fallback: T[], item: (x: unknown, i: number) => T, max = 20): T[] {
  return Array.isArray(v) ? v.slice(0, max).map(item) : fallback;
}

export function slugs(v: unknown, fallback: string[]): string[] {
  return list(v, fallback, (s) => text(s, "", 120)).filter((s) => /^[a-z0-9-]+$/.test(s));
}

/** Keys holding media paths, links and content slugs; everything else is plain text. */
const MEDIA_KEY = /(image|images|background|video|watermark|photo)$/i;
const URL_KEY = /href$/i;
const SLUG_KEY = /slugs$/i;

/**
 * Normalizes `input` against `defaults` as a template: same keys and types, strings
 * validated as text (or as media paths when the key looks like one), string arrays
 * and object arrays item by item, missing values filled from the defaults.
 */
export function fromDefaults<T>(defaults: T, input: unknown, key = ""): T {
  if (typeof defaults === "string") {
    if (MEDIA_KEY.test(key)) return media(input, defaults) as T;
    if (URL_KEY.test(key)) return url(input, defaults) as T;
    return text(input, defaults, 600) as T;
  }
  if (Array.isArray(defaults) && SLUG_KEY.test(key)) {
    return (Array.isArray(input) ? slugs(input, []) : defaults) as T;
  }
  if (Array.isArray(defaults)) {
    const template = defaults[0];
    if (!Array.isArray(input) || template === undefined) return defaults;
    return input
      .slice(0, 30)
      .map((item) => fromDefaults(typeof template === "string" ? "" : template, item, key))
      .filter((item) => (typeof item === "string" ? item !== "" : true)) as T;
  }
  if (defaults && typeof defaults === "object") {
    const source = obj(input);
    const out: Obj = {};
    for (const [k, v] of Object.entries(defaults as Obj)) out[k] = fromDefaults(v, source[k], k);
    return out as T;
  }
  return defaults;
}

/** Replaces `{count}` in a label. */
export function withCount(label: string, count: number): string {
  return label.replaceAll("{count}", String(count));
}

/** Replaces `{title}` in a label (e.g. "How to reach {title}"). */
export function withTitle(label: string, title: string): string {
  return label.replaceAll("{title}", title);
}
