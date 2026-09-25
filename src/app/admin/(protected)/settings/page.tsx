import { prisma } from "@/lib/prisma";
import { SettingsForm, type SettingsValues } from "./SettingsForm";

const DEFAULTS: SettingsValues = {
  site_name: "Andaman & Nicobar Ecotourism",
  tagline: "Official ecotourism portal — Department of Environment & Forests",
  support_email: "support@doef.gov.in",
  timezone: "Asia/Kolkata",
  maintenance_mode: "false",
  meta_title_template: "%s | Andaman & Nicobar Ecotourism",
  meta_description:
    "Official ecotourism portal for the Andaman & Nicobar Islands — destinations, activities, permits and conservation guidelines from the Department of Environment & Forests.",
  gsc_verification: "8XuMI2ugyPXGQoeclpGx9fDlFWOOGa8ahFXWB890hsY",
  require_2fa: "true",
  session_timeout_minutes: "30",
  ip_allowlist: "",
  analytics_provider: "none",
  map_provider: "leaflet",
  webhook_url: "",
};

export default async function AdminSettingsPage() {
  const rows = await prisma.siteSetting.findMany();
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const values: SettingsValues = { ...DEFAULTS, ...stored };

  return <SettingsForm initialValues={values} />;
}
