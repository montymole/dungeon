declare var THREE: any;

import "../../../node_modules/three/examples/js/controls/TrackballControls";
import * as TweenMax from "gsap/umd/TweenMax";

import { ReactThree, ThreeObj } from "./ReactThree";
import { VIEW_RADIUS } from "../../dungeon/constants";

export class Player extends ReactThree {
  threeClass = Player3D;
}
class Player3D extends ThreeObj {
  animations: any = {}; // animation map
  mixer: THREE.AnimationMixer;
  action: THREE.AnimationAction; // current animation
  movementTween: any; // current movement animation state
  light: THREE.PointLight;
  avatarContainer: THREE.Object3D; // contains light, camera and avatar
  avatar: THREE.Object3D; // 3d object
  direction: THREE.Vector3;
  camera: THREE.Camera;
  controls: THREE.TrackballControls;

  findObjectByName(name) {
    const obj = this.glb.scene.children.find(c => c.name === name);
    return obj;
  }

  findAnimationByName(name) {
    const animation = this.glb.animations.find(c => c.name === name);
    return animation;
  }

  fallbackAvatar() {
    return new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 1),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
  }

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
    this.light.position.set(0, 2.5, 0);
    this.light.castShadow = true;
    // shadow properties for the light
    this.light.shadow.mapSize.width = 512; // default
    this.light.shadow.mapSize.height = 512; // default
    this.light.shadow.camera.near = 1; // default 0.5
    this.light.shadow.camera.far = VIEW_RADIUS; // default 500
    this.add(this.light);
    // test avatar (just cube)
    this.avatarContainer = new THREE.Object3D();
    this.avatar = this.findObjectByName("PLAYER") || this.fallbackAvatar();
    this.avatar.castShadow = true; // default is false
    this.avatar.receiveShadow = true; // default is false
    this.avatarContainer.add(this.avatar);
    if (!this.glb) this.avatar.position.set(0, 0.95, 0);
    else {
      // setup animations
      this.mixer = new THREE.AnimationMixer(this.avatar);
      this.mixer.timeScale = 10;
      this.animations.IDLE = this.findAnimationByName("IDLE");
      this.animations.WALK = this.findAnimationByName("WALK");
    }
    this.add(this.avatarContainer);
  }
  playAnimation(name) {
    console.log("PLAY ANIM", name);
    if (this.mixer && this.animations[name]) {
      if (this.action) this.action.stop();
      this.action = this.mixer.clipAction(this.animations[name]);
      this.action.play();
    }
  }
  stopAnimation() {
    if (this.action) {
      this.action.stop();
    }
  }

  update(props) {
    const { position } = props;
    if (position) this.moveTo(position);
  }
  moveTo(position) {
    // https://greensock.com/docs/TweenMax/TweenMax()
    // test
    this.direction.subVectors(this.position, position).normalize();
    if (this.avatarContainer) {
      // TODO fix so that character rotates the shortest direction
      // start rotate animation
      const angle = Math.atan2(this.direction.x, this.direction.z);
      TweenMax.to(this.avatarContainer.rotation, 0.5, { y: angle });
    }
    if (this.movementTween && this.movementTween.isActive()) {
      // delete old tween
      this.movementTween.kill();
    }
    this.movementTween = TweenMax.to(this.position, 0.5, {
      ...position,
      onComplete: () => {
        this.playAnimation("IDLE");
      }
    });
    this.playAnimation("WALK");
  }
  // this is called every frame;
  renderAnimationFrame(now, delta) {
    // animation
    if (this.mixer) {
      this.mixer.update(delta);
    }
    // light
    this.light.intensity = 6 + 0.1 * Math.sin(now * 0.02);
    this.light.shadow.camera.far = this.light.distance;
    this.controls.update();
  }
}
