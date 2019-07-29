import * as TweenMax from 'gsap/umd/TweenMax';
import * as THREE from 'three';
import '../../../node_modules/three/examples/js/controls/TrackballControls';

import { PLAYER_ACTIONS, VIEW_RADIUS } from '../../dungeon/constants';
import { ReactThree, ThreeObj } from './ReactThree';

export class Player extends ReactThree {
  threeClass = Player3D;
}
class Player3D extends ThreeObj {
  mixer: THREE.AnimationMixer;
  animations: any = {}; // animation map
  currentActionName: string;
  action: THREE.AnimationAction; // current animation
  movementTween: any; // current movement animation state
  light: THREE.PointLight;
  avatarContainer: THREE.Object3D; // contains light, camera and avatar
  avatar: THREE.Object3D; // 3d object
  direction: THREE.Vector3;
  camera: THREE.Camera;
  controls: THREE.TrackballControls;

  findObjectByName(name) {
    const obj = this.glb.scene.children.find((c) => c.name === name);
    return obj;
  }

  mapAllAnimations() {
    if (this.glb) {
      this.glb.animations.forEach((animation) => {
        this.animations[animation.name] = animation;
        console.log('PLAYER NOW HAS ANIMATION:', animation.name);
      });
    }
  }

  findAnimationByName(name) {
    const animation = this.glb.animations.find((c) => c.name === name);
    return animation;
  }

  fallbackAvatar() {
    return new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  }

  async init(props) {
    this.glbSrc = '/gltf/mixamo.gltf';
    this.direction = new THREE.Vector3(0, 0, 0);
    await super.init(props);
    const { position } = props;
    const { x, y, z } = position;
    this.position.set(x, y, z);
    // setup camera
    const size = this.world.renderer.getSize();
    const aspect = size.width / size.height;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 10, 5);
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
    this.light = new THREE.PointLight(0xffffff, 20, VIEW_RADIUS, 4);
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
    this.avatar = this.findObjectByName('PLAYER') || this.fallbackAvatar();
    this.avatar.castShadow = true; // default is false
    this.avatar.receiveShadow = true; // default is false
    this.avatarContainer.add(this.avatar);
    if (!this.glb) { this.avatar.position.set(0, 0.95, 0); }
    else {
      this.avatar.position.set(0, 0.2, 0);
      // setup animations
      this.mixer = new THREE.AnimationMixer(this.avatar);
      this.mapAllAnimations();
    }
    this.add(this.avatarContainer);
  }
  fadeToAction(name) {
    if (!this.animations || !this.animations[name] || this.currentActionName === name) { return; }
    console.log('NEXT ACTION->', name);
    const nextAction = this.mixer.clipAction(this.animations[name]).play();
    nextAction.enabled = true;
    if (this.action) { this.action.crossFadeTo(nextAction, 0.5, false); }
    this.action = nextAction;
    this.currentActionName = name;
  }
  async update(props) {
    const { position, action } = props;
    if (position) { await this.moveTo(position); }
    switch (action) {
      case PLAYER_ACTIONS.SHOOT:
        this.shoot();
    }
  }
  async moveTo(position) {
    if (this.position.distanceTo(position) === 0) { return; }
    this.direction.subVectors(this.position, position).normalize();
    if (this.avatarContainer) {
      // https://greensock.com/docs/TweenMax/TweenMax()
      // TODO fix so that character rotates the shortest direction
      // start rotate animation
      const angle = Math.atan2(this.direction.x, this.direction.z);
      TweenMax.to(this.avatarContainer.rotation, 0.5, { y: angle });
    }
    if (this.movementTween && this.movementTween.isActive()) {
      // delete old tween
      this.movementTween.kill();
    }
    // start running if already walking
    this.fadeToAction(this.currentActionName === 'WALK' ? 'RUN' : 'WALK');
    return new Promise((resolve) => {
      this.movementTween = TweenMax.to(this.position, 0.5, {
        ...position,
        onComplete: () => {
          this.fadeToAction('IDLE');
          resolve(true);
        }
      });
    });
  }
  shoot() {
    // play shoot animation
    this.fadeToAction('SHOOT');
  }
  // this is called every frame;
  renderAnimationFrame(now, delta) {
    // animation
    if (this.mixer) {
      this.mixer.update(delta);
    }
    // light
    // this.light.intensity = 6 + 0.1 * Math.sin(now * 0.02);
    // this.light.shadow.camera.far = this.light.distance;
    this.controls.update();
  }
}
