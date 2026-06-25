"use client";

import { startTransition, Component, type ReactNode, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  OrthographicCamera,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import SectionHeading from "@/components/SectionHeading";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

type IdleCallbackWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  };

type SceneErrorBoundaryProps = {
  children: ReactNode;
  onFailure: () => void;
};

type SceneErrorBoundaryState = {
  hasError: boolean;
};

type SceneFailureReason = "renderer-error" | "context-lost";

type CarModelConfig = {
  id: string;
  name: string;
  subtitle: string;
  url: string;
  paint: string;
  power: string;
  stance: string;
  materialMode?: "preserve" | "paint";
  rotationY?: number;
  displayScale?: number;
};

const cars: CarModelConfig[] = [
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
    id: "m4-g82-widebody",
    name: "M4 G82 WIDEBODY",
    subtitle: "Widebody street build, tuned high-detail pass",
    url: "/models/m4-widebody.glb",
    paint: "#2f7d4d",
    power: "540 hp",
    stance: "Widebody aero",
    materialMode: "paint",
    rotationY: -Math.PI * 0.2,
    displayScale: 1.04,
  },
];

const clamp01 = (value: number) => THREE.MathUtils.clamp(value, 0, 1);
const easeInCubic = (value: number) => value * value * value;
const easeOutQuint = (value: number) => 1 - Math.pow(1 - value, 5);
const easeInOutSine = (value: number) => -(Math.cos(Math.PI * value) - 1) / 2;

class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

function enhanceTexture(texture: THREE.Texture | null | undefined, anisotropy: number) {
  if (!texture) return;

  texture.anisotropy = anisotropy;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
}

function enhanceMaterialTextures(material: THREE.Material, anisotropy: number) {
  if (!(material instanceof THREE.MeshStandardMaterial) && !(material instanceof THREE.MeshPhysicalMaterial)) return;

  enhanceTexture(material.map, anisotropy);
  enhanceTexture(material.normalMap, anisotropy);
  enhanceTexture(material.roughnessMap, anisotropy);
  enhanceTexture(material.metalnessMap, anisotropy);
  enhanceTexture(material.aoMap, anisotropy);
  enhanceTexture(material.alphaMap, anisotropy);
  enhanceTexture(material.emissiveMap, anisotropy);
}

function materialKind(material: THREE.Material) {
  const name = material.name.toLowerCase();
  const candidateBodyMaterials = new Set([
    "black2",
    "black3",
    "material.001",
    "material.006",
    "material_13",
    "material_5",
    "material_7",
    "material_23",
    "car paint",
    "car paint .001",
  ]);

  if (name.includes("glass") || name.includes("window") || name.includes("glasss")) return "glass";
  if (name.includes("wheel") || name.includes("rim") || name.includes("tire") || name.includes("disc")) return "wheel";
  if (name.includes("chrome") || name.includes("steel") || name.includes("mirror")) return "chrome";
  if (candidateBodyMaterials.has(name)) return "paint";
  if (name.includes("carbon") || name.includes("black") || name.includes("trim")) return "trim";
  if (name.includes("paint") || name.includes("body") || name.includes("door") || name.includes("hood") || name === "red" || name.startsWith("red.")) return "paint";
  return "default";
}

