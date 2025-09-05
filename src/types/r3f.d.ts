/* Ensures JSX.IntrinsicElements includes React Three Fiber elements */
import "@react-three/fiber";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      spotLight: any;
      mesh: any;
      group: any;
      boxGeometry: any;
      sphereGeometry: any;
      planeGeometry: any;
      coneGeometry: any;
      torusGeometry: any;
      cylinderGeometry: any;
      ringGeometry: any;
      dodecahedronGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      float: any;
      rotator: any;
      skillNode: any;
      starfield: any;
    }
  }
}
