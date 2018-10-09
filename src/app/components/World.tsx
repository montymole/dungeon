import * as React from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon';
global['THREE'] = THREE;
import '../../../node_modules/three/examples/js/controls/OrbitControls';
import '../../../node_modules/three/examples/js/renderers/CSS3DRenderer';

const fixedTimeStep = 1.0 / 60.0; // seconds
export default class World extends React.Component<any, any> {
  domRoot: HTMLElement;
  lastFrameTime: number;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  light: THREE.PointLight;
  ambientLight: THREE.AmbientLight;
  controls: THREE.OrbitControls;
  css3DScene: THREE.Scene;
  css3Drenderer: THREE.CSS3DRenderer;
  raycaster: THREE.Raycaster;
  mouse3D: THREE.Vector3;
  physics: any;

  constructor(props) {
    super(props);
    if (!this.physics) {
      // Setup our world
      this.physics = new CANNON.World();
      this.physics.gravity.set(0, 0, -0.9); // m/s²
      // Create a plane
      const groundBody = new CANNON.Body({
        mass: 0 // mass == 0 makes the body static
      });
      const groundShape = new CANNON.Plane();
      groundBody.addShape(groundShape);
      this.physics.addBody(groundBody);
      this.raycaster = new THREE.Raycaster();
    }
  }


  componentDidMount () {
    const { onInit } = this.props;
    this.initWebGL(this.domRoot);
    this.initCSS3D(this.domRoot);
    if (onInit) { onInit(this); }
    this.renderAnimationFrame();
  }

  initWorld (domRoot) {
    this.domRoot = domRoot;
  }

  initWebGL (containerEl) {
    const width = containerEl.offsetWidth;
    const height = containerEl.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.zIndex = '1';
    containerEl.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    // default camera
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.2, 2.5);
    this.scene.add(this.camera);
    // add subtle blue ambient lighting
    this.ambientLight = new THREE.AmbientLight(0x000080);
    this.scene.add(this.ambientLight);
    // lighting
    this.light = new THREE.PointLight(0xffeedd, 5.5, 1000);
    this.light.position.set(10, 10, 10);
    this.scene.add(this.light);
    // controls
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.target = new THREE.Vector3(0, 0.6, 0);
    return this.renderer.domElement;
  }

  initCSS3D (containerEl) {
    const width = containerEl.offsetWidth;
    const height = containerEl.offsetHeight;
    this.css3Drenderer = new THREE.CSS3DRenderer();
    this.css3Drenderer.setSize(width, height);
    this.css3Drenderer.domElement.style.position = 'absolute';
    this.css3Drenderer.domElement.style.top = '0';
    this.css3Drenderer.domElement.style.zIndex = '2';
    containerEl.appendChild(this.css3Drenderer.domElement);
    this.css3DScene = new THREE.Scene();
    return this.css3Drenderer.domElement;
  }

  onWorldClick (e) {
    const mouse = {
      x: (e.clientX / this.props.width) * 2 - 1,
      y: -(e.clientY / this.props.height) * 2 + 1,
      z: 0.5
    };
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(mouse, this.camera);
    // calculate objects intersecting the picking ray
    const intersections = this.raycaster.intersectObjects(this.scene.children, true);
    console.log('3D WORLD', mouse, intersections, this.scene);
  }

  renderAnimationFrame (now: number = 0) {
    requestAnimationFrame(t => this.renderAnimationFrame(t));
    if (this.lastFrameTime) {
      const delta = (now - this.lastFrameTime) / 1000;
      this.physics.step(fixedTimeStep, delta, 10);
      this.scene.children
        .filter((c: any) => c.renderAnimationFrame)
        .forEach((c: any) => c.renderAnimationFrame(now));
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.css3Drenderer.render(this.css3DScene, this.camera);
    this.lastFrameTime = now;
  }

  render () {
    const { children } = this.props;
    return (
      <div className="world" ref={domRoot => this.initWorld(domRoot)} onClick={this.onWorldClick.bind(this)} >
        {children}
      </div>
    );
  }
}
