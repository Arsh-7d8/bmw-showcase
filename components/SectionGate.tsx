"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type SectionGateProps = {
  children: ReactNode;
  className?: string;
  minHeightClassName?: string;
  placeholderClassName?: string;
  rootMargin?: string;
};

export default function SectionGate({
  children,
  className = "",
  minHeightClassName = "min-h-screen",
  placeholderClassName = "",
  rootMargin = "900px 0px",
}: SectionGateProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const node = hostRef.current;
    if (!node || isActivated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsActivated(true);
        observer.disconnect();
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isActivated, rootMargin]);

  return (
    <div
      ref={hostRef}
      className={`${minHeightClassName} ${className}`.trim()}
      style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1080px" }}
    >
      {isActivated ? children : placeholderClassName ? <div aria-hidden="true" className={placeholderClassName} /> : null}
    </div>
  );
}
