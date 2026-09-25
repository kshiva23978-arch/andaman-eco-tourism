"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PageLoader } from "@/components/ui/PageLoader";

/** Admin routes render their own shell — the public header/footer/loader never apply there. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <PageLoader />
      <SiteHeader />
      <main className="flex-grow">{children}</main>
      <SiteFooter />
    </>
  );
}
