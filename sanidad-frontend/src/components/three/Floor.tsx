import { ContactShadows } from '@react-three/drei'
import { PASTEL } from './Primitivas'

export function Floor({ tamano = 40 }: { tamano?: number }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[tamano, tamano]} />
        <meshStandardMaterial color={PASTEL.crema} roughness={1} />
      </mesh>
      <gridHelper args={[tamano, tamano, '#E6DFD2', '#EFE9DE']} position={[0, 0, 0]} />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.35} scale={tamano} blur={2.4} far={6} />
    </group>
  )
}
