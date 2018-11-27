import * as THREE from "three";
global["THREE"] = THREE;
import "../../../node_modules/three/examples/js/controls/OrbitControls";
import * as TweenMax from "gsap/umd/TweenMax";

import { ReactThree } from "./ReactThree";
import { World } from "./World";
import { VIEW_RADIUS } from "../../dungeon/constants";

export class Player extends ReactThree {
  threeClass = Player3D;
}
class Player3D extends THREE.Object3D {
  world: World;
  light: THREE.PointLight;
  camera: THREE.Camera;
  controls: THREE.OrbitControls;

  constructor(props) {
    super();
    this.init(props);
    this.update(props);
  }
  init (props) {
    const { world, position } = props;
    const { x, y, z } = position;
    this.world = world;
    this.position.set(x, y, z);
    // setup camera
    const size = world.renderer.getSize();
    const aspect = size.width / size.height;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 20, 5);
    world.camera = this.camera;
    world.cameraTarget = this.position;
    this.add(this.camera);
    // controls
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.target = this.position;
    // lighting
    this.light = new THREE.PointLight(0xffffff, 3.5, VIEW_RADIUS, 4);
    this.light.position.set(0, 2, 0);
    this.light.castShadow = true;
    // shadow properties for the light
    this.light.shadow.mapSize.width = 512; // default
    this.light.shadow.mapSize.height = 512; // default
    this.light.shadow.camera.near = 1; // default 0.5
    this.light.shadow.camera.far = VIEW_RADIUS; // default 500
    /*w
    const helper = new THREE.CameraHelper(this.light.shadow.camera);
    world.scene.add(helper);
    */
    this.add(this.light);
    // test avatar (just cube)
    const avatar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    avatar.castShadow = true; // default is false
    avatar.receiveShadow = true; // default is false
    avatar.position.set(0, 0.95, 0);
    this.add(avatar);
    // add to scene
    world.scene.add(this);
  }
  update (props) {
    const { position } = props;
    if (position) this.moveTo(position);
  }
  moveTo (position) {
    // https://greensock.com/docs/TweenMax/TweenMax()
    TweenMax.to(this.position, 0.5, position);
  }

  // this is called every frame;
  renderAnimationFrame (now, delta) {
    // light
    this.light.intensity = 6 + 0.1 * Math.sin(now * 0.02);
    this.light.shadow.camera.far = this.light.distance;
    this.controls.update();
  }
}
