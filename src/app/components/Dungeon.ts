declare var THREE: any;
import { difference } from "ramda";
import { TILE_TYPE, TILE_SUB_TYPE } from "../../dungeon/constants";
import { ReactThree, ThreeObj } from "./ReactThree";
import * as CANNON from "cannon";

export class Dungeon extends ReactThree {
  threeClass = Dungeon3D;
}

class Dungeon3D extends ThreeObj {
  seed: string;
  meshMap: any = {};
  visibleMeshes: any = [];
  materials: any = {};

  initGraphics (dungeonMap) {
    Object.keys(dungeonMap.tiles).map(k => {
      const tile = dungeonMap.tiles[k];
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
  }

  initPhysics (dungeonMap) {
    const { world } = this;
    // create physics floor
    const floor = new CANNON.Body({
      mass: 0, // mass
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(0, 0, 0)
    });
    if (world && world.physics) world.physics.addBody(floor);
    // create walls
    const { rooms, tiles } = dungeonMap;
    rooms.forEach(room => {
      // create wall box
      //console.log('ROOM', room.x, room.y, room.w, room.h);
      const wall = { x1: room.x, y1: room.y, x2: room.x, y2: room.y };
      let x1 = room.x;
      let x2 = room.x;
      for (let x = room.x; x < room.x + room.w; x++) {
        const k = `x${x}y${room.y}`;
        const tile = tiles[k];
        // northwall
        if (tile.type === TILE_TYPE.WALL) {
          //is wall
          x2 = x;
        } else {
          //wall ends
          this.wallBoxHelper(x1, room.y, x2, room.y + 1);
          x1 = x;
        }
      }
      this.wallBoxHelper(x1, room.y, x2, room.y + 1);
    });
  }

  wallBoxHelper (x1, y1, x2, y2) {
    const box = new THREE.Box3();
    box.set(new THREE.Vector3(x1, 0, y1), new THREE.Vector3(x2, 3, y2));
    const helper = new THREE.Box3Helper(box, 0xffff00);
    this.world.scene.add(helper);
  }

  async init (props) {
    this.glbSrc = "/gitf/test.glb";
    await super.init(props);
    this.seed = props.dungeonMap.seed;
    this.initGraphics(props.dungeonMap);
    this.initPhysics(props.dungeonMap);
  }

  async update (props) {
    if (props.dungeonMap.seed !== this.seed) {
      await this.init(props);
    }

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
}
