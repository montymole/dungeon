import * as THREE from 'three';
import '../../../node_modules/three/examples/js/renderers/CSS3DRenderer';
const SCALE = 0.01;
export class CSSActor extends THREE.CSS3DObject {
  constructor(props) {
    super(props.element);
    this.scale.set(SCALE, SCALE, SCALE);
    this.update(props);
  }
  update (props) {
    const { position, rotation } = props;
    if (position) {
      this.position.x = position.x;
      this.position.y = position.y;
      this.position.z = position.z;
    }
    if (rotation) {
      this.rotation.x = rotation.x;
      this.rotation.y = rotation.y;
      this.rotation.z = rotation.z;
    }
  }
}