function tuneMaterial(material: THREE.Material, paint: string) {
  const source =
    material instanceof THREE.MeshStandardMaterial
      ? material
      : new THREE.MeshStandardMaterial({ color: "#9aa3ad" });
  const kind = materialKind(source);

  if (kind === "paint") {
    const color = source.color?.clone?.() ?? new THREE.Color(paint);
    const channelSpread = Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b);
    const brightness = color.r + color.g + color.b;
    const sourceIsNeutral = channelSpread < 0.16 || brightness < 0.42 || brightness > 1.85;
    const paintColor = sourceIsNeutral ? new THREE.Color(paint) : color.lerp(new THREE.Color(paint), 0.18);

    return new THREE.MeshPhysicalMaterial({
      color: paintColor,
      metalness: source.metalness ?? 0.38,
      roughness: Math.max(source.roughness ?? 0.24, 0.18),
      clearcoat: 0.92,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.18,
      map: null,
      normalMap: source.normalMap ?? null,
      roughnessMap: source.roughnessMap ?? null,
      metalnessMap: source.metalnessMap ?? null,
      aoMap: source.aoMap ?? null,
    });
  }

  if (kind === "glass") {
    return new THREE.MeshPhysicalMaterial({
      color: "#9fb3c6",
      roughness: 0.045,
      metalness: 0,
      transmission: 0.3,
      transparent: true,
      opacity: 0.5,
      envMapIntensity: 1,
    });
  }

  if (kind === "chrome") {
    return new THREE.MeshPhysicalMaterial({
      color: source.color ?? new THREE.Color("#d9dde2"),
      metalness: 0.92,
      roughness: 0.16,
      clearcoat: 0.25,
      envMapIntensity: 1.28,
      map: source.map ?? null,
      normalMap: source.normalMap ?? null,
      roughnessMap: source.roughnessMap ?? null,
      metalnessMap: source.metalnessMap ?? null,
      aoMap: source.aoMap ?? null,
    });
  }

  const tuned = source.clone();
  tuned.needsUpdate = true;

  if (kind === "trim") {
    tuned.color = new THREE.Color("#080a0d");
    tuned.metalness = Math.max(tuned.metalness, 0.34);
    tuned.roughness = Math.max(tuned.roughness, 0.38);
    tuned.envMapIntensity = 0.88;
    return tuned;
  }

  if (kind === "wheel") {
    tuned.color = new THREE.Color("#111318");
    tuned.metalness = Math.max(tuned.metalness, 0.62);
    tuned.roughness = Math.max(tuned.roughness, 0.32);
    tuned.envMapIntensity = 1.05;
    return tuned;
  }

  tuned.envMapIntensity = 0.9;
  return tuned;
}

function preserveMaterial(material: THREE.Material) {
  const kind = materialKind(material);
  
  if (kind === "glass") {
    // For Red Bull / Racing models, we need aggressive transparency to see the cockpit
    const glass = material instanceof THREE.MeshPhysicalMaterial ? material.clone() : new THREE.MeshPhysicalMaterial();
    
    glass.color = new THREE.Color("#ffffff");
    glass.metalness = 0;
    glass.roughness = 0;
    glass.transmission = 1.0; 
    glass.thickness = 0.01; // Thin glass for better clarity
    glass.ior = 1.1; // Less distortion
    glass.transparent = true;
    glass.opacity = 0.15;
    glass.envMapIntensity = 1.5;
    glass.clearcoat = 1;
    glass.depthWrite = false;
    
    return glass;
  }

  const tuned = material.clone();

  if (tuned instanceof THREE.MeshStandardMaterial || tuned instanceof THREE.MeshPhysicalMaterial) {
    // Original quality restoration
    tuned.envMapIntensity = 2.2; 
    
    if (kind === "paint") {
      tuned.roughness = Math.max(Math.min(tuned.roughness, 0.15), 0.01);
      if (tuned instanceof THREE.MeshPhysicalMaterial) {
        tuned.clearcoat = 1.0;
        tuned.clearcoatRoughness = 0.01;
      }
    }
    
    tuned.needsUpdate = true;
  }

  return tuned;
}

