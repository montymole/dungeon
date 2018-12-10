import * as ndarray from "ndarray";
import * as createPlanner from "l1-path-finder";
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
    for (let xi = x1; xi < x2; xi++) {
      for (let yi = y1; yi < y2; yi++) {
        const k = `x${Math.round(xi)}y${Math.round(yi)}`;
        const tile = this.tilemap[k];
        g.push(tile && tile.type && tile.type === TILE_TYPE.FLOOR ? 1 : 0);
      }
    }
    return ndarray(g, [r * 2, r * 2]);
  }
  async findPath(startX, startY, endX, endY) {
    const sx = VIEW_RADIUS;
    const sy = VIEW_RADIUS;
    const ex = VIEW_RADIUS + (startX - endX);
    const ey = VIEW_RADIUS + (startY - endY);
    const maze = this.createGrid(startX, startY, VIEW_RADIUS);
    console.log(maze);
    const planner = createPlanner(maze);
    const path = [];
    const dist = planner.search(sx, sy, ex, ey, path);
    // TODO adjust path to original coordinates
    return { path, dist };
  }
}
