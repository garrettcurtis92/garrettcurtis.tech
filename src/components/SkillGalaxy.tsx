/// <reference types="@react-three/fiber" />
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import "@react-three/fiber";
import { OrbitControls, Text, Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Extend JSX.IntrinsicElements for React Three Fiber
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      mesh: any;
      sphereGeometry: any;
      boxGeometry: any;
      torusGeometry: any;
      dodecahedronGeometry: any;
      meshStandardMaterial: any;
      primitive: any;
      group: any;
    }
  }
}

type Skill = {
  name: string;
  tone: "purple" | "green" | "pink" | "neutral";
  shape?: "box" | "sphere" | "torus" | "dodeca" | "cone" | "donut" | "tube" | "ring";
};

const SKILLS: Skill[] = [
  { name: "Next.js", tone: "purple", shape: "cone" },
  { name: "React", tone: "purple", shape: "donut" },
  { name: "TypeScript", tone: "purple", shape: "tube" },
  { name: "Tailwind", tone: "pink", shape: "ring" },
  { name: "C#", tone: "green", shape: "box" },
  { name: ".NET", tone: "green", shape: "dodeca" },
  { name: "Razor Pages", tone: "green", shape: "sphere" },
  { name: "PostgreSQL", tone: "pink", shape: "torus" },
  { name: "Prisma", tone: "pink", shape: "cone" },
  { name: "GitHub", tone: "neutral", shape: "donut" },
  { name: "CI/CD", tone: "neutral", shape: "tube" },
  { name: "Docker", tone: "neutral", shape: "ring" },
  { name: "Azure", tone: "green", shape: "sphere" },
  { name: "Automation", tone: "purple", shape: "box" },
];

const TONE_COLORS: Record<Skill["tone"], string> = {
  purple: "#a78bfa",
  green: "#34d399",
  pink: "#f472b6",
  neutral: "#94a3b8",
};

// deterministic “random” from a string (stable per label)
function randFrom(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return (h % 1_000_000) / 1_000_000; // 0..1
}

function posFromName(name: string, radiusMin = 2.5, radiusMax = 4.2) {
  const r1 = randFrom(name);
  const r2 = randFrom(name + "x");
  const r3 = randFrom(name + "y");

  const theta = r1 * Math.PI * 2;        // 0..2π
  const phi = Math.acos(2 * r2 - 1);     // 0..π (uniform on sphere)
  const radius = radiusMin + r3 * (radiusMax - radiusMin);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function SkillNode({ skill }: { skill: Skill }) {
  const [hovered, setHovered] = useState(false);
  const color = TONE_COLORS[skill.tone];
  const position = useMemo(() => posFromName(skill.name), [skill.name]);

  // subtle idle rotation
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_s, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.3;
    ref.current.rotation.x += dt * 0.1;
  });

  const scale = hovered ? 1.2 : 1;
  const emissive = new THREE.Color(color).multiplyScalar(0.25);

  return (
    <group position={position.toArray()}>
      <mesh
        ref={ref}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
        castShadow
        receiveShadow
      >
        {skill.shape === "sphere" && <sphereGeometry args={[0.42, 32, 32]} />}
        {skill.shape === "box" && <boxGeometry args={[0.7, 0.7, 0.7]} />}
        {skill.shape === "torus" && <torusGeometry args={[0.55, 0.16, 16, 64]} />}
        {skill.shape === "dodeca" && <dodecahedronGeometry args={[0.55, 0]} />}
        {skill.shape === "cone" && <coneGeometry args={[0.5, 1, 32]} />}
        {skill.shape === "donut" && <torusGeometry args={[0.6, 0.2, 16, 64]} />}
        {skill.shape === "tube" && <cylinderGeometry args={[0.3, 0.3, 1.2, 32]} />}
        {skill.shape === "ring" && <ringGeometry args={[0.3, 0.7, 32]} />}

        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.3}
          emissive={emissive}
          emissiveIntensity={hovered ? 0.8 : 0.35}
        />
      </mesh>

      {/* label (only show when hovered to keep scene clean) */}
      {hovered && (
        <Text
          position={[0, 0.95, 0]}
          color="#e5e7eb"
          fontSize={0.28}
          outlineWidth={0.01}
          outlineColor="#0b1020"
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      )}
    </group>
  );
}

function Starfield({ count = 800 }) {
  const points = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // spread stars a bit farther so they sit behind the galaxy
      const v = posFromName(`star-${i}`, 8, 14);
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    }
    return arr;
  }, [count]);

  return (
    <Points positions={points}>
      <PointMaterial size={0.03} sizeAttenuation depthWrite={false} transparent opacity={0.65} />
    </Points>
  );
}

function Rotator({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_s, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.06; // very slow orbit
  });
  return <group ref={ref}>{children}</group>;
}

export default function SkillGalaxy() {
  return (
    <div className="fixed inset-0 w-full h-full bg-black/0 overflow-visible z-0 pointer-events-none">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, -2, 7], fov: 70 }}
        style={{ overflow: 'visible' }}
        gl={{ alpha: true, antialias: true }}
        className="pointer-events-auto"
      >
        {/* lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 6, 6]} intensity={0.9} />
        <directionalLight position={[-6, -3, -4]} intensity={0.3} />

        {/* background stars */}
        <Starfield count={900} />

        {/* galaxy */}
        <Rotator>
          {SKILLS.map((s) => (
            <SkillNode key={s.name} skill={s} />
          ))}
        </Rotator>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
