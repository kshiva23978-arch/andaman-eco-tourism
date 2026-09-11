"use client";

import { useEffect, useState } from "react";

export function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
      window.setTimeout(() => setIsVisible(false), 500);
    }, 2500);

    return () => window.clearTimeout(exitTimer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label="Loading"
    >
      <div className="absolute inset-0 bg-white" aria-hidden="true" />
      <div className="absolute inset-0 bg-primary/10" aria-hidden="true" />
      <img
        src="/loader/loader.gif"
        alt=""
        className="relative z-10 h-auto w-[min(90vw,640px)] mix-blend-multiply"
      />
    </div>
  );
}