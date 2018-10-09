import * as THREE from 'three';
import * as CANNON from 'cannon';
export class Actor extends THREE.Object3D {
  mesh: any;            // mesh
  material: any;        // material
  body: any;             // physics body
  constructor(props) {
    super();
    this.init(props);
    this.update(props);
  }

  init (props) {
    const { world, mass = 0 } = props;
    this.body = new CANNON.Body({
      mass: 5, // kg
      position: new CANNON.Vec3(0, 0, 0),
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
    });
    if (world && world.physics)
      world.physics.addBody(this.body);
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
    if (world && world.scene)
      world.scene.add(this);
  }
  update (props) {
    const { position, rotation, mass } = props;
    if (position) {
      this.body.position.x = position.x;
      this.body.position.y = position.y;
      this.body.position.z = position.z;
    }
    if (rotation) {
      this.rotation.x = rotation.x;
      this.rotation.y = rotation.y;
      this.rotation.z = rotation.z;
    }
  }
  // this is called every frame;
  renderAnimationFrame (clock) {
    this.position.x = this.body.position.x;
    this.position.y = this.body.position.y;
    this.position.z = this.body.position.z;
    this.quaternion.x = this.body.quaternion.x;
    this.quaternion.y = this.body.quaternion.y;
    this.quaternion.z = this.body.quaternion.z;
    this.quaternion.w = this.body.quaternion.w;
  }
}