function MCarModel({
  car,
  startPulse,
  travelKey,
  travelRole,
  travelDirection,
  onReady,
  balancedMode,
}: {
  car: CarModelConfig;
  startPulse: number;
  travelKey: number;
  travelRole: "current" | "entering" | "exiting";
  travelDirection: number;
  onReady: (carId: string) => void;
  balancedMode: boolean;
}) {
  const { scene } = useGLTF(car.url);
  const rootRef = useRef<THREE.Group>(null);
  const pulseStartRef = useRef(-100);
  const travelStartRef = useRef(-1);
  const previousPulseRef = useRef(startPulse);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const maxAnisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), balancedMode ? 2 : 8);
  const initialDriveX =
    travelRole === "entering" ? (travelDirection >= 0 ? 1 : -1) * 6.55 : 0;

  const { stagedModel, wheelMeshes } = useMemo(() => {
    const cloned = clone(scene) as THREE.Group;
    const wheels: THREE.Mesh[] = [];

    // Pre-calculate and freeze materials for the staged model
    cloned.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = false;
      child.receiveShadow = false;

      const tune = car.materialMode === "preserve" ? preserveMaterial : (entry: THREE.Material) => tuneMaterial(entry, car.paint);
      child.material = Array.isArray(child.material)
        ? child.material.map((entry) => tune(entry))
        : tune(child.material);

      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((material) => enhanceMaterialTextures(material, maxAnisotropy));

      const name = `${child.name} ${mats.map((entry) => entry.name).join(" ")}`.toLowerCase();
      const likelyWheel =
        (name.includes("wheel") || name.includes("tyre") || name.includes("tire") || name.includes("rim")) &&
        !name.includes("brake") &&
        !name.includes("disc") &&
        !name.includes("caliper");
      if (!child.geometry.boundingBox) {
        child.geometry.computeBoundingBox();
      }
      const localCenter = new THREE.Vector3();
      const localSize = new THREE.Vector3();
      child.geometry.boundingBox?.getCenter(localCenter);
      child.geometry.boundingBox?.getSize(localSize);
      const hasSafePivot = localCenter.length() < Math.max(localSize.length() * 0.18, 0.01);

      if (likelyWheel && hasSafePivot) {
        wheels.push(child);
      }
    });

    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const scale = (5.15 * (car.displayScale ?? 1)) / (Math.max(size.x, size.y, size.z) || 1);

    cloned.scale.setScalar(scale);
    cloned.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

    const orientation = new THREE.Group();
    orientation.rotation.y = car.rotationY ?? 0;
    orientation.add(cloned);

    const orientedBox = new THREE.Box3().setFromObject(orientation);
    const orientedCenter = orientedBox.getCenter(new THREE.Vector3());
    orientation.position.x = -orientedCenter.x;
    orientation.position.z = -orientedCenter.z;

    const stage = new THREE.Group();
    stage.add(orientation);

    return { stagedModel: stage, wheelMeshes: wheels };
  }, [scene, car.displayScale, car.materialMode, car.paint, car.rotationY, maxAnisotropy]);

  useEffect(() => {
    return () => {
      stagedModel.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;

        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material.dispose());
      });
    };
  }, [stagedModel]);

  useEffect(() => {
    wheelRefs.current = wheelMeshes;
  }, [wheelMeshes]);

  useEffect(() => {
    onReady(car.id);
  }, [car.id, onReady]);

  useEffect(() => {
    travelStartRef.current = performance.now() / 1000;
    invalidate();
  }, [invalidate, travelKey, travelRole]);

  useEffect(() => {
    if (previousPulseRef.current === startPulse) return;
    previousPulseRef.current = startPulse;
    pulseStartRef.current = performance.now() / 1000;
    invalidate();
  }, [invalidate, startPulse]);

  useFrame((_, delta) => {
    const root = rootRef.current;
    if (!root) return;

    const now = performance.now() / 1000;
    if (travelStartRef.current < 0) {
      travelStartRef.current = now;
    }

    const pulseElapsed = Math.max(0, now - pulseStartRef.current);
    const travelElapsed = Math.max(0, now - travelStartRef.current);
    const isStarting = pulseElapsed < 1.25;
    const travelDuration = 1.15;
    const isTraveling = travelElapsed < travelDuration;
    const throttle = isStarting ? Math.pow(1 - pulseElapsed / 1.25, 2) : 0;
    const engineWave = Math.sin(pulseElapsed * 42) * throttle;
    const exitProgress = clamp01(travelElapsed / 0.58);
    const enterProgress = clamp01(travelElapsed / 0.72);
    const exitEased = easeInCubic(exitProgress);
    const enterEased = easeOutQuint(enterProgress);
    const exitWave = easeInOutSine(exitProgress);
    const enterWave = easeInOutSine(enterProgress);
    const travelDistance = 6.25;
    const driveSign = travelDirection >= 0 ? 1 : -1;
    const isExiting = travelRole === "exiting";
    const isEntering = travelRole === "entering";
    const driveX = isExiting
      ? -driveSign * travelDistance * exitEased
      : isEntering
        ? driveSign * travelDistance * (1 - enterEased)
        : 0;
    const laneShift = isExiting
      ? -driveSign * 0.28 * exitWave
      : isEntering
        ? driveSign * 0.28 * enterWave
        : 0;
    const yawLean = isExiting
      ? driveSign * 0.14 * exitWave
      : isEntering
        ? -driveSign * 0.14 * enterWave
        : 0;
    const pitchLean = isExiting ? 0.035 * exitWave : isEntering ? -0.026 * enterWave : 0;
    const heave = isExiting
      ? Math.sin(exitProgress * Math.PI) * 0.022
      : isEntering
        ? Math.sin(enterProgress * Math.PI) * 0.018
        : 0;
    const travelSpin = isExiting
      ? driveSign * 82 * (1 - exitProgress * 0.24)
      : isEntering
        ? -driveSign * 62 * (1 - enterProgress * 0.42)
        : 0;
    const wheelSpin = (isTraveling ? travelSpin : 0) + throttle * 18;

    root.position.y = engineWave * 0.012 + heave;
    root.position.x = driveX + Math.sin(Math.min(pulseElapsed, 1.25) * Math.PI) * throttle * 0.05;
    root.position.z = laneShift;
    root.rotation.y = yawLean;
    root.rotation.x = pitchLean;
    root.rotation.z = engineWave * 0.004 + yawLean * 0.08;

    if (wheelSpin !== 0) {
      wheelRefs.current.forEach((wheel) => {
        wheel.rotation.x += wheelSpin * delta;
      });
    }

    if (isStarting || isTraveling) invalidate();

  });

  return (
    <group ref={rootRef} position={[initialDriveX, 0, 0]}>
      <primitive object={stagedModel} />
    </group>
  );
}

