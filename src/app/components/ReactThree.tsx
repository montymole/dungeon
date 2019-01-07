/* ----------------------------------------------------------------------*/
/* react part 
/* ----------------------------------------------------------------------*/
import * as React from 'react';

export abstract class ReactThree extends React.Component<any, any> {
  obj3d: ThreeObj;
  threeClass: any;
  hasElement: boolean = false;
  element: HTMLElement;

  componentDidMount() {
    this.init();
  }
  componentDidUpdate() {
    this.init();
  }
  componentWillUnmount() {
    if (this.obj3d && this.obj3d.destroy) {
      if (this.element) this.element.remove();
      this.obj3d.destroy();
      delete this.obj3d;
      delete this.element;
    }
  }
  init() {
    const { world } = this.props;
    const { element } = this;
    if (!this.obj3d && world) {
      this.obj3d = new this.threeClass({ element, ...this.props });
    } else {
      if (this.obj3d && this.obj3d.update) this.obj3d.update({ ...this.props });
    }
  }
  render() {
    return this.hasElement ? (
      <div
        ref={(element) => {
          if (element) {
            if (element.parentElement) {
              // override functions to prevent crash
              element.parentElement.removeChild = function (n: any) {
                return this;
              };
              element.parentElement.insertBefore = function (n: any) {
                return this;
              };
            }
            this.element = element;
          }
        }}
      >
        {this.props.children}
      </div>
    ) : (
        this.props.children || null
      );
  }
}
/* ----------------------------------------------------------------------*/
/* three object part 
/* ----------------------------------------------------------------------*/

import * as THREE from 'three';
import * as GLTFLoader from 'three-gltf-loader';
global['THREE'] = THREE;

export abstract class ThreeObj extends THREE.Object3D {
  world: any;
  glb: any;
  glbSrc: string;

  constructor(props) {
    super();
    console.log(props);
    this.init(props);
    this.update(props);
  }

  async loadGlb(path) {
    const loader = new GLTFLoader();
    return new Promise((resolve) => {
      loader.load(path, resolve);
    });
  }

  findMeshByName(name) {
    try {
      const SCALE = 0.01;
      const origMesh = this.glb.scene.children.find((c) => c.name === name);
      const mesh = origMesh.clone();
      mesh.scale.set(SCALE, SCALE, SCALE);
      return mesh;
    } catch (error) {
      return null;
    }
  }

  async init(props) {
    const { world } = props;
    this.world = world;
    if (this.glbSrc && !this.glb) {
      this.glb = await this.loadGlb(this.glbSrc);
    }
    if (world && world.scene) world.scene.add(this);
  }

  destroy() {
    this.world.scene.remove(this);
  }

  update(props) { }

  // this is called every frame;
  renderAnimationFrame(clock?, delta?) { }
}
