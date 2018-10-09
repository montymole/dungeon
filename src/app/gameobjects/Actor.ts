import * as THREE from 'three';
export class Actor extends THREE.Object3D {
  mesh: any;
  material: any;
  constructor(props) {
    super();
    this.init();
    this.update(props);
  }
  init () {
    this.material = new THREE.MeshPhongMaterial({
      transparent: true,
      specular: 0xFFFFFF,
      color: 0x880000,
      emissive: 0x000000,
      shininess: 10,
      opacity: 0.7
    });
    this.mesh = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), this.material);
    this.add(this.mesh);
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
