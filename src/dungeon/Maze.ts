import Tile from "./Tile";
import { TILE_TYPE, TILE_SUB_TYPE, ADJACENT } from "./constants";
import { scan } from "./utils";
import Room from "./Room";
import { throws } from "assert";

export default class Maze extends Room {


  create () {
    this.checkAndFixOverlap();
    const { x, y, w, h } = this;
    this.chamber({ x, y, w, h, r: 0 });
  }

  chamber (o) {
    const { dungeon } = this;
    const { tilemap } = dungeon;
    let tile;
    let type;
    let subtype;
    let at;
    let xgap1 = o.x + this.randomInt(o.w);
    let xgap2 = o.x + this.randomInt(o.w);
    let ygap1 = o.y + this.randomInt(o.h);
    let ygap2 = o.y + this.randomInt(o.h);
    for (let y = o.y; y <= o.y + o.h; y++) {
      subtype = TILE_SUB_TYPE.VERTICAL;
      type = TILE_TYPE.WALL;

      at = dungeon.tileAt(o.x, y);
      if (at.type !== TILE_TYPE.WALL) {
        if (y === o.y) subtype = TILE_SUB_TYPE.TOP_LEFT_CORNER;
        if (y === o.y + o.h) subtype = TILE_SUB_TYPE.BOTTOM_LEFT_CORNER;
        if (y === ygap1) { type = TILE_TYPE.FLOOR; subtype = 0; }
        tile = new Tile(o.x, y, type, subtype, this.id);
        tilemap[tile.key] = tile;
      }
      type = TILE_TYPE.WALL;
      at = dungeon.tileAt(o.x + o.w, y);
      if (at.type !== TILE_TYPE.WALL) {
        if (y === o.y) subtype = TILE_SUB_TYPE.TOP_RIGHT_CORNER;
        if (y === o.y + o.h) subtype = TILE_SUB_TYPE.BOTTOM_RIGHT_CORNER;
        if (y === ygap2) { type = TILE_TYPE.FLOOR; subtype = 0; }
        tile = new Tile(o.x + o.w, y, type, subtype, this.id);
        tilemap[tile.key] = tile;
      }
    }
    for (let x = o.x; x <= o.x + o.w; x++) {
      subtype = TILE_SUB_TYPE.HORIZONTAL;
      type = TILE_TYPE.WALL;

      at = dungeon.tileAt(x, o.y);
      if (at.type !== TILE_TYPE.WALL) {
        if (x === xgap1) { type = TILE_TYPE.FLOOR; subtype = 0; }
        tile = new Tile(x, o.y, type, subtype, this.id);
        tilemap[tile.key] = tile;
      }

      at = dungeon.tileAt(x, o.y + o.h);
      if (at.type !== TILE_TYPE.WALL) {
        if (x === xgap2) { type = TILE_TYPE.FLOOR; subtype = 0; }
        tile = new Tile(x, o.y + o.h, type, subtype, this.id);
        tilemap[tile.key] = tile;
      }

    }
    const sx = o.w / 2;
    const sy = o.w / 2;
    const ws = sx;
    const hs = sy;

    if (o.r < 10 && ws >= 3 && hs >= 3) {
      this.chamber({
        x: o.x,
        y: o.y,
        w: ws,
        h: hs,
        r: o.r + 1
      })
    }

  }


}