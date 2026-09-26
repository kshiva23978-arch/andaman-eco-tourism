"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/admin/login/actions";
import { NotificationsMenu, ProfileMenu, SearchButton } from "./HeaderControls";

const NAV_SECTIONS: {
  label: string;
  items: { href: string; label: string; icon: string }[];
}[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: "dashboard" }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/destinations", label: "Destinations", icon: "landscape" },
      { href: "/admin/activities", label: "Activities", icon: "hiking" },
      { href: "/admin/pages", label: "Pages & Sections", icon: "article" },
      { href: "/admin/media", label: "Media Library", icon: "perm_media" },
    ],
  },
  {
    label: "Administration",
    items: [
      { href: "/admin/users", label: "Users & Roles", icon: "group" },
      { href: "/admin/logs", label: "Logs & Audit", icon: "receipt_long" },
      { href: "/admin/settings", label: "Settings", icon: "settings" },
    ],
  },
];

export function AdminShell({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    canViewLogs: boolean;
    canManageSettings: boolean;
  };
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const currentLabel =
    NAV_SECTIONS.flatMap((s) => s.items).find((i) => isActive(i.href))?.label ??
    "Dashboard";

  return (
    <div className="min-h-screen bg-[#f3f5f2] font-body-md text-on-surface">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-black/10 bg-[#0f2b1e] text-white transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-white">
            <span className="material-symbols-outlined text-[20px]">eco</span>
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-white">Ecotourism Admin</p>
            <p className="text-xs text-white/50">Andaman &amp; Nicobar DoEF</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-5">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                {section.label}
              </p>
              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-secondary/90 text-white font-semibold"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-1 border-t border-white/10 px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
            View public site
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/70 hover:bg-white/10 hover:text-white"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-black/10 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-on-surface hover:bg-black/5 lg:hidden"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <p className="text-xs text-on-surface-variant">Admin panel</p>
              <h1 className="font-headline-md text-headline-md leading-none text-primary">
                {currentLabel}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <SearchButton navLinks={NAV_SECTIONS.flatMap((s) => s.items)} />
            {currentUser.canViewLogs && <NotificationsMenu userId={currentUser.id} />}
            <ProfileMenu
              name={currentUser.name}
              email={currentUser.email}
              role={currentUser.role}
              canManageSettings={currentUser.canManageSettings}
            />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
