"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { login, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  function refreshCaptcha() {
    setCaptchaKey((k) => k + 1);
  }

  return (
    <div className="flex min-h-screen bg-[#f3f5f2]">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-[#0f2b1e] p-10 text-white lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(/images/bg/beach.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2b1e]/70 via-[#0f2b1e]/85 to-[#0f2b1e]" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-white">
            <span className="material-symbols-outlined text-[22px]">eco</span>
          </div>
          <div className="leading-tight">
            <p className="font-semibold">Ecotourism Admin</p>
            <p className="text-xs text-white/60">Andaman &amp; Nicobar DoEF</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="font-headline-lg text-headline-lg leading-tight">
            Manage every destination, activity and page from one place.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            The official content console for the Andaman &amp; Nicobar Ecotourism portal —
            Department of Environment &amp; Forests.
          </p>
        </div>

        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} Department of Environment &amp; Forests, A&amp;N Islands
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-white">
              <span className="material-symbols-outlined text-[20px]">eco</span>
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-on-surface">Ecotourism Admin</p>
              <p className="text-xs text-on-surface-variant">Andaman &amp; Nicobar DoEF</p>
            </div>
          </div>

          <h2 className="font-headline-md text-headline-md text-primary">Sign in</h2>
          <p className="mt-1 mb-6 text-sm text-on-surface-variant">
            Enter your admin credentials to continue.
          </p>

          {state.error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-error-container px-3.5 py-2.5 text-sm text-on-error-container">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {state.error}
            </div>
          )}

          <form
            action={(formData) => {
              formAction(formData);
              refreshCaptcha();
            }}
          >
            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm font-semibold text-on-surface">
                Username or email
              </span>
              <input
                name="username"
                autoComplete="username"
                className="w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="you@user.gmail"
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-sm font-semibold text-on-surface">Password</span>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-on-surface-variant hover:bg-black/5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>

            <div className="mb-4 flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-on-surface-variant">
                <input type="checkbox" className="h-4 w-4" defaultChecked />
                Remember me
              </label>
             
            </div>

            <div className="mb-4">
              <span className="mb-1.5 block text-sm font-semibold text-on-surface">
                Security check
              </span>
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/admin/login/captcha?v=${captchaKey}`}
                  alt="Captcha"
                  width={180}
                  height={56}
                  className="select-none rounded-lg border border-black/15"
                />
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  title="Get a new code"
                  className="flex h-14 w-11 shrink-0 items-center justify-center rounded-lg border border-black/15 text-on-surface-variant hover:bg-black/5"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                </button>
              </div>
              <input
                name="captcha"
                className="mt-2 w-full rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm uppercase tracking-widest outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Enter the code above"
                maxLength={6}
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#00263f] disabled:opacity-60"
            >
              {pending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 rounded-lg bg-[#fdecd2] px-3.5 py-2.5 text-xs text-[#8a5a00]">
            Credentials are checked against the real admin database — accounts lock for 15
            minutes after 5 failed attempts.
          </p>

          <Link
            href="/"
            className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-secondary hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
