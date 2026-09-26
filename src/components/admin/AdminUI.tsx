"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Image from "next/image";
import { hexToRgba } from "@/lib/color";
import { isVideoPath } from "@/lib/uploads";
import { listMediaAction, type MediaOption } from "@/app/admin/(protected)/media/actions";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-black/10 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendUp = true,
}: {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            {label}
          </p>
          <p className="mt-2 font-headline-lg text-headline-lg text-primary">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-container text-secondary">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      {trend && (
        <p
          className={`mt-3 flex items-center gap-1 text-xs font-medium ${
            trendUp ? "text-secondary" : "text-error"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {trendUp ? "trending_up" : "trending_down"}
          </span>
          {trend}
        </p>
      )}
    </Card>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-black/5 text-on-surface-variant",
    success: "bg-secondary-container text-on-secondary-container",
    warning: "bg-[#fdecd2] text-[#8a5a00]",
    danger: "bg-error-container text-on-error-container",
    info: "bg-primary-fixed text-on-primary-fixed",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export type ContentStatus = "PUBLISHED" | "DRAFT";

/** Draft / Published switch for content rows. `compact` is the inline table variant. */
export function StatusSwitch({
  status,
  onChange,
  disabled = false,
  compact = false,
}: {
  status: ContentStatus;
  onChange: (status: ContentStatus) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const published = status === "PUBLISHED";

  if (compact) {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={published}
        disabled={disabled}
        onClick={() => onChange(published ? "DRAFT" : "PUBLISHED")}
        title={published ? "Published — click to unpublish" : "Draft — click to publish"}
        className="inline-flex items-center gap-2 disabled:opacity-50"
      >
        <span
          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
            published ? "bg-secondary" : "bg-black/20"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
              published ? "left-[18px]" : "left-0.5"
            }`}
          />
        </span>
        <Badge tone={published ? "success" : "warning"}>{published ? "Published" : "Draft"}</Badge>
      </button>
    );
  }

  const options: { value: ContentStatus; label: string; icon: string }[] = [
    { value: "DRAFT", label: "Draft", icon: "edit_note" },
    { value: "PUBLISHED", label: "Published", icon: "public" },
  ];

  return (
    <div className="flex gap-1 rounded-lg bg-black/5 p-1" role="radiogroup" aria-label="Status">
      {options.map((opt) => {
        const active = status === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => !active && onChange(opt.value)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
              active
                ? opt.value === "PUBLISHED"
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-white text-[#8a5a00] shadow-sm"
                : "text-on-surface-variant hover:bg-white/60"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="font-headline-md text-headline-md text-primary">{title}</h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-on-surface-variant">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  icon,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#00263f] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  icon,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-5 py-3">
      <p className="text-xs text-on-surface-variant">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-on-surface-variant hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold transition-colors ${
              p === page ? "bg-primary text-white" : "text-on-surface-variant hover:bg-black/5"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 text-on-surface-variant hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

export function IconButton({
  icon,
  onClick,
  tone = "neutral",
  title,
}: {
  icon: string;
  onClick?: () => void;
  tone?: "neutral" | "danger";
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 transition-colors hover:bg-black/5 ${
        tone === "danger" ? "text-error hover:bg-error-container" : "text-on-surface-variant"
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide = false,
  size,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
  /** Overrides `wide` when set. */
  size?: "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const resolvedSize = size ?? (wide ? "lg" : "md");
  const sizeClass = { md: "max-w-md", lg: "max-w-2xl", xl: "max-w-4xl" }[resolvedSize];

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 sm:pt-16">
      <div className={`w-full ${sizeClass} rounded-xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h3 className="font-headline-md text-lg font-semibold text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-black/5"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-black/10 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4 block last:mb-0">
      <span className="mb-1.5 block text-sm font-semibold text-on-surface">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-on-surface-variant">{hint}</span>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary";

/** Horizontal tab strip for switching between sections of a longer editor (e.g. inside a modal). */
export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly T[];
  active: T;
  onChange: (tab: T) => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-1 border-b border-black/10">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`-mb-px rounded-t-lg border-b-2 px-3.5 py-2 text-sm font-semibold transition-colors ${
            active === tab
              ? "border-secondary text-secondary"
              : "border-transparent text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/** Editable list of plain text lines — used for things like eco guidelines, safety tips, "what to see". */
export function TagListEditor({
  items,
  onChange,
  placeholder = "Add an item…",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  }

  return (
    <div>
      <ul className="mb-2 flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-2 rounded-lg border border-black/10 bg-black/[0.02] px-3 py-2 text-sm text-on-surface"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-on-surface-variant hover:bg-black/10 hover:text-error"
              aria-label={`Remove ${item}`}
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="rounded-lg border border-dashed border-black/15 px-3 py-2 text-sm text-on-surface-variant">
            Nothing added yet.
          </li>
        )}
      </ul>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className={inputClass}
        />
        <SecondaryButton icon="add" onClick={add}>
          Add
        </SecondaryButton>
      </div>
    </div>
  );
}

/** Path to an image or video (e.g. copied from the Media Library) with a small preview. */
export function MediaInput({
  value,
  onChange,
  kind = "image",
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  kind?: "image" | "video";
  placeholder?: string;
}) {
  const previewable = /^\/(?!\/)\S+$/.test(value);
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black/5 text-on-surface-variant">
        {!previewable ? (
          <span className="material-symbols-outlined text-[22px]">
            {kind === "video" ? "movie" : "image"}
          </span>
        ) : kind === "video" ? (
          <video src={value} muted playsInline preload="metadata" className="h-full w-full object-cover" />
        ) : (
          <Image src={value} alt="" fill sizes="96px" className="object-cover" />
        )}
      </div>
      <input
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? (kind === "video" ? "/videos/… or /uploads/…" : "/images/… or /uploads/…")}
      />
    </div>
  );
}

export type SlugOption = { slug: string; title: string; status: ContentStatus };

/**
 * Ordered list of links to existing content, picked by typing a title or slug.
 * Only existing slugs can be added; ones that no longer exist are flagged so they
 * can be removed.
 */
export function SlugPicker({
  value,
  onChange,
  options,
  placeholder = "Search by name or slug…",
  exclude = [],
}: {
  value: string[];
  onChange: (value: string[]) => void;
  options: SlugOption[];
  placeholder?: string;
  /** Slugs that can't be picked (e.g. the item being edited). */
  exclude?: string[];
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();

  const bySlug = new Map(options.map((o) => [o.slug, o]));
  const q = query.trim().toLowerCase();
  const suggestions = options
    .filter((o) => !value.includes(o.slug) && !exclude.includes(o.slug))
    .filter((o) => !q || o.title.toLowerCase().includes(q) || o.slug.includes(q))
    .slice(0, 8);
  const activeIndex = Math.min(active, Math.max(0, suggestions.length - 1));

  function add(slug: string) {
    onChange([...value, slug]);
    setQuery("");
    setActive(0);
  }

  function move(i: number, dir: -1 | 1) {
    const target = i + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  }

  return (
    <div>
      <ul className="mb-2 flex flex-col gap-1.5">
        {value.map((slug, i) => {
          const option = bySlug.get(slug);
          return (
            <li
              key={slug}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                option ? "border-black/10 bg-black/[0.02]" : "border-error/40 bg-error-container/40"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-on-surface">
                  {option ? option.title : slug}
                  {option?.status === "DRAFT" && (
                    <span className="ml-2 rounded-full bg-[#fdecd2] px-2 py-0.5 text-[10px] font-semibold text-[#8a5a00]">
                      Draft — hidden on site
                    </span>
                  )}
                </p>
                <p className={`truncate text-xs ${option ? "text-on-surface-variant" : "text-error"}`}>
                  {option ? slug : "Not found — this link is skipped on the site"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-on-surface-variant hover:bg-black/10 disabled:opacity-30"
                aria-label={`Move ${option?.title ?? slug} up`}
              >
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-on-surface-variant hover:bg-black/10 disabled:opacity-30"
                aria-label={`Move ${option?.title ?? slug} down`}
              >
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </button>
              <button
                type="button"
                onClick={() => onChange(value.filter((s) => s !== slug))}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-on-surface-variant hover:bg-black/10 hover:text-error"
                aria-label={`Remove ${option?.title ?? slug}`}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </li>
          );
        })}
        {value.length === 0 && (
          <li className="rounded-lg border border-dashed border-black/15 px-3 py-2 text-sm text-on-surface-variant">
            Nothing added yet.
          </li>
        )}
      </ul>

      <div className="relative">
        <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
          search
        </span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          // Delay so a click on a suggestion lands before the list closes.
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(i + 1, suggestions.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (suggestions[activeIndex]) add(suggestions[activeIndex].slug);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          className={`${inputClass} pl-9`}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
        />
        {open && (
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-lg border border-black/10 bg-white py-1 shadow-lg"
          >
            {suggestions.length === 0 ? (
              <li className="px-3 py-2.5 text-sm text-on-surface-variant">
                {q ? "No matches." : "Everything is already added."}
              </li>
            ) : (
              suggestions.map((o, i) => (
                <li key={o.slug} role="option" aria-selected={i === activeIndex}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => add(o.slug)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left ${
                      i === activeIndex ? "bg-secondary-container" : "hover:bg-black/5"
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-on-surface">{o.title}</span>
                      <span className="block truncate text-xs text-on-surface-variant">{o.slug}</span>
                    </span>
                    {o.status === "DRAFT" && (
                      <span className="shrink-0 rounded-full bg-[#fdecd2] px-2 py-0.5 text-[10px] font-semibold text-[#8a5a00]">
                        Draft
                      </span>
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export type InfoCard = { icon: string; title: string; body: string };

/** Editable list of icon + title + body cards — the "info cards" used for eco guidelines,
 * homepage feature grids, activity guideline callouts, etc. */
export function CardListEditor({
  items,
  onChange,
}: {
  items: InfoCard[];
  onChange: (items: InfoCard[]) => void;
}) {
  function update(i: number, patch: Partial<InfoCard>) {
    onChange(items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function add() {
    onChange([...items, { icon: "eco", title: "", body: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((card, i) => (
        <div key={i} className="rounded-lg border border-black/10 p-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined flex h-8 w-8 items-center justify-center rounded-md bg-secondary-container text-secondary">
              {card.icon || "eco"}
            </span>
            <input
              value={card.icon}
              onChange={(e) => update(i, { icon: e.target.value })}
              placeholder="material icon name"
              className={`${inputClass} max-w-[160px] text-xs`}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-error-container hover:text-error"
              aria-label="Remove card"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
          <input
            value={card.title}
            onChange={(e) => update(i, { title: e.target.value })}
            placeholder="Card title"
            className={`${inputClass} mb-2`}
          />
          <textarea
            value={card.body}
            onChange={(e) => update(i, { body: e.target.value })}
            placeholder="Card body copy"
            className={`${inputClass} min-h-[64px] resize-y`}
          />
        </div>
      ))}
      <SecondaryButton icon="add" onClick={add}>
        Add card
      </SecondaryButton>
    </div>
  );
}

export type BackgroundConfig = {
  /** "plain" = no custom background; the page's default styling applies. */
  type: "image" | "color" | "plain";
  image: string;
  color: string;
  overlay: { enabled: boolean; color: string; opacity: number };
};

export const DEFAULT_BACKGROUND: BackgroundConfig = {
  type: "image",
  image: "/images/alternate/alternate-image-destinations.jpg",
  color: "#0f2b1e",
  overlay: { enabled: true, color: "#000000", opacity: 45 },
};

export { hexToRgba };

/** Inline style for the element the background sits on (image or flat color). */
export function backgroundStyle(bg: BackgroundConfig): React.CSSProperties {
  if (bg.type === "plain") return {};
  if (bg.type === "color") {
    return { backgroundColor: bg.color };
  }
  return {
    backgroundImage: `url(${bg.image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

/** Inline style for the overlay tint layer stacked on top of the background. */
export function overlayStyle(bg: BackgroundConfig): React.CSSProperties {
  if (bg.type === "plain" || !bg.overlay.enabled) return { background: "transparent" };
  return { background: hexToRgba(bg.overlay.color, bg.overlay.opacity) };
}

/** Full background control: choose image vs. flat color, plus an optional tint overlay
 * for text legibility. Used anywhere a section/page/card background is configurable. */
export function BackgroundEditor({
  value,
  onChange,
  allowPlain = false,
}: {
  value: BackgroundConfig;
  onChange: (value: BackgroundConfig) => void;
  /** Offer a "Plain" option that clears the custom background entirely. */
  allowPlain?: boolean;
}) {
  function patch(p: Partial<BackgroundConfig>) {
    onChange({ ...value, ...p });
  }

  function patchOverlay(p: Partial<BackgroundConfig["overlay"]>) {
    onChange({ ...value, overlay: { ...value.overlay, ...p } });
  }

  const options: { type: BackgroundConfig["type"]; icon: string; label: string }[] = [
    { type: "image", icon: "image", label: "Image" },
    { type: "color", icon: "palette", label: "Solid color" },
    ...(allowPlain ? [{ type: "plain" as const, icon: "format_color_reset", label: "Plain" }] : []),
  ];

  return (
    <div>
      <div className="mb-3 flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.type}
            type="button"
            onClick={() => patch({ type: opt.type })}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              value.type === opt.type
                ? "border-secondary bg-secondary-container text-on-secondary-container"
                : "border-black/15 text-on-surface-variant hover:bg-black/5"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {value.type === "plain" ? (
        <p className="rounded-lg border border-dashed border-black/15 px-3 py-4 text-center text-sm text-on-surface-variant">
          No background — the page&apos;s default styling is used.
        </p>
      ) : value.type === "image" ? (
        <ImageField value={value.image} onChange={(image) => patch({ image })} />
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value.color}
            onChange={(e) => patch({ color: e.target.value })}
            className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-black/15 bg-white p-1"
            aria-label="Background color"
          />
          <input
            className={`${inputClass} max-w-[160px] font-mono uppercase`}
            value={value.color}
            onChange={(e) => patch({ color: e.target.value })}
            placeholder="#0F2B1E"
          />
          <div
            className="h-11 flex-1 rounded-lg border border-black/10"
            style={{ backgroundColor: value.color }}
          />
        </div>
      )}

      {value.type !== "plain" && (
        <div className="mt-4 rounded-lg border border-black/10 p-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-on-surface">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={value.overlay.enabled}
              onChange={(e) => patchOverlay({ enabled: e.target.checked })}
            />
            Color overlay
            <span className="font-normal text-on-surface-variant">
              (tint on top, for text legibility)
            </span>
          </label>
  
          {value.overlay.enabled && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <input
                type="color"
                value={value.overlay.color}
                onChange={(e) => patchOverlay({ color: e.target.value })}
                className="h-9 w-12 shrink-0 cursor-pointer rounded-lg border border-black/15 bg-white p-1"
                aria-label="Overlay color"
              />
              <div className="flex flex-1 items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value.overlay.opacity}
                  onChange={(e) => patchOverlay({ opacity: Number(e.target.value) })}
                  className="flex-1"
                />
                <span className="w-10 shrink-0 text-right text-xs font-semibold text-on-surface-variant">
                  {value.overlay.opacity}%
                </span>
              </div>
              <div
                className="h-9 w-16 shrink-0 rounded-lg border border-black/10"
                style={{ background: hexToRgba(value.overlay.color, value.overlay.opacity) }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Editable image gallery — add by path/URL, preview, reorder, remove. Used wherever a
 * destination, activity or page section has its own image set (separate from the shared media library). */
export function GalleryEditor({
  images,
  titles,
  onChange,
}: {
  images: string[];
  /** When provided, each image gets an editable title (kept index-aligned with `images`). */
  titles?: string[];
  onChange: (images: string[], titles: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const withTitles = titles !== undefined;
  const currentTitles = images.map((_, i) => titles?.[i] ?? "");

  function add() {
    const value = draft.trim();
    if (!value) return;
    onChange([...images, value], [...currentTitles, ""]);
    setDraft("");
  }

  function remove(i: number) {
    onChange(
      images.filter((_, idx) => idx !== i),
      currentTitles.filter((_, idx) => idx !== i),
    );
  }

  function move(i: number, dir: -1 | 1) {
    const target = i + dir;
    if (target < 0 || target >= images.length) return;
    const nextImages = [...images];
    const nextTitles = [...currentTitles];
    [nextImages[i], nextImages[target]] = [nextImages[target], nextImages[i]];
    [nextTitles[i], nextTitles[target]] = [nextTitles[target], nextTitles[i]];
    onChange(nextImages, nextTitles);
  }

  function setTitle(i: number, value: string) {
    onChange(images, currentTitles.map((t, idx) => (idx === i ? value : t)));
  }

  return (
    <div>
      <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="flex flex-col gap-1.5">
            <div className="group relative aspect-square overflow-hidden rounded-lg bg-black/5">
              <Image src={src} alt={currentTitles[i]} fill sizes="120px" className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-on-surface"
                  aria-label="Move earlier"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-error"
                  aria-label="Remove image"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-on-surface"
                  aria-label="Move later"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
            {withTitles && (
              <input
                value={currentTitles[i]}
                onChange={(e) => setTitle(i, e.target.value)}
                placeholder="Image title"
                aria-label={`Title for image ${i + 1}`}
                className="w-full rounded-md border border-black/15 bg-white px-2 py-1.5 text-xs text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            )}
          </div>
        ))}
        {images.length === 0 && (
          <p className="col-span-full rounded-lg border border-dashed border-black/15 px-3 py-6 text-center text-sm text-on-surface-variant">
            No gallery images yet.
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Paste an image path, or pick from Media Library"
          className={inputClass}
        />
        <SecondaryButton icon="add_photo_alternate" onClick={add}>
          Add
        </SecondaryButton>
        <SecondaryButton icon="photo_library" onClick={() => setPickerOpen(true)}>
          Browse
        </SecondaryButton>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(path) => {
          onChange([...images, path], [...currentTitles, ""]);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

/** Searchable modal for picking an existing image from the Media Library. */
export function MediaPickerModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
}) {
  const [items, setItems] = useState<MediaOption[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    listMediaAction()
      .then((data) => {
        setItems(data);
        setError(null);
      })
      .catch(() => setError("Couldn't load the media library."));
  }, [open]);

  const filtered = useMemo(() => {
    const images = (items ?? []).filter((m) => m.kind === "image");
    const q = query.trim().toLowerCase();
    return q ? images.filter((m) => m.name.toLowerCase().includes(q) || m.path.toLowerCase().includes(q)) : images;
  }, [items, query]);

  return (
    <Modal open={open} onClose={onClose} title="Choose from Media Library" wide>
      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
          search
        </span>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by file name…"
          className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 pl-9 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {error && <p className="py-8 text-center text-sm text-error">{error}</p>}

      {!error && items === null && (
        <p className="py-10 text-center text-sm text-on-surface-variant">Loading…</p>
      )}

      {!error && items !== null && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {filtered.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.path)}
              title={m.path}
              className="group relative aspect-square overflow-hidden rounded-lg border border-black/10 bg-black/5 transition-colors hover:border-secondary"
            >
              <Image src={m.path} alt={m.name} fill sizes="160px" className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1.5 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                {m.name}
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-on-surface-variant">
              No images match your search.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}

/** Thumbnail + path input + Media Library picker, for a single image field. */
export function ImageField({
  value,
  onChange,
  placeholder = "/images/…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-black/5">
        {value && !isVideoPath(value) && (
          <Image src={value} alt="" fill sizes="128px" className="object-cover" />
        )}
      </div>
      <div className="flex flex-1 gap-2">
        <input
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <SecondaryButton icon="photo_library" onClick={() => setPickerOpen(true)}>
          Browse
        </SecondaryButton>
      </div>

      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(path) => {
          onChange(path);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
