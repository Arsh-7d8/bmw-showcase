"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { BmwMediaAsset } from "@/lib/bmwMedia";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

type AdaptiveMediaAssetProps = {
  asset: BmwMediaAsset;
  imageClassName: string;
  playStrategy?: "auto" | "hover" | "off";
  priority?: boolean;
  sizes: string;
  videoClassName: string;
};

export default function AdaptiveMediaAsset({
  asset,
  imageClassName,
  playStrategy = "auto",
  priority = false,
  sizes,
  videoClassName,
}: AdaptiveMediaAssetProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { allowAmbientVideoAutoplay } = usePerformanceMode();
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isEngaged, setIsEngaged] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (asset.kind !== "video" || prefersReducedMotion) {
      return;
    }

    const node = hostRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsNearViewport(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [asset.kind, prefersReducedMotion]);

  const effectivePlayStrategy =
    playStrategy === "auto" && !allowAmbientVideoAutoplay ? "hover" : playStrategy;

  const shouldRenderVideo =
    asset.kind === "video" &&
    !videoFailed &&
    !prefersReducedMotion &&
    (priority || isNearViewport) &&
    (effectivePlayStrategy === "auto" || (effectivePlayStrategy === "hover" && isEngaged));

  return (
    <div
      ref={hostRef}
      className="absolute inset-0"
      onPointerEnter={() => setIsEngaged(true)}
      onPointerLeave={() => setIsEngaged(false)}
      onFocus={() => setIsEngaged(true)}
      onBlur={() => setIsEngaged(false)}
    >
      {shouldRenderVideo ? (
        <video
          className={videoClassName}
          autoPlay
          muted
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
          poster={asset.poster}
          onError={(e) => {
            console.error("Video rendering failed or blocked: falling back to image", e);
            setVideoFailed(true);
          }}
        >
          <source src={asset.src} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={asset.kind === "video" ? asset.poster ?? asset.src : asset.src}
          alt={asset.title}
          fill
          priority={priority}
          sizes={sizes}
          className={imageClassName}
        />
      )}
    </div>
  );
}
