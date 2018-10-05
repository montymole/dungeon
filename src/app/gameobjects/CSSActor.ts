import * as THREE from 'three';
import '../../../node_modules/three/examples/js/renderers/CSS3DRenderer';
const SCALE = 0.01;
export class CSSActor extends THREE.CSS3DObject {
  props: any;
  constructor(
    props = {
      element: null,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    }
  ) {
    super(props.element);
    this.setProps(props);
    this.scale.set(SCALE, SCALE, SCALE);
  }
  setProps (props) {
    this.props = props;
    const { position, rotation } = this.props;
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
