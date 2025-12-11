import { Canvas } from "@react-three/fiber"
import Electron from "./bc/Electron"

export default function Bubblechamber() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ background: "#0F131C" }}>
      <Electron startPosition={[0, 0, 0]} initialMomentum={5} charge={-1} bField={3} />
    </Canvas>
  )
}
