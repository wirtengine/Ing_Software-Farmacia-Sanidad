import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { Group } from 'three'
import { Capsula, PASTEL } from './Primitivas'

export function Loader3D() {
  const ref = useRef<Group>(null)
  useFrame((_, d) => { if (ref.current) ref.current.rotation.z += d * 2 })
  return (
    <group>
      <group ref={ref}><Capsula colorA={PASTEL.lavanda} colorB={PASTEL.blanco} rotation={[0, 0, Math.PI / 4]} /></group>
      <Html center position={[0, -0.9, 0]}>
        <p className="whitespace-nowrap text-xs font-medium text-ink-muted">Preparando vista 3D…</p>
      </Html>
    </group>
  )
}
