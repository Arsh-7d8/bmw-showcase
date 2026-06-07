"use client";

import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls, ContactShadows, useProgress } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Preload the models at module level to start fetching immediately
useGLTF.preload("/models/m4-adro.glb");
useGLTF.preload("/models/m4-zacoe.glb");

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
}

function Loader() {
  const { active, progress } = useProgress();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (active && progress < 100) {
      setShouldShow(true);
    } else if (progress >= 100) {
      const timer = setTimeout(() => setShouldShow(false), 500);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#020305]/90 backdrop-blur-md"
        >
          <div className="w-64 flex flex-col items-center">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                LOADING M-PERFORMANCE 3D ASSETS
              </span>
            </div>
            {/* M-Series styled progress bar */}
            <div className="relative h-[2px] w-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                className="h-full bg-gradient-to-r from-[#00a0e9] via-[#002f6c] to-[#e31837]"
              />
            </div>
            <div className="mt-2 flex w-full justify-between">
              <span className="font-frick-condensed text-[10px] text-white/30 uppercase tracking-widest">
                RENDERING ENGINE
              </span>
              <span className="font-frick text-xs text-white">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ModelViewer() {
  const [activeModel, setActiveModel] = useState("/models/m4-adro.glb");

  return (
    <section id="catalog" className="relative z-0 min-h-screen bg-[#020305] py-32">
      <div className="section-shell h-full flex flex-col">
        <div className="mb-16">
          <h2 className="font-frick text-[clamp(3rem,6vw,6rem)] uppercase leading-[0.9] tracking-tight text-white">
            G82<br />
            <span className="text-white/40">CONFIGURATION</span>
          </h2>
          <p className="mt-6 max-w-md text-sm uppercase tracking-widest text-white/60 font-frick-condensed">
            Explore the aggressive geometry of the M4 G82 with precision body kits.
          </p>
        </div>

        <div className="flex-1 relative min-h-[500px] border border-white/5 bg-black/40 rounded-sm overflow-hidden">
          <Loader />
          
          <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} className="cursor-grab active:cursor-grabbing">
            <color attach="background" args={["#020305"]} />
            <Suspense fallback={null}>
              <PresentationControls speed={1.5} global zoom={0.7} polar={[-0.1, Math.PI / 4]}>
                <Stage environment="city" intensity={0.5} shadows={false}>
                  <Model url={activeModel} />
                </Stage>
              </PresentationControls>
              <ContactShadows position={[0, -1.5, 0]} opacity={0.75} scale={10} blur={2.5} far={4} />
            </Suspense>
          </Canvas>

          {/* Configuration UI */}
          <div className="absolute bottom-8 right-8 flex gap-4">
            <button 
              onClick={() => setActiveModel("/models/m4-adro.glb")}
              className={`px-6 py-3 font-frick-condensed text-xs uppercase tracking-[0.3em] transition-all ${activeModel === "/models/m4-adro.glb" ? "bg-white text-black" : "bg-white/5 text-white hover:bg-white/10"}`}
            >
              ADRO KIT
            </button>
            <button 
              onClick={() => setActiveModel("/models/m4-zacoe.glb")}
              className={`px-6 py-3 font-frick-condensed text-xs uppercase tracking-[0.3em] transition-all ${activeModel === "/models/m4-zacoe.glb" ? "bg-white text-black" : "bg-white/5 text-white hover:bg-white/10"}`}
            >
              ZACOE KIT
            </button>
          </div>

          <div className="absolute top-8 left-8">
             <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#00a0e9] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">3D LIVE PREVIEW</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
