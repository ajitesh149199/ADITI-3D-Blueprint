import { Grid } from '@react-three/drei'

export function BlueprintGrid() {
  return (
    <Grid
      infiniteGrid
      fadeDistance={18}
      fadeStrength={1.4}
      sectionSize={1.5}
      sectionColor="#1d4ed8"
      sectionThickness={1.1}
      cellSize={0.3}
      cellColor="#164e63"
      cellThickness={0.6}
      position={[0, -1.15, 0]}
    />
  )
}