function CameraFrame() {
  const camera = useThree((state) => state.camera);
  const width = useThree((state) => state.size.width);

  useEffect(() => {
    const isMobile = width < 720;

    camera.lookAt(0, isMobile ? 0.52 : 0.56, 0);
    camera.updateProjectionMatrix();
  }, [camera, width]);

  return null;
}

function SceneCamera() {
  const width = useThree((state) => state.size.width);
  const isMobile = width < 720;
  const isWide = width > 1280;

  return (
    <OrthographicCamera
      makeDefault
      position={isMobile ? [0, 1.45, 9.2] : [0, 1.22, 8.4]}
      zoom={isMobile ? 48 : isWide ? 176 : 156}
    />
  );
}

function ViewerControls({ resetKey }: { resetKey: string }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const returnTimerRef = useRef<number | null>(null);
  const invalidate = useThree((state) => state.invalidate);

  const clearReturnTimer = () => {
    if (returnTimerRef.current === null) return;
    window.clearTimeout(returnTimerRef.current);
    returnTimerRef.current = null;
  };

  const returnToDefault = () => {
    clearReturnTimer();
    returnTimerRef.current = window.setTimeout(() => {
      controlsRef.current?.reset();
      invalidate();
    }, 480);
  };

  useEffect(() => {
    clearReturnTimer();
    controlsRef.current?.reset();
    invalidate();

    return clearReturnTimer;
  }, [invalidate, resetKey]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI * 0.38}
      maxPolarAngle={Math.PI * 0.49}
      target={[0, 0.54, 0]}
      onStart={clearReturnTimer}
      onEnd={returnToDefault}
      onChange={() => invalidate()}
    />
  );
}

function WebGLContextLossGuard({ onContextLost }: { onContextLost: () => void }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const handleContextLost = () => {
      onContextLost();
    };

    gl.domElement.addEventListener("webglcontextlost", handleContextLost, { once: true });
    return () => gl.domElement.removeEventListener("webglcontextlost", handleContextLost);
  }, [gl, onContextLost]);

  return null;
}

function ReflectivePlatform({ balancedMode }: { balancedMode: boolean }) {
  return (
    <group>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12.4, 4.3]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.56} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.034, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[4.8, 1.08, 1]} renderOrder={2}>
        <circleGeometry args={[1, 96]} />
        <meshBasicMaterial
          color="#05070a"
          transparent
          opacity={0.38}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
      <mesh position={[0, -0.033, 0.08]} rotation={[-Math.PI / 2, 0, 0]} scale={[5.2, 0.78, 1]} renderOrder={3}>
        <circleGeometry args={[1, 96]} />
        <meshBasicMaterial color="#15202c" transparent opacity={0.14} depthWrite={false} depthTest={false} />
      </mesh>
      <ContactShadows
        position={[0, -0.029, 0]}
        scale={7.2}
        opacity={balancedMode ? 0.4 : 0.52}
        blur={balancedMode ? 1.4 : 2.6}
        far={2.2}
        resolution={balancedMode ? 128 : 512}
        frames={1}
        color="#000000"
      />
    </group>
  );
}

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

