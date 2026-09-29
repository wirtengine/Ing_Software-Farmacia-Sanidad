import { Component, Suspense, type ReactNode } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

/** Colores pastel para los modelos 3D (estilo farmacia). */
export const PASTEL = {
  menta: '#A8E6CF',
  sage: '#7DB892',
  lavanda: '#C9B8F0',
  rosa: '#F5B7C3',
  cielo: '#A9D4F0',
  mantequilla: '#FBE3A0',
  crema: '#FFF9F0',
  blanco: '#FFFFFF',
  aluminio: '#DDE3E8',
}

class LimiteErrores extends Component<{ fallback: ReactNode; children: ReactNode }, { error: boolean }> {
  state = { error: false }
  static getDerivedStateFromError() { return { error: true } }
  render() { return this.state.error ? this.props.fallback : this.props.children }
}

function MaterialConTextura({ url }: { url: string }) {
  const tex = useTexture(url)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return <meshStandardMaterial map={tex} roughness={0.45} />
}

/**
 * Material de "etiqueta": usa la foto del producto como textura si existe;
 * si no hay foto (o falla la carga) usa un color pastel.
 */
export function MaterialEtiqueta({ url, color }: { url?: string; color: string }) {
  const fallback = <meshStandardMaterial color={color} roughness={0.5} />
  if (!url) return fallback
  return (
    <LimiteErrores fallback={fallback}>
      <Suspense fallback={fallback}>
        <MaterialConTextura url={url} />
      </Suspense>
    </LimiteErrores>
  )
}

/** Cápsula bicolor hecha con primitivas (cilindro + 2 esferas). */
export function Capsula({
  colorA = PASTEL.rosa, colorB = PASTEL.blanco, escala = 1, ...props
}: { colorA?: string; colorB?: string; escala?: number } & JSX.IntrinsicElements['group']) {
  const r = 0.28 * escala
  const h = 0.55 * escala
  return (
    <group {...props}>
      <mesh position={[0, h / 4, 0]} castShadow>
        <cylinderGeometry args={[r, r, h / 2, 32]} />
        <meshStandardMaterial color={colorA} roughness={0.25} />
      </mesh>
      <mesh position={[0, h / 2, 0]} castShadow>
        <sphereGeometry args={[r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={colorA} roughness={0.25} />
      </mesh>
      <mesh position={[0, -h / 4, 0]} castShadow>
        <cylinderGeometry args={[r, r, h / 2, 32]} />
        <meshStandardMaterial color={colorB} roughness={0.25} />
      </mesh>
      <mesh position={[0, -h / 2, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={colorB} roughness={0.25} />
      </mesh>
    </group>
  )
}

/** Cruz de farmacia en 3D. */
export function CruzFarmacia({ color = PASTEL.sage, ...props }: { color?: string } & JSX.IntrinsicElements['group']) {
  return (
    <group {...props}>
      <mesh castShadow>
        <boxGeometry args={[0.35, 1, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[1, 0.35, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
    </group>
  )
}

export function prefiereMenosMovimiento() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}
