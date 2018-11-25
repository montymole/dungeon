import { SEETHRU, VIEW_RADIUS } from "./constants";

export class FOV {
  tilemap: any;
  fovMaps: any = {};
  constructor(tilemap) {
    this.tilemap = tilemap;
  }
  fovPos(x, y, r = VIEW_RADIUS) {
    if (!this.tilemap) return [];
    const k = `x${x}y${y}r${r}`;
    if (this.fovMaps[k]) {
      return this.fovMaps[k];
    }
    this.fovMaps[k] = [];
    for (let i = 0; i < 360; i++) {
      const fx = Math.cos(i * 0.01745);
      const fy = Math.sin(i * 0.01745);
      let ox = x;
      let oy = y;
      for (let j = 0; j < r; j++) {
        const k2 = `x${Math.round(ox)}y${Math.round(oy)}`;
        if (this.tilemap[k2] && this.fovMaps[k].indexOf(k2) === -1)
          this.fovMaps[k].push(k2);
        if (
          !this.tilemap[k2] ||
          SEETHRU.indexOf(this.tilemap[k2].type) === -1
        ) {
          j = r;
        }
        ox += fx;
        oy += fy;
      }
    }
    return this.fovMaps[k];
  }
}
