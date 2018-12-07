import { difference } from "ramda";
import { TILE_TYPE, TILE_SUB_TYPE } from "../../dungeon/constants";
import { ReactThree, ThreeObj } from "./ReactThree";

export class Dungeon extends ReactThree {
  threeClass = Dungeon3D;
}

class Dungeon3D extends ThreeObj {
  meshMap: any = {};
  visibleMeshes: any = [];
  materials: any = {};

  async init(props) {
    this.glbSrc = "/gitf/test.glb";
    await super.init(props);
    const { tiles } = props;
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
  }

  update(props) {
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
