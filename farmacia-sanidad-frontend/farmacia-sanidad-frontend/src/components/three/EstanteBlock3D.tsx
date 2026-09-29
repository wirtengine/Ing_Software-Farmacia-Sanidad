import { useMemo, useState } from 'react'
import { animated, useSpring } from '@react-spring/three'
import { Html, RoundedBox } from '@react-three/drei'
import type { Estante } from '@/types/domain'
import { PASTEL } from './Primitivas'

interface EstanteBlock3DProps {
  estante: Estante
  position: [number, number, number]
  estado: 'normal' | 'critico' | 'proximo-vencer'
  seleccionado?: boolean
  onClick: (estante: Estante) => void
}

const colorEstado = { normal: PASTEL.menta, critico: PASTEL.mantequilla, 'proximo-vencer': PASTEL.rosa }
const coloresCajas = [PASTEL.lavanda, PASTEL.rosa, PASTEL.cielo, PASTEL.mantequilla, PASTEL.menta]

/** Estante procedural: laterales, 3 repisas y cajitas pastel. */
export function EstanteBlock3D({ estante, position, estado, seleccionado, onClick }: EstanteBlock3DProps) {
  const [hover, setHover] = useState(false)
  const { y, s } = useSpring({ y: hover || seleccionado ? 0.25 : 0, s: hover ? 1.04 : 1, config: { tension: 280, friction: 20 } })

  // Cajitas deterministas según el código del estante
  const cajas = useMemo(() => {
    let semilla = [...estante.codigo].reduce((a, c) => a + c.charCodeAt(0), 0)
    const rnd = () => { semilla = (semilla * 9301 + 49297) % 233280; return semilla / 233280 }
    const lista: { pos: [number, number, number]; tam: [number, number, number]; color: string }[] = []
    ;[0.35, 0.95, 1.55].forEach((alt) => {
      let x = -0.6
      while (x < 0.55) {
        const w = 0.18 + rnd() * 0.18
        const h = 0.2 + rnd() * 0.22
        if (rnd() > 0.2) lista.push({ pos: [x + w / 2, alt + h / 2, 0], tam: [w, h, 0.3], color: coloresCajas[Math.floor(rnd() * coloresCajas.length)] })
        x += w + 0.05
      }
    })
    return lista
  }, [estante.codigo])

  const madera = estante.activo ? '#F3E9DA' : '#E3DED6'
  const acento = colorEstado[estado]

  return (
    <animated.group position-x={position[0]} position-z={position[2]} position-y={y} scale={s}>
      <group
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto' }}
        onClick={(e) => { e.stopPropagation(); onClick(estante) }}
      >
        {[-0.72, 0.72].map((x) => (
          <mesh key={x} position={[x, 1, 0]} castShadow>
            <boxGeometry args={[0.06, 2, 0.5]} />
            <meshStandardMaterial color={madera} roughness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 1, -0.23]}>
          <boxGeometry args={[1.5, 2, 0.04]} />
          <meshStandardMaterial color={madera} roughness={0.9} />
        </mesh>
        {[0.05, 0.65, 1.25, 1.85].map((alt) => (
          <mesh key={alt} position={[0, alt, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.06, 0.5]} />
            <meshStandardMaterial color={madera} roughness={0.8} />
          </mesh>
        ))}
        {estante.activo && cajas.map((c, i) => (
          <RoundedBox key={i} args={c.tam} radius={0.02} position={c.pos} castShadow>
            <meshStandardMaterial color={c.color} roughness={0.5} />
          </RoundedBox>
        ))}
        {/* Letrero con el estado */}
        <RoundedBox args={[0.9, 0.3, 0.06]} radius={0.05} position={[0, 2.25, 0]}>
          <meshStandardMaterial color={acento} emissive={acento} emissiveIntensity={hover ? 0.35 : 0.12} />
        </RoundedBox>
        <Html center position={[0, 2.25, 0.05]} distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <span className="rounded-full bg-white/90 px-2 py-0.5 font-mono text-[11px] font-semibold text-ink shadow-soft">
            {estante.codigo}
          </span>
        </Html>
        {hover && (
          <Html center position={[0, 2.8, 0]} style={{ pointerEvents: 'none' }}>
            <div className="whitespace-nowrap rounded-xl border border-border-soft bg-white px-3 py-2 shadow-modal">
              <p className="font-mono text-xs font-semibold text-ink">{estante.codigo}</p>
              {estante.descripcion && <p className="text-[11px] text-ink-muted">{estante.descripcion}</p>}
              {estante.ubicacionFisica && <p className="text-[10px] text-ink-subtle">{estante.ubicacionFisica}</p>}
              {!estante.activo && <p className="text-[10px] text-danger">Inactivo</p>}
            </div>
          </Html>
        )}
      </group>
    </animated.group>
  )
}
