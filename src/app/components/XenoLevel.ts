declare var THREE: any;
import { difference } from 'ramda';
import { TILE_TYPE, TILE_SUB_TYPE } from '../../dungeon/constants';
import { ReactThree, ThreeObj } from './ReactThree';
import * as CANNON from 'cannon';

export class XenoLevel extends ReactThree {
  threeClass = XenoLevel3D;
}

class XenoLevel3D extends ThreeObj {
  geo: any;

  async init(props) {
    await super.init(props);
    this.initGraphics();
  }
  async initGraphics() {
    // this.boxHelper({ x: -1, y: -1, z: -1 }, { x: 1, y: 1, z: 1 });
    this.halfpipe(20, 20);
  }
  renderAnimationFrame(now, delta) {
    const t = now * 0.001;
    let i = 0;
    this.geo.vertices.forEach(v => {
      v.z = (v.z * 0.9) + ((Math.sin(t + v.x) * Math.cos(t + v.y * 0.1)) * 0.1);
      if (Math.random() < 0.001 * Math.sin(t) && v.z < 0.1)
        v.z -= Math.random();
    })
    this.geo.verticesNeedUpdate = true;;

  };
  boxHelper(p1: any, p2: any) {
    const box = new THREE.Box3();
    box.set(new THREE.Vector3(p1.x, p1.y, p1.z), new THREE.Vector3(p2.x, p2.y, p2.z));
    const helper = new THREE.Box3Helper(box, 0xffff00);
    this.add(helper);
  }


  halfpipe(w: number, h: number) {
    const d = 128;
    this.geo = new THREE.PlaneGeometry(w, h, d, d);
    const material = new THREE.MeshBasicMaterial({
      color: 0xdddddd,
      wireframe: true
    });
    const mesh = new THREE.Mesh(this.geo, material);
    this.add(mesh);
  }
}