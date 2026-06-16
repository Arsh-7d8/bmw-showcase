"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Power } from "lucide-react";
import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import type { MCarSceneCarConfig } from "@/components/MCarStudioScene";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

const DeferredStudioScene = dynamic(() => import("@/components/MCarStudioScene"), {
  ssr: false,
  loading: () => null,
});

const cars: MCarSceneCarConfig[] = [
  {
    id: "m4-dtm-redbull",
    name: "M4 DTM RED BULL",
    subtitle: "57 MB textured race model",
    url: "/models/bmw-m4-dtm-redbull/RedBullDTM.gltf",
    paint: "#0b1438",
    power: "590 hp",
    stance: "DTM aero",
    materialMode: "preserve",
    rotationY: -Math.PI * 0.24,
    displayScale: 1.08,
  },
  {
    id: "m4-g82-coupe",
    name: "M4 G82 COUPE",
    subtitle: "High-detail coupe orbit",
    url: "/models/bmw-m4-2023-candidate/source/bmwm4.glb",
    paint: "#143d8f",
    power: "503 hp",
    stance: "M xDrive coupe",
    materialMode: "paint",
    rotationY: -Math.PI * 0.24,
    displayScale: 1.03,
  },
];

function DriveTransitionOverlay({
  active,
  direction,
  travelKey,
}: {
  active: boolean;
  direction: number;
  travelKey: number;
}) {
  const driveSign = direction >= 0 ? 1 : -1;

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key={travelKey}
          className="pointer-events-none absolute inset-0 z-[6] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        >
          <motion.div
            className="absolute left-1/2 top-[57%] h-px w-[62%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(70,181,255,0.72),rgba(255,255,255,0.68),rgba(177,31,42,0.48),transparent)]"
            initial={{ opacity: 0, scaleX: 0.12, x: driveSign * 120 }}
            animate={{ opacity: [0, 1, 0], scaleX: [0.12, 1, 0.42], x: [driveSign * 120, 0, -driveSign * 140] }}
            transition={{ duration: 1.25, times: [0, 0.36, 1], ease: [0.22, 1, 0.36, 1] }}
          />
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute top-[48%] h-px w-48 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.42),transparent)]"
              style={{ left: `${22 + index * 24}%` }}
              initial={{ opacity: 0, x: driveSign * 180, scaleX: 0.2 }}
              animate={{ opacity: [0, 0.72, 0], x: [driveSign * 180, -driveSign * 220], scaleX: [0.2, 1, 0.3] }}
              transition={{ duration: 0.92, delay: index * 0.08, ease: [0.32, 0.72, 0, 1] }}
            />
          ))}
          <motion.div
            className="absolute bottom-[21%] left-1/2 h-24 w-[70%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(70,181,255,0.16),rgba(177,31,42,0.08)_38%,transparent_72%)]"
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: [0, 0.85, 0], scaleX: [0.6, 1, 0.82] }}
            transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function MCarShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const { allowInteractiveGarage } = usePerformanceMode();
  const [activeIndex, setActiveIndex] = useState(0);
  const [startPulse, setStartPulse] = useState(0);
  const [travelKey, setTravelKey] = useState(0);
  const [travelDirection, setTravelDirection] = useState(1);
  const [sceneEnabled, setSceneEnabled] = useState(false);
  const [readyCars, setReadyCars] = useState<Set<string>>(() => new Set());

  const activeCar = cars[activeIndex];
  const canMountScene = allowInteractiveGarage && sceneEnabled;
  const activeCarReady = !canMountScene || readyCars.has(activeCar.id);

  const triggerStart = () => {
    if (!sceneEnabled && allowInteractiveGarage) {
      setSceneEnabled(true);
    }
    if (prefersReducedMotion) return;
    setStartPulse((value) => value + 1);
  };

  const selectCar = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + cars.length) % cars.length;

    if (normalizedIndex === activeIndex) return;

    const direction = nextIndex > activeIndex ? 1 : -1;
    setTravelDirection(direction);
    setActiveIndex(normalizedIndex);
    setTravelKey((value) => value + 1);
    setStartPulse((value) => value + 1);
  };

  return (
    <section
      id="m-cars"
      className="relative z-0 overflow-hidden bg-[linear-gradient(180deg,#000000_0%,#040506_42%,#000000_100%)] py-24 text-white md:py-32 lg:py-36"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_16%_0%,rgba(0,102,177,0.14),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(177,31,42,0.1),transparent_30%)]" />
      <div className="section-shell relative">
        <div className="mb-10 flex flex-col gap-8 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md border-l border-[#46b5ff] pl-4 font-frick-condensed text-[0.68rem] uppercase tracking-[0.22em] text-[#46b5ff] sm:pl-6 sm:text-xs sm:tracking-[0.3em]"
          >
            Click the car to wake the engine. Use the side controls to move through high-detail GLB builds.
          </motion.p>

          <div className="flex justify-start lg:justify-end">
            <SectionHeading
              eyebrow="BMW M Cars"
              titleTop="M Power Garage"
              titleBottom=""
              align="right"
              singleLine
            />
          </div>
        </div>

        <div className="relative min-h-[34rem] overflow-hidden border border-white/10 bg-[#030405] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:min-h-[38rem] md:min-h-[46rem] lg:min-h-[52rem]">
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_58%,transparent_0%,transparent_42%,rgba(0,0,0,0.54)_84%),linear-gradient(180deg,rgba(255,255,255,0.025),rgba(0,0,0,0)_18%,rgba(0,0,0,0.28)_100%)]" />
          <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 sm:p-5 md:p-8">
            <div className="max-w-[min(72vw,36rem)] sm:max-w-[min(64vw,36rem)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCar.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-frick-condensed text-[0.62rem] uppercase tracking-[0.24em] text-[#46b5ff] sm:text-xs sm:tracking-[0.34em]">
                    {activeCar.subtitle}
                  </p>
                  <h3 className="mt-2 font-frick text-[2rem] uppercase leading-[0.94] tracking-normal text-white sm:mt-3 sm:text-[2.8rem] md:text-5xl lg:text-6xl">
                    {activeCar.name}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={triggerStart}
              className="flex items-center gap-3 border border-white/18 bg-black/36 px-5 py-4 font-frick-condensed text-[0.72rem] uppercase tracking-[0.24em] text-white transition-colors hover:bg-white hover:text-black sm:px-6"
            >
              <Power size={14} strokeWidth={1.7} />
              {allowInteractiveGarage ? (sceneEnabled ? "Restart" : "Start 3D") : "Static View"}
            </button>
          </div>

          <button
            type="button"
            aria-label="Previous car"
            onClick={() => selectCar(activeIndex - 1)}
            className="absolute left-3 top-[44%] z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/14 bg-black/34 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black sm:left-4 sm:top-1/2 sm:h-14 sm:w-14 md:left-8 md:h-16 md:w-16"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            aria-label="Next car"
            onClick={() => selectCar(activeIndex + 1)}
            className="absolute right-3 top-[44%] z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-white/14 bg-black/34 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black sm:right-4 sm:top-1/2 sm:h-14 sm:w-14 md:right-8 md:h-16 md:w-16"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>

          <div className="absolute inset-0">
            {!canMountScene ? (
              <Image
                src="/tablet-garage-after.png"
                alt={`${activeCar.name} garage preview`}
                fill
                priority={false}
                sizes="100vw"
                className="object-cover opacity-80"
              />
            ) : null}
            {canMountScene ? (
              <DeferredStudioScene
                car={activeCar}
                startPulse={startPulse}
                travelKey={travelKey}
                travelDirection={travelDirection}
                onStart={triggerStart}
                onModelReady={(carId) => {
                  setReadyCars((current) => {
                    if (current.has(carId)) return current;
                    const next = new Set(current);
                    next.add(carId);
                    return next;
                  });
                }}
              />
            ) : null}
          </div>

          <DriveTransitionOverlay
            active={travelKey > 0 && !prefersReducedMotion}
            direction={travelDirection}
            travelKey={travelKey}
          />

          {!activeCarReady ? (
            <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
              <div className="border border-white/12 bg-black/45 px-4 py-2 font-frick-condensed text-[0.68rem] uppercase tracking-[0.26em] text-white/60">
                Loading model
              </div>
            </div>
          ) : null}

          {!allowInteractiveGarage ? (
            <div className="pointer-events-none absolute left-4 top-[6.5rem] z-[11] border border-white/10 bg-black/42 px-4 py-2 font-frick-condensed text-[0.62rem] uppercase tracking-[0.22em] text-white/56 sm:left-5 md:left-8">
              Static garage kept here to stop browser spikes.
            </div>
          ) : !sceneEnabled ? (
            <div className="pointer-events-none absolute left-4 top-[6.5rem] z-[11] border border-white/10 bg-black/42 px-4 py-2 font-frick-condensed text-[0.62rem] uppercase tracking-[0.22em] text-white/56 sm:left-5 md:left-8">
              3D loads only after Start.
            </div>
          ) : null}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,28,48,0.42)_42%,rgba(0,0,0,0.88)_100%)] p-4 sm:p-5 md:p-6">
            <div className="pointer-events-auto grid gap-3 sm:gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-end">
              <div className="border border-white/12 bg-black/34 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="mb-4 h-1 w-36 bg-[linear-gradient(90deg,#0066b1_0_36%,#46b5ff_36%_54%,#b11f2a_54%_88%,rgba(255,255,255,0.18)_88%)]" />
                <p className="font-frick-condensed text-[0.62rem] uppercase tracking-[0.28em] text-[#46b5ff]">
                  Model {String(activeIndex + 1).padStart(2, "0")} / {String(cars.length).padStart(2, "0")}
                </p>
                <p className="mt-2 font-satoshi text-sm font-black uppercase tracking-[0.05em] text-white sm:text-base">
                  {activeCar.name}
                </p>
                <p className="mt-2 max-w-md font-satoshi text-xs font-medium leading-relaxed text-white/48">
                  Side controls cycle the garage and inspect the performance engineering.
                </p>
              </div>

              <div className="grid grid-cols-2 border border-white/12 bg-black/38 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm sm:grid-cols-3">
                {[
                  ["Power", activeCar.power],
                  ["Drive", activeCar.stance],
                  ["Model", activeCar.subtitle],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0 border-r border-white/10 p-3 last:border-r-0 sm:p-4 [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r">
                    <p className="font-frick-condensed text-[0.62rem] uppercase tracking-[0.24em] text-white/40">
                      {label}
                    </p>
                    <p className="mt-2 break-words font-satoshi text-sm font-black uppercase text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
