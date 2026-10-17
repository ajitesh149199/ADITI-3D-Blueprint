
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { ACESFilmicToneMapping } from 'three'

import { LoadingOverlay } from './LoadingOverlay'
import { StudioLights } from './StudioLights'
import { BlueprintGrid } from './BlueprintGrid'

export function SceneCanvas({
  children,
  camera = { position: [0, 0.4, 4.2], fov: 42 },
  style,
}) {
  return (
    <Canvas
      dpr={1}
      shadows={false}
      camera={camera}
      gl={{
        antialias: false,
        powerPreference: 'default',
        toneMapping: ACESFilmicToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.55
      }}
      style={style}
    >
      <Suspense fallback={<LoadingOverlay />}>
        <StudioLights />
        <BlueprintGrid />
        {children}
      </Suspense>
    </Canvas>
  )
}
