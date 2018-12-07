declare var THREE: any;

import "../../../node_modules/three/examples/js/controls/TrackballControls";
import * as TweenMax from "gsap/umd/TweenMax";

import { ReactThree, ThreeObj } from "./ReactThree";
import { VIEW_RADIUS } from "../../dungeon/constants";

export class Player extends ReactThree {
  threeClass = Player3D;
}
class Player3D extends ThreeObj {
  light: THREE.PointLight;
  avatar: THREE.Object3D;
  direction: THREE.Vector3;
  camera: THREE.Camera;
  controls: THREE.TrackballControls;

  async init(props) {
    this.glbSrc = "/gitf/characters.glb";
    this.direction = new THREE.Vector3(0, 0, 0);
    await super.init(props);
    const { position } = props;
    const { x, y, z } = position;
    this.position.set(x, y, z);
    // setup camera
    const size = this.world.renderer.getSize();
    const aspect = size.width / size.height;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 20, 5);
    this.world.camera = this.camera;
    this.world.cameraTarget = this.position;
    this.add(this.camera);
    // controls
    this.controls = new THREE.TrackballControls(this.camera);
    this.controls.noZoom = true;
    this.controls.noPan = true;
    this.controls.keys = [];
    this.controls.target = this.position;
    this.controls.keys = [];
    // lighting
    this.light = new THREE.PointLight(0xffffff, 3.5, VIEW_RADIUS, 4);
    this.light.position.set(0, 2, 0);
    this.light.castShadow = true;
    // shadow properties for the light
    this.light.shadow.mapSize.width = 512; // default
    this.light.shadow.mapSize.height = 512; // default
    this.light.shadow.camera.near = 1; // default 0.5
    this.light.shadow.camera.far = VIEW_RADIUS; // default 500
    /*
    const helper = new THREE.CameraHelper(this.light.shadow.camera);
    world.scene.add(helper);
    */
    this.add(this.light);
    // test avatar (just cube)
    this.avatar =
      this.findMeshByName("PLAYER") ||
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      );
    this.avatar.castShadow = true; // default is false
    this.avatar.receiveShadow = true; // default is false
    if (!this.glb) this.avatar.position.set(0, 0.95, 0);
    this.add(this.avatar);
  }
  update(props) {
    const { position } = props;
    if (position) this.moveTo(position);
  }
  moveTo(position) {
    // https://greensock.com/docs/TweenMax/TweenMax()
    this.direction.subVectors(this.position, position).normalize();
    if (this.avatar) {
      // TODO fix so that rotates shortest direction
      const angle = Math.atan2(this.direction.x, this.direction.z);
      TweenMax.to(this.avatar.rotation, 0.5, { y: angle });
    }
    TweenMax.to(this.position, 0.5, position);
  }
  // this is called every frame;
  renderAnimationFrame(now) {
    // light
    this.light.intensity = 6 + 0.1 * Math.sin(now * 0.02);
    this.light.shadow.camera.far = this.light.distance;
    this.controls.update();
  }
}
