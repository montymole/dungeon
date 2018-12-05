import EasyStar from "easystarjs";
import { VIEW_RADIUS, TILE_TYPE } from "./constants";

export class PathFinder {
  tilemap: any;
  constructor(tilemap) {
    this.tilemap = tilemap;
  }
  createGrid(x, y, r = VIEW_RADIUS) {
    // create grid around player (view radius)
    const x1 = x - r;
    const x2 = x + r;
    const y1 = y - r;
    const y2 = y + r;
    const g = [];
    let gy = 0;
    let gx = 0;
    for (let yi = y1; yi < y2; yi++) {
      g[gy] = [];
      gx = 0;
      for (let xi = x1; xi < x2; xi++) {
        const k = `x${Math.round(xi)}y${Math.round(yi)}`;
        const tile = this.tilemap[k];
        g[gy][gx] = (tile && tile.type) || 0;
        gx++;
      }
      gy++;
    }
    return g;
  }
  async findPath(startX, startY, endX, endY) {
    const easystar = new EasyStar.js();
    const grid = this.createGrid(startX, startY, VIEW_RADIUS);
    console.log(grid);
    easystar.setGrid(grid);
    easystar.setAcceptableTiles([TILE_TYPE.FLOOR, TILE_TYPE.CORRIDOR]);
    const sx = VIEW_RADIUS;
    const sy = VIEW_RADIUS;
    const ex = startX - endX;
    const ey = startY - endY;
    const path = await new Promise(resolve => {
      easystar.findPath(sx, sy, ex, ey, resolve);
    });
    console.log(path);
    // TODO adjust path to original coordinates
    return path;
  }
}
