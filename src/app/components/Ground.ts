declare var THREE: any;
import { Landscape } from '../../dungeon/Landscape';
import { ReactThree, ThreeObj } from './ReactThree';

export class Ground extends ReactThree {
  threeClass = Ground3D;
}

class Ground3D extends ThreeObj {
  seed: string;
  landscape: Landscape;

  async init(props) {
    this.seed = 'LAND';
    this.landscape = new Landscape(this.seed);
    this.landscape.generate({ detail: 3 });
    this.initGraphics();
    await super.init(props);
    console.log('pass123');
  }

  initGraphics() {
    // draw it

    const geometry = new THREE.PlaneBufferGeometry(10, 10, this.landscape.size - 1, this.landscape.size - 1);
    geometry.rotateX(-Math.PI / 2);

    const vertices = geometry.attributes.position.array;

    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = this.landscape.map[i] * 0.1;
    }

    // this.position.set(-this.landscape.size / 2, 0, -this.landscape.size / 2);

    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });

    const mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);
  }

  destroy() {
    this.world.scene.remove(this);
  }
}
