import * as React from "react";
import * as THREE from "three";
import * as CANNON from "cannon";
global["THREE"] = THREE;

import "../../../node_modules/three/examples/js/renderers/CSS3DRenderer";

const fixedTimeStep = 1.0 / 60.0; // seconds
export class World extends React.Component<any, any> {
  domRoot: HTMLElement;
  lastFrameTime: number;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  ambientLight: THREE.AmbientLight;
  css3DScene: THREE.Scene;
  css3Drenderer: THREE.CSS3DRenderer;
  physics: CANNON.World;
  cameraTarget: THREE.Vector3;
  mouse: THREE.Vector2;
  raycaster: THREE.Raycaster;

  constructor(props) {
    super(props);
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    if (!this.physics) {
      this.initPhysics();
    }
  }

  componentDidMount() {
    const { onInit } = this.props;
    this.initWebGL(this.domRoot);
    this.initCSS3D(this.domRoot);

    if (onInit) {
      onInit(this);
    }
    this.renderAnimationFrame();
  }

  initPhysics() {
    const gravity = { x: 0, y: 0, z: -9.8 };
    this.physics = new CANNON.World();
    this.physics.gravity.set(gravity.x, gravity.y, gravity.z);
    console.log("NEW PHYSICS");
  }

  initWorld(domRoot) {
    this.domRoot = domRoot;
  }

  initWebGL(containerEl) {
    const { width, height, camera } = this.props;
    this.renderer = new THREE.WebGLRenderer({ clearColor: 0x000000, clearAlpha: 1, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.zIndex = "1";
    containerEl.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    // default camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(camera.x, camera.y, camera.z);
    this.cameraTarget = new THREE.Vector3(0, 0, 0);
    this.scene.add(this.camera);
    return this.renderer.domElement;
  }

  initCSS3D(containerEl) {
    const { width, height } = this.props;
    this.css3Drenderer = new THREE.CSS3DRenderer();
    this.css3Drenderer.setSize(width, height);
    this.css3Drenderer.domElement.style.position = "absolute";
    this.css3Drenderer.domElement.style.top = "0";
    this.css3Drenderer.domElement.style.zIndex = "2";
    containerEl.appendChild(this.css3Drenderer.domElement);
    this.css3DScene = new THREE.Scene();
    return this.css3Drenderer.domElement;
  }

  renderAnimationFrame(now: number = 0) {
    requestAnimationFrame(t => this.renderAnimationFrame(t));
    if (this.lastFrameTime) {
      const delta = (now - this.lastFrameTime) / 1000;
      this.physics.step(fixedTimeStep, delta, 10);
      this.css3DScene.children.filter((c: any) => c.renderAnimationFrame).forEach((c: any) => c.renderAnimationFrame(now, delta));
      this.scene.children.filter((c: any) => c.renderAnimationFrame).forEach((c: any) => c.renderAnimationFrame(now, delta));
    }
    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);
    this.css3Drenderer.render(this.css3DScene, this.camera);
    this.lastFrameTime = now;
  }

  mouseDown(event) {
    const { mouse, raycaster } = this;
    mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length) intersects.some(i => !i.object["onClick"] || i.object["onClick"](i));
  }

  render() {
    const { children, width, height } = this.props;
    const style = { width: `${width}px`, height: `${height}px` };
    return (
      <div style={style} className="world" ref={domRoot => this.initWorld(domRoot)} onMouseDown={e => this.mouseDown(e)}>
        {children}
      </div>
    );
  }
}
