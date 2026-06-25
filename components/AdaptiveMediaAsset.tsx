"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { BmwMediaAsset } from "@/lib/bmwMedia";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

type AdaptiveMediaAssetProps = {
  asset: BmwMediaAsset;
  imageClassName: string;
  priority?: boolean;
  sizes: string;
  videoClassName: string;
};

export default function AdaptiveMediaAsset({
  asset,
  imageClassName,
  priority = false,
  sizes,
  videoClassName,
}: AdaptiveMediaAssetProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCompactViewport = useMediaQuery("(max-width: 1023px)");
  const { allowAmbientVideoAutoplay } = usePerformanceMode();
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (asset.kind !== "video" || prefersReducedMotion || !allowAmbientVideoAutoplay) {
      return;
    }

    const node = hostRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsNearViewport(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin: "120px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [allowAmbientVideoAutoplay, asset.kind, prefersReducedMotion]);

  const shouldRenderVideo =
    asset.kind === "video" &&
    !videoFailed &&
    !prefersReducedMotion &&
    allowAmbientVideoAutoplay &&
    (priority || isNearViewport);

  return (
    <div ref={hostRef} className="absolute inset-0">
      {shouldRenderVideo ? (
        <video
          className={videoClassName}
          autoPlay
          muted
          loop
          playsInline
          preload={priority ? "metadata" : "none"}
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
          loading={isCompactViewport ? "eager" : undefined}
          sizes={sizes}
          className={imageClassName}
        />
      )}
    </div>
  );
}
