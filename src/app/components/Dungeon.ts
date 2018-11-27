import * as THREE from "three";
import * as GLTFLoader from "three-gltf-loader";
import { difference } from "ramda";
global["THREE"] = THREE;

import { TILE_TYPE, TILE_SUB_TYPE } from "../../dungeon/constants";

import { ReactThree } from "./ReactThree";

export class Dungeon extends ReactThree {
  threeClass = Dungeon3D;
}

class Dungeon3D extends THREE.Object3D {
  glb: any;
  meshMap: any = {};
  visibleMeshes: any = [];
  materials: any = {};

  constructor(props) {
    super();
    this.init(props);
    this.update(props);
  }

  async loadGlb (path) {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(path, resolve);
    });
  }

  findMeshByName (name) {
    const SCALE = 0.01;
    const origMesh = this.glb.scene.children.find(c => c.name === name);
    const mesh = origMesh.clone();
    // mesh.material = this.materials[name] || origMesh.material;
    mesh.scale.set(SCALE, SCALE, SCALE);
    return mesh;
  }

  async init (props) {
    const { glbSrc = "/gitf/test.glb", tiles, world } = props;
    if (!this.glb) {
      // load object data
      this.glb = await this.loadGlb(glbSrc);
      this.materials.CORNER = this.materials.FLOOR = new THREE.MeshPhongMaterial(
        { color: 0x202020 }
      );
      this.materials.WALL = new THREE.MeshPhongMaterial({ color: 0x606080 });
      this.materials.DOOR = new THREE.MeshPhongMaterial({ color: 0x6060a0 });
    }
    tiles.forEach(tile => {
      let tileMesh;
      switch (tile.type) {
        case TILE_TYPE.WALL:
        case TILE_TYPE.CORRIDOR_WALL:
          switch (tile.subtype) {
            case TILE_SUB_TYPE.TOP_LEFT_CORNER:
            case TILE_SUB_TYPE.TOP_RIGHT_CORNER:
            case TILE_SUB_TYPE.BOTTOM_LEFT_CORNER:
            case TILE_SUB_TYPE.BOTTOM_RIGHT_CORNER:
              tileMesh = this.findMeshByName("CORNER");
              break;
            default:
              tileMesh = this.findMeshByName("WALL");
              break;
          }
          break;
        case TILE_TYPE.CORRIDOR:
        case TILE_TYPE.FLOOR:
          tileMesh = this.findMeshByName("FLOOR");
          break;
        case TILE_TYPE.DOOR:
          tileMesh = this.findMeshByName("DOOR");
          break;
      }
      if (tileMesh) {
        if (tile.subtype === TILE_SUB_TYPE.HORIZONTAL) {
          tileMesh.rotation.y = 90 * (Math.PI / 180);
        }
        tileMesh.position.set(tile.x, 0.0, tile.y); // map x = x map y = z;
        tileMesh.castShadow = true; // default is false
        tileMesh.receiveShadow = true; // default is false
        tileMesh.visible = false;
        this.meshMap[tile.key] = tileMesh;
        this.add(tileMesh);
      }
    });
    if (world && world.scene) world.scene.add(this);
  }
  update (props) {
    const { playerFov } = props;
    if (playerFov) {
      const visibleNow = [];
      playerFov.forEach(key => {
        if (this.meshMap[key]) {
          visibleNow.push(key);
          this.meshMap[key].visible = true;
        }
      });
      difference(this.visibleMeshes, visibleNow).forEach(
        key => (this.meshMap[key].visible = false)
      );
      this.visibleMeshes = visibleNow;
    }
  }

  // this is called every frame;
  renderAnimationFrame (clock) { }
}
