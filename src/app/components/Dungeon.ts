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
  walls: any;
  onClickTile: any;

  initGraphics(dungeonMap) {
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
        tileMesh.key = tile.key;
        if (this.onClickTile) tileMesh.onClick = intersection => this.onClickTile(tile, intersection);
        this.meshMap[tile.key] = tileMesh;
        this.add(tileMesh);
      }
    });
  }

  async initPhysics(dungeonMap) {
    const { world } = this;
    // reinit world physics to clear all old bodies
    world.initPhysics();
    // create physics floor
    const floor = new CANNON.Body({
      mass: 0, // mass
      shape: new CANNON.Plane(),
      position: new CANNON.Vec3(0, 0, 0)
    });
    if (world && world.physics) world.physics.addBody(floor);
    // create walls
    this.walls = [];
    const { rooms, tiles } = dungeonMap;
    rooms.forEach(room => {
      // create wall boxes
      this.horizontalWall(tiles, room, room.y);
      this.horizontalWall(tiles, room, room.y - 1 + room.h);
      this.verticalWall(tiles, room, room.x);
      this.verticalWall(tiles, room, room.x - 1 + room.w);
    });
  }

  horizontalWall(tiles, room, y) {
    let x1 = room.x - 1;
    let x2 = room.x;
    for (let x = room.x; x < room.x + room.w; x++) {
      const k = `x${x}y${y}`;
      const tile = tiles[k];
      // northwall
      if (tile.type === TILE_TYPE.WALL) {
        x2 = x;
      } else {
        //wall ends
        this.wallBox(x1 + 0.5, y - 0.5, x2 + 0.5, y + 0.5);
        x1 = x;
      }
    }
    if (x1 !== x2) this.wallBox(x1 + 0.5, y - 0.5, x2 + 0.5, y + 0.5);
  }

  verticalWall(tiles, room, x) {
    let y1 = room.y + 1;
    let y2 = room.y + 1;
    for (let y = room.y + 1; y < room.y + room.h; y++) {
      const k = `x${x}y${y}`;
      const tile = tiles[k];
      // northwall
      if (tile.type === TILE_TYPE.WALL) {
        y2 = y;
      } else {
        //wall ends
        this.wallBox(x - 0.5, y1 - 0.5, x + 0.5, y2 - 0.5);
        y1 = y;
      }
    }
    if (y1 !== y2) this.wallBox(x - 0.5, y1 - 0.5, x + 0.5, y2 - 0.5);
  }

  wallBox(x1, y1, x2, y2) {
    const { world } = this;
    const box = new THREE.Box3();
    box.set(new THREE.Vector3(x1, 0, y1), new THREE.Vector3(x2, 3, y2));
    const helper = new THREE.Box3Helper(box, 0xffff00);
    this.add(helper);
    const h = 2.5;
    const w = x2 - x1;
    const d = y2 - y1;
    const shape = new CANNON.Box(new CANNON.Vec3(w, h, d));
    const body = new CANNON.Body({
      mass: 0,
      shape,
      position: new CANNON.Vec3(x1, y2, 0)
    });
    if (world && world.physics) world.physics.addBody(body);
    this.walls.push({ body, helper });
  }

  async init(props) {
    this.glbSrc = "/gitf/test.glb";
    this.onClickTile = props.onClickTile;
    this.seed = props.dungeonMap.seed;
    await super.init(props);
    this.initGraphics(props.dungeonMap);
    // TODO init physics only for the active room
    // TODO removePhysics from not active rooms
    console.log("pass", props, props.dungeonMap.seed);
    await this.initPhysics(props.dungeonMap);
  }

  destroy() {
    this.world.scene.remove(this);
  }

  async update(props) {
    if (props.dungeonMap.seed !== this.seed) {
      await this.init(props);
    }
    const { playerFov } = props;
    if (playerFov && this.meshMap) {
      const visibleNow = [];
      playerFov.forEach(key => {
        if (this.meshMap[key]) {
          visibleNow.push(key);
          this.meshMap[key].visible = true;
        }
      });
      difference(this.visibleMeshes, visibleNow).forEach(key => (this.meshMap[key].visible = false));
      this.visibleMeshes = visibleNow;
    }
  }
}
