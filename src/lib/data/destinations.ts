import type { Destination } from "@/lib/types";
import raw from "./destinations.generated.json";

/**
 * Initial destination data, used only by `prisma/seed.ts` to fill a fresh database.
 * The site reads destinations from the database (see destinations-db.ts).
 */
export const destinations = raw as Destination[];
