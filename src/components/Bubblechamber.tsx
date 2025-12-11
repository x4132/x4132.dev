import { Canvas } from "@react-three/fiber";
import EventManager from "./EventManager";

export default function Bubblechamber() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ background: "#0F131C" }}
    >
      <EventManager
        spawnInterval={3000}
        cleanupDelay={12000}
        maxActiveEvents={6}
        bounds={{ x: 3, y: 2 }}
        bField={3}
      />
    </Canvas>
  );
}
