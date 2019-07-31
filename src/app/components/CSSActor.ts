import * as CANNON from 'cannon';
import * as THREE from 'three';
import 'three/examples/js/renderers/CSS3DRenderer';
import { ReactThree } from './ReactThree';

export class CSSActor extends ReactThree {
  threeClass = CSSActor3D;
  hasElement = true;
}

const SCALE = 0.1;
const CANNON_SCALE = 0.01;

class CSSActor3D extends THREE.CSS3DObject {
  world: any; // this world
  body: any; // physics body
  constructor(props) {
    super(props.element);
    this.scale.set(SCALE, SCALE, SCALE);
    this.init(props);
    this.update(props);
  }
  init(props) {
    const { world, mass = 0, position, onCollide } = props;
    // physics
    this.body = new CANNON.Body({
      mass,
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape: new CANNON.Box(
        new CANNON.Vec3(CANNON_SCALE, CANNON_SCALE, CANNON_SCALE)
      )
    });
    this.world = world;
    if (onCollide) {
      this.body.addEventListener('collide', onCollide);
    }
    if (world && world.physics) {
      world.physics.addBody(this.body);
    }
    if (world && world.scene) {
      world.css3DScene.add(this);
    }
  }
  destroy() {
    try {
      this.world.physics.remove(this.body);
      this.world.css3DScene.remove(this);
    } catch (err) {
      console.error(err);
    }
  }
  update(props) {
    const { position, rotation } = props;
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
  renderAnimationFrame(clock) {
    this.position.x = this.body.position.x;
    this.position.y = this.body.position.y;
    this.position.z = this.body.position.z;
    /*
    this.quaternion.x = this.body.quaternion.x;
    this.quaternion.y = this.body.quaternion.y;
    this.quaternion.z = this.body.quaternion.z;
    this.quaternion.w = this.body.quaternion.w;
    */
  }
}
