import { Canvas } from '@react-three/fiber'
import { ContactShadows, Float } from '@react-three/drei'
import { Capsula, CruzFarmacia, PASTEL, prefiereMenosMovimiento } from './Primitivas'

/** Escena decorativa del login: cápsulas y cruces flotando. */
export function HeroPastillas3D() {
  const velocidad = prefiereMenosMovimiento() ? 0 : 1.6
  const capsulas: { pos: [number, number, number]; rot: [number, number, number]; a: string; b: string; e: number }[] = [
    { pos: [-1.6, 0.8, 0], rot: [0.3, 0, 0.8], a: PASTEL.rosa, b: PASTEL.blanco, e: 1.5 },
    { pos: [1.4, 1.2, -0.5], rot: [0, 0.4, -0.6], a: PASTEL.lavanda, b: PASTEL.blanco, e: 1.3 },
    { pos: [0.2, -0.6, 0.4], rot: [0.6, 0, 1.2], a: PASTEL.menta, b: PASTEL.blanco, e: 1.8 },
    { pos: [-0.9, -1.3, -0.8], rot: [0, 0, 0.3], a: PASTEL.mantequilla, b: PASTEL.blanco, e: 1.1 },
    { pos: [1.9, -0.9, -1], rot: [0.5, 0.2, -1.1], a: PASTEL.cielo, b: PASTEL.blanco, e: 1.2 },
  ]
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 45 }} aria-hidden>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1} />
      <pointLight position={[-4, -2, 2]} intensity={0.5} color="#FAE4E7" />
      {capsulas.map((c, i) => (
        <Float key={i} speed={velocidad} rotationIntensity={1} floatIntensity={1.2}>
          <Capsula colorA={c.a} colorB={c.b} escala={c.e} position={c.pos} rotation={c.rot} />
        </Float>
      ))}
      <Float speed={velocidad} rotationIntensity={0.6} floatIntensity={0.8}>
        <CruzFarmacia color={PASTEL.sage} position={[-0.2, 1.6, -1.2]} scale={0.9} rotation={[0.2, 0.4, 0]} />
      </Float>
      <ContactShadows position={[0, -2.4, 0]} opacity={0.25} scale={10} blur={3} far={4} />
    </Canvas>
  )
}
