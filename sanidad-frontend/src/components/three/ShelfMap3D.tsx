import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { Estante } from '@/types/domain'
import { Loader3D } from './Loader3D'
import { Floor } from './Floor'
import { EstanteBlock3D } from './EstanteBlock3D'
import { CruzFarmacia, PASTEL } from './Primitivas'

interface ShelfMap3DProps {
  estantes: Estante[]
  productosCriticosPorEstante?: Record<string, number>
  onSelectEstante: (estante: Estante) => void
}

function parsePosicion(codigo: string, indice: number): [number, number] {
  const m = codigo.match(/^([A-Za-z]+)-?(\d+)/)
  if (!m) return [Math.floor(indice / 4), indice % 4]
  return [m[1].toUpperCase().charCodeAt(0) - 65, parseInt(m[2], 10) - 1]
}

export function ShelfMap3D({ estantes, productosCriticosPorEstante, onSelectEstante }: ShelfMap3DProps) {
  const bloques = useMemo(() => {
    const lista = estantes.map((e, i) => {
      const [fila, col] = parsePosicion(e.codigo, i)
      const criticos = productosCriticosPorEstante?.[e.id] ?? 0
      return { e, fila, col, estado: (criticos > 0 ? 'critico' : 'normal') as 'normal' | 'critico' }
    })
    const maxCol = Math.max(0, ...lista.map((b) => b.col))
    const maxFila = Math.max(0, ...lista.map((b) => b.fila))
    return lista.map((b) => ({
      ...b,
      pos: [(b.col - maxCol / 2) * 2.2, 0, (b.fila - maxFila / 2) * 2.6] as [number, number, number],
    }))
  }, [estantes, productosCriticosPorEstante])

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-b from-sky-50 via-cream to-mint-50 shadow-card">
      <Canvas shadows dpr={[1, 1.5]} camera={{ position: [7, 7, 9], fov: 42 }} aria-label="Mapa 3D de estantes">
        <color attach="background" args={['#F7F5F0']} />
        <fog attach="fog" args={['#F7F5F0', 18, 40]} />
        <ambientLight intensity={0.7} />
        <hemisphereLight args={['#FFFFFF', '#E1F0E6', 0.5]} />
        <directionalLight castShadow position={[6, 12, 6]} intensity={1.1} shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15} />
        <Suspense fallback={<Loader3D />}>
          {bloques.map((b) => (
            <EstanteBlock3D key={b.e.id} estante={b.e} position={b.pos} estado={b.estado} onClick={onSelectEstante} />
          ))}
          <CruzFarmacia color={PASTEL.sage} position={[0, 0.6, Math.min(0, ...bloques.map((b) => b.pos[2])) - 2.5]} scale={1.2} />
          <Floor />
        </Suspense>
        <OrbitControls enablePan enableZoom maxPolarAngle={Math.PI / 2.2} minDistance={4} maxDistance={28} target={[0, 0.8, 0]} />
      </Canvas>
      <div className="pointer-events-none absolute left-4 top-4 flex gap-2 text-[11px]">
        <span className="rounded-full bg-white/85 px-2.5 py-1 text-ink-muted shadow-soft"><span className="mr-1 inline-block h-2 w-2 rounded-full bg-mint-300" />Normal</span>
        <span className="rounded-full bg-white/85 px-2.5 py-1 text-ink-muted shadow-soft"><span className="mr-1 inline-block h-2 w-2 rounded-full bg-butter-300" />Stock crítico</span>
      </div>
    </div>
  )
}