function GarageLoadingOverlay({
  heading,
  description,
  progressValue,
}: {
  heading: string;
  description: string;
  progressValue: number;
}) {
  return (
    <div className="absolute inset-0 z-[5] flex items-center justify-center bg-[radial-gradient(circle_at_50%_48%,rgba(7,24,42,0.26),transparent_38%),linear-gradient(180deg,rgba(2,3,5,0.14),rgba(2,3,5,0.58)_58%,rgba(2,3,5,0.82))]">
      <div className="mx-6 w-full max-w-md border border-white/12 bg-black/48 px-6 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
        <p className="font-frick-condensed text-[0.62rem] uppercase tracking-[0.28em] text-[#46b5ff]">
          Garage loader
        </p>
        <h4 className="mt-3 font-frick text-[1.5rem] uppercase leading-[0.94] text-white sm:text-[1.85rem]">
          {heading}
        </h4>
        <p className="mt-3 max-w-[34ch] font-satoshi text-sm leading-relaxed text-white/58">
          {description}
        </p>
        <div className="mt-6 space-y-2">
          <div className="h-[3px] overflow-hidden bg-white/8">
            <motion.div
              className="h-full bg-[linear-gradient(90deg,#0066b1_0%,#46b5ff_54%,#b11f2a_100%)]"
              animate={{ width: `${progressValue}%` }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="flex items-center justify-between font-frick-condensed text-[0.58rem] uppercase tracking-[0.22em] text-white/40">
            <span>Loading assets</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioScene({
  car,
  startPulse,
  travelKey,
  travelDirection,
  onStart,
  onModelReady,
  balancedMode,
  onContextFailure,
}: {
  car: CarModelConfig;
  startPulse: number;
  travelKey: number;
  travelDirection: number;
  onStart: () => void;
  onModelReady: (carId: string) => void;
  balancedMode: boolean;
  onContextFailure: (reason: SceneFailureReason) => void;
}) {
  return (
    <SceneErrorBoundary onFailure={() => onContextFailure("renderer-error")}>
      <Canvas
        frameloop="demand"
        dpr={balancedMode ? [0.8, 0.9] : [1, 1.15]}
        performance={{ min: balancedMode ? 0.45 : 0.7 }}
        gl={{
          antialias: !balancedMode,
          alpha: false,
          stencil: false,
          failIfMajorPerformanceCaveat: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95,
          powerPreference: balancedMode ? "low-power" : "high-performance",
        }}
        onPointerDown={onStart}
      >
        <WebGLContextLossGuard onContextLost={() => onContextFailure("context-lost")} />
        <SceneCamera />
        <CameraFrame />
        <color attach="background" args={["#030405"]} />
        <Environment resolution={balancedMode ? 128 : 640} environmentIntensity={balancedMode ? 0.96 : 1.18}>
          <Lightformer form="rect" intensity={4.6} position={[0, 4, 5]} scale={[7, 1.2, 1]} />
          <Lightformer form="rect" intensity={3.2} position={[-4.2, 2.4, 2.8]} rotation-y={Math.PI / 4} scale={[1.2, 3.8, 1]} />
          <Lightformer form="rect" intensity={2.6} position={[4.4, 2.2, 2.2]} rotation-y={-Math.PI / 4} scale={[1, 3.4, 1]} />
          {!balancedMode ? <Lightformer form="circle" intensity={1.4} position={[0, 2.6, -4]} scale={4.8} /> : null}
        </Environment>
        <ambientLight intensity={balancedMode ? 0.3 : 0.34} />
        <directionalLight
          position={[-4, 6, 5]}
          intensity={balancedMode ? 1.15 : 1.35}
        />
        <spotLight position={[-5, 4, 5]} intensity={balancedMode ? 0.86 : 1.05} angle={0.34} penumbra={0.9} color="#f4f7fb" />
        {!balancedMode ? (
          <spotLight position={[5, 4, 4]} intensity={0.5} angle={0.32} penumbra={0.8} color="#b8dfff" />
        ) : null}
        <group position={[0, -0.23, 0]}>
          <ReflectivePlatform balancedMode={balancedMode} />

          <Suspense fallback={null}>
            <MCarModel
              key={`${car.id}-${travelKey}`}
              car={car}
              startPulse={startPulse}
              travelKey={travelKey}
              travelRole={travelKey === 0 ? "current" : "entering"}
              travelDirection={travelDirection}
              onReady={onModelReady}
              balancedMode={balancedMode}
            />
          </Suspense>
        </group>
        <ViewerControls resetKey={car.id} />
      </Canvas>
    </SceneErrorBoundary>
  );
}

export default function MCarShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const { active: loaderActive, progress: loaderProgress, total: loaderTotal } = useProgress();
  const sectionRef = useRef<HTMLElement | null>(null);
  const activationTimerRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);
  const idleCallbackRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [startPulse, setStartPulse] = useState(0);
  const [travelKey, setTravelKey] = useState(0);
  const [travelDirection, setTravelDirection] = useState(1);
  const [sceneActivated, setSceneActivated] = useState(false);
  const [sceneBlocked, setSceneBlocked] = useState(false);
  const [sceneRecoveryMode, setSceneRecoveryMode] = useState(false);
  const [sceneFailureReason, setSceneFailureReason] = useState<SceneFailureReason | null>(null);
  const [hasRetriedScene, setHasRetriedScene] = useState(false);
  const [readyCars, setReadyCars] = useState<Set<string>>(() => new Set());
  const { allowInteractiveGarage } = usePerformanceMode();
  const activeCar = cars[activeIndex];
  const activeCarReady = !sceneActivated || readyCars.has(activeCar.id);
  const balancedMode = sceneRecoveryMode || !allowInteractiveGarage;
  const needsManualSceneLoad = balancedMode;
  const shouldShowAutoLoader = !needsManualSceneLoad && !sceneBlocked && (!sceneActivated || !activeCarReady);
  const loadProgressValue = sceneActivated
    ? activeCarReady
      ? 100
      : loaderTotal > 0 || loaderActive
        ? Math.min(96, Math.max(14, loaderProgress))
        : 22
    : 8;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || sceneActivated || needsManualSceneLoad) return;
    const browserWindow = window as IdleCallbackWindow;

    const clearActivation = () => {
      if (activationTimerRef.current !== null) {
        globalThis.clearTimeout(activationTimerRef.current);
        activationTimerRef.current = null;
      }

      if (idleCallbackRef.current !== null && browserWindow.cancelIdleCallback) {
        browserWindow.cancelIdleCallback(idleCallbackRef.current);
        idleCallbackRef.current = null;
      }
    };

    const scheduleActivation = () => {
      const activationDelay = balancedMode ? 160 : 340;

      const activateScene = () => {
        setSceneActivated(true);
        idleCallbackRef.current = null;
        activationTimerRef.current = null;
      };

      activationTimerRef.current = globalThis.setTimeout(() => {
        activationTimerRef.current = null;

        if (browserWindow.requestIdleCallback) {
          idleCallbackRef.current = browserWindow.requestIdleCallback(
            () => {
              activateScene();
            },
            { timeout: 1800 }
          );
          return;
        }

        activateScene();
      }, activationDelay);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        clearActivation();
        scheduleActivation();
        observer.disconnect();
      },
      { rootMargin: balancedMode ? "80px 0px" : "220px 0px" }
    );

    observer.observe(node);
    return () => {
      clearActivation();
      observer.disconnect();
    };
  }, [balancedMode, needsManualSceneLoad, sceneActivated]);

  const triggerStart = () => {
    if (prefersReducedMotion) return;
    setStartPulse((value) => value + 1);
  };

  const retrySceneInRecoveryMode = () => {
    if (activationTimerRef.current !== null) {
      globalThis.clearTimeout(activationTimerRef.current);
      activationTimerRef.current = null;
    }

    setSceneActivated(false);
    setSceneRecoveryMode(true);
    setHasRetriedScene(true);
    activationTimerRef.current = globalThis.setTimeout(() => {
      setSceneActivated(true);
      activationTimerRef.current = null;
    }, 900);
  };

  const requestSceneActivation = () => {
    if (sceneActivated || sceneBlocked) return;
    setSceneActivated(true);
  };

  const handleSceneFailure = (reason: SceneFailureReason) => {
    setSceneFailureReason(reason);

    if (!hasRetriedScene) {
      retrySceneInRecoveryMode();
      return;
    }

    setSceneActivated(false);
    setSceneBlocked(true);
  };

  const selectCar = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + cars.length) % cars.length;

    if (normalizedIndex === activeIndex) return;

    const direction = nextIndex > activeIndex ? 1 : -1;
    startTransition(() => {
      setTravelDirection(direction);
      setActiveIndex(normalizedIndex);
      setTravelKey((value) => value + 1);
      setStartPulse((value) => value + 1);
    });
  };

  return (
    <section
      ref={sectionRef}
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
            Cycle through two high-detail BMW builds with the side controls. The scene stays live without an ignition step.
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
            <div className="border border-white/12 bg-black/28 px-4 py-3 font-frick-condensed text-[0.62rem] uppercase tracking-[0.24em] text-white/52 sm:px-5">
              Live 3D garage
            </div>
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
            {sceneActivated ? (
              <StudioScene
                car={activeCar}
                startPulse={startPulse}
                travelKey={travelKey}
                travelDirection={travelDirection}
                onStart={triggerStart}
                balancedMode={balancedMode}
                onContextFailure={handleSceneFailure}
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

            {!sceneActivated && !sceneBlocked && needsManualSceneLoad ? (
              <div className="absolute inset-0 z-[4] flex items-center justify-center bg-[radial-gradient(circle_at_50%_48%,rgba(7,24,42,0.34),transparent_38%),linear-gradient(180deg,rgba(2,3,5,0.14),rgba(2,3,5,0.58)_58%,rgba(2,3,5,0.82))]">
                <div className="mx-6 max-w-lg border border-white/12 bg-black/46 px-6 py-7 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
                  <p className="font-frick-condensed text-[0.62rem] uppercase tracking-[0.3em] text-[#46b5ff]">
                    Performance mode
                  </p>
                  <h4 className="mt-3 font-frick text-[1.6rem] uppercase leading-[0.94] text-white sm:text-[2rem]">
                    Load the live 3D garage only when needed.
                  </h4>
                  <p className="mt-3 font-satoshi text-sm leading-relaxed text-white/58">
                    The current session is using the lighter path so the page stays responsive. The two-car garage is still available on demand.
                  </p>
                  <button
                    type="button"
                    onClick={requestSceneActivation}
                    className="mt-5 inline-flex min-h-11 items-center justify-center border border-[#46b5ff]/44 bg-[#46b5ff]/10 px-5 font-frick-condensed text-[0.72rem] uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#46b5ff] hover:text-black"
                  >
                    Load live 3D
                  </button>
                </div>
              </div>
            ) : null}

            {sceneBlocked ? (
              <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
                <div className="border border-white/12 bg-black/45 px-4 py-2 font-frick-condensed text-[0.68rem] uppercase tracking-[0.26em] text-white/60">
                  {sceneFailureReason === "context-lost" ? "3D preview unavailable" : "3D renderer unavailable"}
                </div>
              </div>
            ) : null}

            {shouldShowAutoLoader ? (
              <GarageLoadingOverlay
                heading={sceneActivated ? "Loading BMW model" : "Preparing the garage"}
                description={
                  sceneActivated
                    ? "The model is loading in-place so the page stays smooth. It may take a moment, but it should not spike the whole experience."
                    : "The garage now waits briefly before loading so the heavy 3D work starts intentionally instead of spiking the scroll."
                }
                progressValue={loadProgressValue}
              />
            ) : null}
          </div>
          <DriveTransitionOverlay
            active={travelKey > 0 && !prefersReducedMotion}
            direction={travelDirection}
            travelKey={travelKey}
          />

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
