"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, PageHeader, PrimaryButton, Badge, FormField, inputClass } from "@/components/admin/AdminUI";
import { saveSettingsAction } from "./actions";

const TABS = ["General", "SEO", "Security", "Integrations"] as const;
type Tab = (typeof TABS)[number];

export type SettingsValues = {
  site_name: string;
  tagline: string;
  support_email: string;
  timezone: string;
  maintenance_mode: string;
  meta_title_template: string;
  meta_description: string;
  gsc_verification: string;
  require_2fa: string;
  session_timeout_minutes: string;
  ip_allowlist: string;
  analytics_provider: string;
  map_provider: string;
  webhook_url: string;
};

export function SettingsForm({ initialValues }: { initialValues: SettingsValues }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("General");
  const [values, setValues] = useState<SettingsValues>(initialValues);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof SettingsValues>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await saveSettingsAction(values);
        setSavedAt(new Date().toLocaleTimeString());
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't save settings.");
      }
    });
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Site-wide configuration, stored in the database."
        actions={
          <PrimaryButton icon="save" onClick={save}>
            {pending ? "Saving…" : "Save changes"}
          </PrimaryButton>
        }
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-error-container px-4 py-2.5 text-sm font-medium text-on-error-container">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}
      {savedAt && !error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-secondary-container px-4 py-2.5 text-sm font-medium text-on-secondary-container">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          Saved to the database at {savedAt}.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                tab === t
                  ? "bg-primary text-white"
                  : "bg-white text-on-surface-variant border border-black/10 hover:bg-black/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <Card className="p-6">
          {tab === "General" && (
            <div>
              <FormField label="Site name">
                <input
                  className={inputClass}
                  value={values.site_name}
                  onChange={(e) => set("site_name", e.target.value)}
                />
              </FormField>
              <FormField label="Tagline">
                <input
                  className={inputClass}
                  value={values.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                />
              </FormField>
              <FormField label="Support email">
                <input
                  className={inputClass}
                  type="email"
                  value={values.support_email}
                  onChange={(e) => set("support_email", e.target.value)}
                />
              </FormField>
              <FormField label="Default timezone">
                <select
                  className={inputClass}
                  value={values.timezone}
                  onChange={(e) => set("timezone", e.target.value)}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                </select>
              </FormField>
              <FormField label="Maintenance mode" hint="Show a holding page to visitors while you make changes.">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={values.maintenance_mode === "true"}
                    onChange={(e) => set("maintenance_mode", e.target.checked ? "true" : "false")}
                  />
                  <span className="text-sm text-on-surface-variant">Enable maintenance mode</span>
                </label>
              </FormField>
            </div>
          )}

          {tab === "SEO" && (
            <div>
              <FormField label="Meta title template">
                <input
                  className={inputClass}
                  value={values.meta_title_template}
                  onChange={(e) => set("meta_title_template", e.target.value)}
                />
              </FormField>
              <FormField label="Meta description">
                <textarea
                  className={`${inputClass} min-h-[100px] resize-y`}
                  value={values.meta_description}
                  onChange={(e) => set("meta_description", e.target.value)}
                />
              </FormField>
              <FormField label="Google Search Console verification">
                <input
                  className={inputClass}
                  value={values.gsc_verification}
                  onChange={(e) => set("gsc_verification", e.target.value)}
                />
              </FormField>
              <FormField label="Social preview image">
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-black/20 px-4 py-6 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[22px]">image</span>
                  Choose from media library or upload a new OG image.
                </div>
              </FormField>
            </div>
          )}

          {tab === "Security" && (
            <div>
              <FormField label="Two-factor authentication" hint="Require 2FA for all admin accounts (recommended for CERT-In compliance).">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={values.require_2fa === "true"}
                    onChange={(e) => set("require_2fa", e.target.checked ? "true" : "false")}
                  />
                  <span className="text-sm text-on-surface-variant">Require 2FA on login</span>
                </label>
              </FormField>
              <FormField label="Session timeout">
                <select
                  className={inputClass}
                  value={values.session_timeout_minutes}
                  onChange={(e) => set("session_timeout_minutes", e.target.value)}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </FormField>
              <FormField label="Content Security Policy" hint="Managed via src/proxy.ts in code — not stored here, so it can't drift from what's actually enforced.">
                <textarea
                  className={`${inputClass} min-h-[80px] resize-y font-mono text-xs`}
                  readOnly
                  value="default-src 'self'; script-src 'self' 'nonce-{random}'; object-src 'none';"
                />
              </FormField>
              <FormField label="IP allowlist for admin panel" hint="Leave blank to allow all IPs.">
                <textarea
                  className={`${inputClass} min-h-[80px] resize-y font-mono text-xs`}
                  placeholder="e.g. 182.76.14.0/24"
                  value={values.ip_allowlist}
                  onChange={(e) => set("ip_allowlist", e.target.value)}
                />
              </FormField>
            </div>
          )}

          {tab === "Integrations" && (
            <div>
              <FormField label="Analytics provider">
                <select
                  className={inputClass}
                  value={values.analytics_provider}
                  onChange={(e) => set("analytics_provider", e.target.value)}
                >
                  <option value="none">None connected</option>
                  <option value="ga4">Google Analytics 4</option>
                  <option value="plausible">Plausible</option>
                </select>
              </FormField>
              <FormField label="Map provider">
                <select
                  className={inputClass}
                  value={values.map_provider}
                  onChange={(e) => set("map_provider", e.target.value)}
                >
                  <option value="leaflet">Leaflet / OpenStreetMap (current)</option>
                  <option value="mapbox">Mapbox</option>
                </select>
              </FormField>
              <FormField label="Backend">
                <div className="flex items-center gap-2">
                  <Badge tone="success">Connected</Badge>
                  <span className="text-sm text-on-surface-variant">
                    PostgreSQL via Prisma — self-hosted, no third-party service.
                  </span>
                </div>
              </FormField>
              <FormField label="Webhook URL">
                <input
                  className={inputClass}
                  placeholder="https://…"
                  value={values.webhook_url}
                  onChange={(e) => set("webhook_url", e.target.value)}
                />
              </FormField>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
