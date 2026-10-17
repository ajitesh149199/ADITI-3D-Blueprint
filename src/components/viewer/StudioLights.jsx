export function StudioLights() {
  return (
    <>
      <color attach="background" args={['#050910']} />
      <hemisphereLight args={['#d7ecff', '#1a2838', 1.05]} />
      <ambientLight intensity={0.72} />
      <directionalLight
        position={[4.5, 6, 4]}
        intensity={2.15}
        color="#f4fbff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 3, 2]} intensity={1.15} color="#7dd3fc" />
      <directionalLight position={[0.5, 2.4, -5]} intensity={1.05} color="#ffffff" />
      <spotLight position={[0, 7, 3]} angle={0.5} penumbra={0.7} intensity={1.35} color="#e0f7ff" />
    </>
  )
}
