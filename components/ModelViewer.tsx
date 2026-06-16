"use client";

import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, PresentationControls, Stage, useGLTF } from "@react-three/drei";
import { Suspense, useState } from "react";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

export default function ModelViewer() {
  const { allowInteractiveGarage } = usePerformanceMode();
  const [activeModel, setActiveModel] = useState("/models/m4-adro.glb");
  const [sceneEnabled, setSceneEnabled] = useState(false);
  const canMountScene = allowInteractiveGarage && sceneEnabled;

  return (
    <section id="catalog" className="relative z-0 min-h-screen bg-[#020305] py-32">
      <div className="section-shell flex h-full flex-col">
        <div className="mb-16">
          <h2 className="font-frick text-[clamp(3rem,6vw,6rem)] uppercase leading-[0.9] tracking-tight text-white">
            G82
            <br />
            <span className="text-white/40">CONFIGURATION</span>
          </h2>
          <p className="mt-6 max-w-md font-frick-condensed text-sm uppercase tracking-widest text-white/60">
            Explore the aggressive geometry of the M4 G82 with precision body kits.
          </p>
        </div>

        <div className="relative min-h-[500px] flex-1 overflow-hidden rounded-sm border border-white/5 bg-black/40">
          {!canMountScene ? (
            <Image
              src="/tablet-garage-after.png"
              alt="BMW 3D preview placeholder"
              fill
              priority={false}
              sizes="100vw"
              className="object-cover opacity-70"
            />
          ) : null}

          {canMountScene ? (
            <Canvas dpr={[0.8, 1.1]} shadows={false} camera={{ fov: 45 }} className="cursor-grab active:cursor-grabbing">
              <color attach="background" args={["#020305"]} />
              <Suspense fallback={null}>
                <PresentationControls speed={1.2} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
                  <Stage environment="city" intensity={0.45} shadows={false}>
                    <Model url={activeModel} />
                  </Stage>
                </PresentationControls>
                <ContactShadows position={[0, -1.5, 0]} opacity={0.58} scale={8} blur={2} far={4} />
              </Suspense>
            </Canvas>
          ) : null}

          {!allowInteractiveGarage ? (
            <div className="pointer-events-none absolute left-8 top-8 border border-white/10 bg-black/50 px-4 py-2 font-frick-condensed text-[0.62rem] uppercase tracking-[0.24em] text-white/56">
              Static preview for smoother browsing
            </div>
          ) : !sceneEnabled ? (
            <button
              type="button"
              onClick={() => setSceneEnabled(true)}
              className="absolute left-8 top-8 border border-white/16 bg-black/56 px-5 py-3 font-frick-condensed text-[0.68rem] uppercase tracking-[0.26em] text-white transition-colors hover:bg-white hover:text-black"
            >
              Enable 3D Preview
            </button>
          ) : null}

          <div className="absolute bottom-8 right-8 flex gap-4">
            <button
              onClick={() => setActiveModel("/models/m4-adro.glb")}
              className={`px-6 py-3 font-frick-condensed text-xs uppercase tracking-[0.3em] transition-all ${
                activeModel === "/models/m4-adro.glb" ? "bg-white text-black" : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              ADRO KIT
            </button>
            <button
              onClick={() => setActiveModel("/models/m4-zacoe.glb")}
              className={`px-6 py-3 font-frick-condensed text-xs uppercase tracking-[0.3em] transition-all ${
                activeModel === "/models/m4-zacoe.glb" ? "bg-white text-black" : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              ZACOE KIT
            </button>
          </div>

          <div className="absolute left-8 top-8">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#00a0e9]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">3D LIVE PREVIEW</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
