import { Suspense, useRef, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Float, OrbitControls, RoundedBox } from '@react-three/drei'
import type { Group } from 'three'
import type { UnidadMedida } from '@/types/domain'
import { Loader3D } from './Loader3D'
import { Capsula, CruzFarmacia, MaterialEtiqueta, PASTEL, prefiereMenosMovimiento } from './Primitivas'

interface Producto3DPreviewProps {
  unidadBase?: UnidadMedida
  imagenUrl?: string
  stockCritico?: boolean
  autoRotate?: boolean
  alto?: string
}

/* ---------- Formas procedurales (sin archivos .glb) ---------- */

function Caja({ url, color }: { url?: string; color: string }) {
  return (
    <group>
      <RoundedBox args={[1.3, 1.7, 0.5]} radius={0.05} smoothness={4} castShadow>
        <meshStandardMaterial color={PASTEL.blanco} roughness={0.4} />
      </RoundedBox>
      {/* Frente y dorso con la foto */}
      <mesh position={[0, 0, 0.252]}>
        <planeGeometry args={[1.2, 1.6]} />
        <MaterialEtiqueta url={url} color={color} />
      </mesh>
      <mesh position={[0, 0, -0.252]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.2, 1.6]} />
        <MaterialEtiqueta url={url} color={color} />
      </mesh>
      <CruzFarmacia color={PASTEL.sage} scale={0.18} position={[0.45, 0.65, 0.27]} />
    </group>
  )
}

function Frasco({ url, color }: { url?: string; color: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.55, 1.5, 48]} />
        <meshPhysicalMaterial color="#E9B36A" roughness={0.15} transmission={0.35} thickness={0.5} transparent opacity={0.9} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.565, 0.565, 0.9, 48, 1, true]} />
        <MaterialEtiqueta url={url} color={color} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.4, 0.28, 48]} />
        <meshStandardMaterial color={PASTEL.blanco} roughness={0.3} />
      </mesh>
    </group>
  )
}

function Tabletas({ color }: { color: string }) {
  const pos: [number, number, number][] = [[-0.35, 0, 0], [0.35, 0.02, 0.1], [0, 0.2, -0.2], [0.05, -0.02, 0.45]]
  return (
    <group>
      {pos.map((p, i) => (
        <mesh key={i} position={p} rotation={[Math.PI / 2 - 0.2 * i, 0, 0.3 * i]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.14, 40]} />
          <meshStandardMaterial color={i % 2 ? PASTEL.blanco : color} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

function Blister({ url, color }: { url?: string; color: string }) {
  const celdas: [number, number][] = []
  for (let f = 0; f < 2; f++) for (let c = 0; c < 5; c++) celdas.push([-0.6 + c * 0.3, -0.18 + f * 0.36])
  return (
    <group rotation={[-0.3, 0, 0]}>
      <RoundedBox args={[1.7, 0.95, 0.05]} radius={0.03} castShadow>
        <meshStandardMaterial color={PASTEL.aluminio} metalness={0.6} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.6, 0.85]} />
        <MaterialEtiqueta url={url} color={PASTEL.aluminio} />
      </mesh>
      {celdas.map(([x, y], i) => (
        <group key={i} position={[x, y, 0.03]}>
          <mesh>
            <sphereGeometry args={[0.13, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial color="#ffffff" transparent opacity={0.45} roughness={0.05} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.04]}>
            <cylinderGeometry args={[0.1, 0.1, 0.06, 24]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Ampolla({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 1, 32]} />
        <meshPhysicalMaterial color={PASTEL.cielo} transparent opacity={0.65} roughness={0.05} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.45, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.08, 0.22, 0.2, 32]} />
        <meshPhysicalMaterial color={PASTEL.cielo} transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.1, 0.25, 32]} />
        <meshPhysicalMaterial color={PASTEL.cielo} transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color={PASTEL.cielo} transparent opacity={0.65} />
      </mesh>
    </group>
  )
}

function Sobre({ url, color }: { url?: string; color: string }) {
  return (
    <group>
      <RoundedBox args={[1.1, 1.45, 0.08]} radius={0.03} castShadow>
        <meshStandardMaterial color={color} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, -0.05, 0.045]}>
        <planeGeometry args={[1, 1.2]} />
        <MaterialEtiqueta url={url} color={color} />
      </mesh>
    </group>
  )
}

function Tubo({ url, color }: { url?: string; color: string }) {
  return (
    <group rotation={[0, 0, Math.PI / 2.4]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.3, 1.5, 40]} />
        <MaterialEtiqueta url={url} color={color} />
      </mesh>
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[0.75, 0.2, 0.08]} />
        <meshStandardMaterial color={PASTEL.blanco} />
      </mesh>
      <mesh position={[0, -0.88, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.3, 32]} />
        <meshStandardMaterial color={PASTEL.blanco} roughness={0.3} />
      </mesh>
    </group>
  )
}

function Forma({ unidadBase, url, color }: { unidadBase?: UnidadMedida; url?: string; color: string }) {
  switch (unidadBase) {
    case 'CAJA': return <Caja url={url} color={color} />
    case 'FRASCO':
    case 'MILILITRO': return <Frasco url={url} color={color} />
    case 'TABLETA': return <Tabletas color={color} />
    case 'BLISTER': return <Blister url={url} color={color} />
    case 'AMPOLLA': return <Ampolla color={color} />
    case 'SOBRE':
    case 'GRAMO': return <Sobre url={url} color={color} />
    case 'TUBO': return <Tubo url={url} color={color} />
    default:
      return url ? <Caja url={url} color={color} /> : (
        <group>
          <Capsula colorA={color} colorB={PASTEL.blanco} escala={1.6} rotation={[0, 0, 0.6]} position={[-0.25, 0, 0]} />
          <Capsula colorA={PASTEL.lavanda} colorB={PASTEL.blanco} escala={1.2} rotation={[0.4, 0, -0.5]} position={[0.45, -0.2, 0.2]} />
        </group>
      )
  }
}

function Giratorio({ activo, children }: { activo: boolean; children: ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame((_, d) => { if (activo && ref.current) ref.current.rotation.y += d * 0.45 })
  return <group ref={ref}>{children}</group>
}

export function Producto3DPreview({ unidadBase, imagenUrl, stockCritico, autoRotate = true, alto = 'h-72' }: Producto3DPreviewProps) {
  const rotar = autoRotate && !prefiereMenosMovimiento()
  const color = stockCritico ? PASTEL.rosa : PASTEL.menta
  return (
    <div className={`relative w-full ${alto} overflow-hidden rounded-2xl bg-gradient-to-br from-mint-50 via-white to-lavender-50`}>
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 0.6, 3.6], fov: 42 }} aria-label="Vista 3D del producto">
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-3, 2, -2]} intensity={0.6} color="#E8DEFF" />
        <pointLight position={[3, -1, 2]} intensity={0.4} color="#D6F5EA" />
        <Suspense fallback={<Loader3D />}>
          <Float speed={rotar ? 2 : 0} rotationIntensity={0.2} floatIntensity={0.5}>
            <Giratorio activo={rotar}>
              <Forma unidadBase={unidadBase} url={imagenUrl} color={color} />
            </Giratorio>
          </Float>
          <ContactShadows position={[0, -1.1, 0]} opacity={0.35} scale={6} blur={2.5} far={3} />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom minDistance={2.2} maxDistance={6} />
      </Canvas>
      <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] text-ink-subtle">Arrastrá para girar</span>
    </div>
  )
}
