import { prisma } from "@/lib/prisma";
import { normalizeHome } from "@/lib/content/home";
import { HomeEditorClient } from "./HomeEditorClient";

export default async function AdminHomePageEditor() {
  const optionSelect = { slug: true, title: true, status: true } as const;
  const [row, destinations, activities] = await Promise.all([
    prisma.pageContent.findUnique({ where: { key: "home" } }),
    prisma.destination.findMany({ select: optionSelect, orderBy: { title: "asc" } }),
    prisma.activity.findMany({ select: optionSelect, orderBy: { title: "asc" } }),
  ]);

  return (
    <HomeEditorClient
      initialContent={normalizeHome(row?.data)}
      lastSaved={row?.updatedAt.toISOString() ?? null}
      options={{ destinations, activities }}
    />
  );
}
