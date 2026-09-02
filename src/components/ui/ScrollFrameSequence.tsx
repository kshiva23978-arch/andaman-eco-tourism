"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollFrameSequenceProps {
  frameCount: number;
  getFrameSrc: (index: number) => string;
  className?: string;
}

type Frame = ImageBitmap | HTMLImageElement;

async function loadFrame(src: string): Promise<Frame> {
  const response = await fetch(src);
  const blob = await response.blob();

  if (typeof createImageBitmap === "function") {
    return createImageBitmap(blob);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

function getFrameSize(frame: Frame) {
  return "naturalWidth" in frame
    ? { width: frame.naturalWidth, height: frame.naturalHeight }
    : { width: frame.width, height: frame.height };
}

export function ScrollFrameSequence({
  frameCount,
  getFrameSrc,
  className,
}: ScrollFrameSequenceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<Frame[]>([]);
  const currentFrameRef = useRef(-1);
  const logicalSizeRef = useRef({ width: 0, height: 0 });
  const [framesLoaded, setFramesLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      Array.from({ length: frameCount }, (_, i) => loadFrame(getFrameSrc(i + 1)))
    ).then((frames) => {
      if (cancelled) return;
      framesRef.current = frames;
      setFramesLoaded(true);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const drawFrame = (index: number) => {
      const ctx = canvas.getContext("2d");
      const frame = framesRef.current[index];
      const { width, height } = logicalSizeRef.current;
      if (!ctx || !frame || !width || !height) return;

      const { width: frameWidth, height: frameHeight } = getFrameSize(frame);
      const imgRatio = frameWidth / frameHeight;
      const canvasRatio = width / height;

      let drawWidth: number;
      let drawHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (canvasRatio > imgRatio) {
        drawWidth = width;
        drawHeight = width / imgRatio;
        offsetX = 0;
        offsetY = (height - drawHeight) / 2;
      } else {
        drawHeight = height;
        drawWidth = height * imgRatio;
        offsetX = (width - drawWidth) / 2;
        offsetY = 0;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight);
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      logicalSizeRef.current = { width: rect.width, height: rect.height };
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let scrollTrigger: ScrollTrigger | null = null;
    if (framesLoaded) {
      const setFrame = (frameIndex: number) => {
        if (frameIndex === currentFrameRef.current) return;
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      };

      scrollTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            frameCount - 1,
            Math.max(0, Math.round(self.progress * (frameCount - 1)))
          );
          setFrame(frameIndex);
        },
      });
      setFrame(0);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      scrollTrigger?.kill();
    };
  }, [framesLoaded, frameCount]);

  useEffect(() => {
    return () => {
      framesRef.current.forEach((frame) => {
        if ("close" in frame) frame.close();
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
