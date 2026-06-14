"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  OrthographicCamera,
  useGLTF,
} from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { usePerformanceMode } from "@/lib/usePerformanceMode";

export type MCarSceneCarConfig = {
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

const clamp01 = (value: number) => THREE.MathUtils.clamp(value, 0, 1);
const easeInCubic = (value: number) => value * value * value;
const easeOutQuint = (value: number) => 1 - Math.pow(1 - value, 5);
const easeInOutSine = (value: number) => -(Math.cos(Math.PI * value) - 1) / 2;

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
    const glass = material instanceof THREE.MeshPhysicalMaterial ? material.clone() : new THREE.MeshPhysicalMaterial();

    glass.color = new THREE.Color("#ffffff");
    glass.metalness = 0;
    glass.roughness = 0;
    glass.transmission = 1;
    glass.thickness = 0.01;
    glass.ior = 1.1;
    glass.transparent = true;
    glass.opacity = 0.15;
    glass.envMapIntensity = 1.5;
    glass.clearcoat = 1;
    glass.depthWrite = false;

    return glass;
  }

  const tuned = material.clone();

  if (tuned instanceof THREE.MeshStandardMaterial || tuned instanceof THREE.MeshPhysicalMaterial) {
    tuned.envMapIntensity = 2.2;

    if (kind === "paint") {
      tuned.roughness = Math.max(Math.min(tuned.roughness, 0.15), 0.01);
      if (tuned instanceof THREE.MeshPhysicalMaterial) {
        tuned.clearcoat = 1;
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
}: {
  car: MCarSceneCarConfig;
  startPulse: number;
  travelKey: number;
  travelRole: "current" | "entering" | "exiting";
  travelDirection: number;
  onReady: (carId: string) => void;
}) {
  const { scene } = useGLTF(car.url);
  const rootRef = useRef<THREE.Group>(null);
  const pulseStartRef = useRef(-100);
  const travelStartRef = useRef(-1);
  const previousPulseRef = useRef(startPulse);
  const wheelRefs = useRef<THREE.Mesh[]>([]);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const maxAnisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 8);
  const initialDriveX = travelRole === "entering" ? (travelDirection >= 0 ? 1 : -1) * 6.55 : 0;

  const { stagedModel, wheelMeshes } = useMemo(() => {
    const cloned = clone(scene) as THREE.Group;
    const wheels: THREE.Mesh[] = [];

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

function ReflectivePlatform() {
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
        opacity={0.44}
        blur={2.8}
        far={2.2}
        resolution={512}
        frames={1}
        color="#000000"
      />
    </group>
  );
}

export default function MCarStudioScene({
  car,
  startPulse,
  travelKey,
  travelDirection,
  onStart,
  onModelReady,
}: {
  car: MCarSceneCarConfig;
  startPulse: number;
  travelKey: number;
  travelDirection: number;
  onStart: () => void;
  onModelReady: (carId: string) => void;
}) {
  const { allowInteractiveGarage } = usePerformanceMode();
  const dprRange: [number, number] = allowInteractiveGarage ? [0.9, 1.2] : [0.75, 1];
  const environmentResolution = allowInteractiveGarage ? 768 : 512;

  useEffect(() => {
    useGLTF.preload(car.url);
  }, [car.url]);

  return (
    <Canvas
      frameloop="demand"
      dpr={dprRange}
      performance={{ min: 0.5 }}
      gl={{
        antialias: false,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.95,
        powerPreference: "default",
      }}
      onPointerDown={onStart}
    >
      <SceneCamera />
      <CameraFrame />
      <color attach="background" args={["#030405"]} />
      <Environment resolution={environmentResolution} environmentIntensity={1.08}>
        <Lightformer form="rect" intensity={4.2} position={[0, 4, 5]} scale={[7, 1.2, 1]} />
        <Lightformer form="rect" intensity={2.9} position={[-4.2, 2.4, 2.8]} rotation-y={Math.PI / 4} scale={[1.2, 3.8, 1]} />
        <Lightformer form="rect" intensity={2.3} position={[4.4, 2.2, 2.2]} rotation-y={-Math.PI / 4} scale={[1, 3.4, 1]} />
        <Lightformer form="circle" intensity={1.2} position={[0, 2.6, -4]} scale={4.8} />
      </Environment>
      <ambientLight intensity={0.32} />
      <directionalLight position={[-4, 6, 5]} intensity={1.18} />
      <spotLight position={[-5, 4, 5]} intensity={0.88} angle={0.34} penumbra={0.9} color="#f4f7fb" />
      <spotLight position={[5, 4, 4]} intensity={0.42} angle={0.32} penumbra={0.8} color="#b8dfff" />
      <group position={[0, -0.23, 0]}>
        <ReflectivePlatform />
        <Suspense fallback={null}>
          <MCarModel
            key={`${car.id}-${travelKey}`}
            car={car}
            startPulse={startPulse}
            travelKey={travelKey}
            travelRole={travelKey === 0 ? "current" : "entering"}
            travelDirection={travelDirection}
            onReady={onModelReady}
          />
        </Suspense>
      </group>
      <ViewerControls resetKey={car.id} />
    </Canvas>
  );
}
