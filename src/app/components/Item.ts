declare var global: any;
import * as THREE from 'three';
global.THREE = THREE;
import * as TweenMax from 'gsap/umd/TweenMax';
import { ReactThree } from './ReactThree';
import { World } from './World';

export class Item extends ReactThree {
  threeClass = Item3D;
}

class Item3D extends THREE.Object3D {
  world: World;

  constructor(props) {
    super();
    this.init(props);
    this.update(props);
  }
  init(props) {
    const { world, position } = props;
    const { x, y, z } = position;
    this.world = world;
    this.position.set(x, y, z);
    // test avatar (just cube)
    const avatar = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    avatar.castShadow = true; // default is false
    avatar.receiveShadow = true; // default is false
    avatar.position.set(0, 0, 0);
    this.add(avatar);
    // add to scene
    world.scene.add(this);
  }
  update(props) {
    const { position } = props;
    if (position) {
      this.moveTo(position);
    }
  }
  moveTo(position) {
    TweenMax.to(this.position, 0.5, position);
  }
}
