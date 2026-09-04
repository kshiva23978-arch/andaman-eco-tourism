"use client";

import { useState } from "react";
import { Lottie } from "lottie-react";
import animationData from "../../../public/loader/loader.json";

export function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-surface transition-opacity duration-500 ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-label="Loading"
    >
      <Lottie
        src={animationData}
        loop={false}
        autoplay
        subscriptions={{
          complete: () => {
            setIsExiting(true);
            window.setTimeout(() => setIsVisible(false), 500);
          },
        }}
        className="h-auto w-[min(90vw,640px)]"
      />
    </div>
  );
}