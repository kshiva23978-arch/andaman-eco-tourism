"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { logout } from "@/app/admin/login/actions";
import {
  getNotificationsAction,
  searchContentAction,
  type NotificationItem,
  type SearchResult,
} from "@/app/admin/(protected)/shell-actions";

export type NavLink = { href: string; label: string; icon: string };

/** Closes a popover when clicking outside `ref` or pressing Escape. */
function useDismiss(open: boolean, close: () => void, ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, ref]);
}

function timeAgo(iso: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 30 ? `${days}d ago` : new Date(iso).toLocaleDateString();
}

/* ------------------------------------------------------------------ search */

const KIND_META: Record<SearchResult["kind"] | "page", { label: string; icon: string }> = {
  page: { label: "Admin pages", icon: "space_dashboard" },
  destination: { label: "Destinations", icon: "landscape" },
  activity: { label: "Activities", icon: "hiking" },
  section: { label: "Page sections", icon: "article" },
};

type PaletteItem = {
  kind: SearchResult["kind"] | "page";
  title: string;
  subtitle?: string;
  href: string;
  icon: string;
  status?: SearchResult["status"];
};

export function SearchButton({ navLinks }: { navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-black/10 px-2 py-2 text-sm text-on-surface-variant hover:bg-black/5 sm:px-3"
        aria-label="Search content"
      >
        <span className="material-symbols-outlined text-[18px]">search</span>
        <span className="hidden sm:inline">Search content…</span>
        <kbd className="hidden rounded border border-black/15 px-1.5 text-[10px] font-semibold md:inline">
          Ctrl K
        </kbd>
      </button>
      {open && <SearchPalette navLinks={navLinks} onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchPalette({ navLinks, onClose }: { navLinks: NavLink[]; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const latest = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function onQueryChange(value: string) {
    setQuery(value);
    setActive(0);
    if (timer.current) clearTimeout(timer.current);
    const q = value.trim();
    const id = ++latest.current;
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Debounced; `latest` drops responses that arrive after a newer keystroke.
    timer.current = setTimeout(async () => {
      try {
        const found = await searchContentAction(q);
        if (id === latest.current) setResults(found);
      } catch {
        if (id === latest.current) setResults([]);
      } finally {
        if (id === latest.current) setLoading(false);
      }
    }, 200);
  }

  const q = query.trim().toLowerCase();
  const pageMatches: PaletteItem[] = navLinks
    .filter((l) => !q || l.label.toLowerCase().includes(q))
    .map((l) => ({ kind: "page", title: l.label, href: l.href, icon: l.icon }));
  const items: PaletteItem[] = [
    ...pageMatches,
    ...results.map((r) => ({ ...r, icon: KIND_META[r.kind].icon })),
  ];
  const activeIndex = Math.min(active, Math.max(0, items.length - 1));

  function go(item: PaletteItem) {
    onClose();
    router.push(item.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && items[activeIndex]) {
      e.preventDefault();
      go(items[activeIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 px-4 pt-[12vh]"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl"
        role="dialog"
        aria-label="Search content"
      >
        <div className="flex items-center gap-3 border-b border-black/10 px-4">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search destinations, activities, sections…"
            className="h-14 flex-1 bg-transparent text-[15px] text-on-surface outline-none"
          />
          {loading && (
            <span className="material-symbols-outlined animate-spin text-[18px] text-on-surface-variant">
              progress_activity
            </span>
          )}
          <kbd className="rounded border border-black/15 px-1.5 text-[10px] font-semibold text-on-surface-variant">
            Esc
          </kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {items.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-on-surface-variant">
              {q.length < 2 ? "Type at least 2 characters to search content." : loading ? "Searching…" : "No matches."}
            </p>
          )}
          {items.map((item, i) => {
            const header = item.kind !== items[i - 1]?.kind ? KIND_META[item.kind].label : null;
            return (
              <div key={`${item.kind}-${item.href}-${item.title}`}>
                {header && (
                  <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                    {header}
                  </p>
                )}
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(item)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                    i === activeIndex ? "bg-secondary-container" : "hover:bg-black/5"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-secondary">{item.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-on-surface">{item.title}</span>
                    {item.subtitle && (
                      <span className="block truncate text-xs text-on-surface-variant">{item.subtitle}</span>
                    )}
                  </span>
                  {item.status && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.status === "PUBLISHED"
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-[#fdecd2] text-[#8a5a00]"
                      }`}
                    >
                      {item.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- notifications */

const SEVERITY_ICON: Record<NotificationItem["severity"], { icon: string; className: string }> = {
  INFO: { icon: "info", className: "bg-secondary-container text-secondary" },
  WARNING: { icon: "warning", className: "bg-[#fdecd2] text-[#8a5a00]" },
  CRITICAL: { icon: "gpp_bad", className: "bg-error-container text-error" },
};

export function NotificationsMenu({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const storageKey = `admin-notifications-seen:${userId}`;
  // Items only arrive after mount, so reading storage here can't cause a hydration mismatch.
  const [lastSeen, setLastSeen] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      return Number(localStorage.getItem(storageKey)) || 0;
    } catch {
      return 0; // storage unavailable — everything counts as unread
    }
  });
  const [loading, startLoading] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    startLoading(async () => {
      try {
        setItems(await getNotificationsAction());
      } catch {
        setItems([]);
      }
    });
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 60_000);
    return () => clearInterval(timer);
  }, [load]);

  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);

  const unread = (items ?? []).filter((n) => new Date(n.createdAt).getTime() > lastSeen).length;

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      load();
    } else {
      markSeen();
    }
  }

  function markSeen() {
    const now = Date.now();
    setLastSeen(now);
    try {
      localStorage.setItem(storageKey, String(now));
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        className="relative rounded-lg p-2 text-on-surface-variant hover:bg-black/5"
        aria-label={unread ? `Notifications (${unread} new)` : "Notifications"}
        aria-expanded={open}
      >
        <span className="material-symbols-outlined">notifications</span>
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e8734a] px-1 text-[10px] font-bold leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
            <p className="text-sm font-semibold text-on-surface">Recent activity</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markSeen}
                className="text-xs font-semibold text-secondary hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {items === null || (loading && items.length === 0) ? (
              <p className="px-4 py-8 text-center text-sm text-on-surface-variant">Loading…</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-on-surface-variant">Nothing yet.</p>
            ) : (
              items.map((n) => {
                const isNew = new Date(n.createdAt).getTime() > lastSeen;
                const sev = SEVERITY_ICON[n.severity];
                return (
                  <div
                    key={n.id}
                    className={`flex gap-3 border-b border-black/5 px-4 py-3 last:border-0 ${
                      isNew ? "bg-secondary-container/30" : ""
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${sev.className}`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{sev.icon}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-on-surface">{n.message}</p>
                      <p className="mt-0.5 truncate text-xs text-on-surface-variant">
                        {n.actor} · {timeAgo(n.createdAt)}
                      </p>
                    </div>
                    {isNew && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#e8734a]" />}
                  </div>
                );
              })
            )}
          </div>
          <Link
            href="/admin/logs"
            onClick={() => {
              markSeen();
              setOpen(false);
            }}
            className="block border-t border-black/10 px-4 py-2.5 text-center text-sm font-semibold text-secondary hover:bg-black/5"
          >
            View all logs
          </Link>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- profile */

export function ProfileMenu({
  name,
  email,
  role,
  canManageSettings,
}: {
  name: string;
  email: string;
  role: string;
  canManageSettings: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, ref);

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const itemClass =
    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-on-surface hover:bg-black/5";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-lg border border-black/10 py-1.5 pl-1.5 pr-2 hover:bg-black/5"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {initials}
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-xs font-semibold text-on-surface">{name}</span>
          <span className="block text-[11px] text-on-surface-variant">{role}</span>
        </span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl"
        >
          <div className="border-b border-black/10 px-4 py-3">
            <p className="truncate text-sm font-semibold text-on-surface">{name}</p>
            <p className="truncate text-xs text-on-surface-variant">{email}</p>
            <span className="mt-2 inline-block rounded-full bg-secondary-container px-2 py-0.5 text-[11px] font-semibold text-on-secondary-container">
              {role}
            </span>
          </div>
          <div className="py-1">
            {canManageSettings && (
              <Link href="/admin/settings" role="menuitem" onClick={close} className={itemClass}>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">settings</span>
                Settings
              </Link>
            )}
            <Link href="/" target="_blank" role="menuitem" onClick={close} className={itemClass}>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">open_in_new</span>
              View public site
            </Link>
          </div>
          <form action={logout} className="border-t border-black/10 py-1">
            <button type="submit" role="menuitem" className={`${itemClass} text-error`}>
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
