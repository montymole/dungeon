import { ADJACENT, TILE_SUB_TYPE, TILE_TYPE } from './constants';
import Procedural from './Procedural';
import Tile from './Tile';

export default class Corridor extends Procedural {
  private dungeon: any;
  private tiles: Tile[] = [];
  constructor(o) {
    super(o.seed);
    const { sx, sy, ex, ey, dungeon } = o;
    this.dungeon = dungeon;
    const { tilemap } = dungeon;
    let x = sx;
    let y = sy;
    let steps = 0;
    let maxsteps = this.randomInt(5);
    let maze = 1;
    let direction = this.rollChance(50) ? 'Y' : 'X';
    let px;
    let py;
    while (x !== ex || y !== ey) {
      const pos = dungeon.tileAt(x, y);
      switch (pos.type) {
        case TILE_TYPE.EMPTY:
          // make corridor
          tilemap[pos.key] = new Tile(x, y, TILE_TYPE.CORRIDOR);
          this.tiles.push(tilemap[pos.key]);
          break;
        case TILE_TYPE.WALL:
          switch (pos.subtype) {
            case TILE_SUB_TYPE.HORIZONTAL:
              const left = dungeon.tileAt(x - 1, y);
              const right = dungeon.tileAt(x + 1, y);
              if (
                left.type === TILE_TYPE.WALL &&
                right.type === TILE_TYPE.WALL
              ) {
                // make door
                pos.setType(TILE_TYPE.DOOR);
              } else {
                x = px;
                y = py;
              }
              break;
            case TILE_SUB_TYPE.VERTICAL:
              const top = dungeon.tileAt(x, y - 1);
              const bottom = dungeon.tileAt(x, y + 1);
              if (
                top.type === TILE_TYPE.WALL &&
                bottom.type === TILE_TYPE.WALL
              ) {
                // make door
                pos.setType(TILE_TYPE.DOOR);
              } else {
                x = px;
                y = py;
              }
              break;
            default:
              x = px;
              y = py;
              break;
          }
          break;
        case TILE_TYPE.CORRIDOR:
          // is corridor already;
          steps = maxsteps;
        default:
          break;
      }
      steps++;
      if (steps > maxsteps) {
        steps = 0;
        direction = this.rollChance(50) ? 'Y' : 'X';
        maze = this.rollChance(20) ? -1 : 1;
        maxsteps = maze === 1 ? this.randomInt(6) : this.randomInt(3);
      }
      px = x;
      py = y;
      if (direction === 'X') {
        // move x
        const d = x < ex ? 1 : -1;
        if (pos.type === TILE_TYPE.EMPTY) {
          x += d * maze;
        } else {
          x += d;
        }
      } else {
        // move y
        const d = y < ey ? 1 : -1;
        if (pos.type === TILE_TYPE.EMPTY) {
          y += d * maze;
        } else {
          y += d;
        }
      }
    }
  }
  addWalls() {
    const { dungeon } = this;
    const { tilemap } = dungeon;
    this.tiles.forEach((tile) => {
      if (tile && tile.type === TILE_TYPE.CORRIDOR) {
        ADJACENT.forEach((a) => {
          const t = dungeon.tileAt(tile.x + a[0], tile.y + a[1]);
          if (t.type === TILE_TYPE.EMPTY && !tilemap[t.key]) {
            tilemap[t.key] = new Tile(
              t.x,
              t.y,
              TILE_TYPE.CORRIDOR_WALL,
              TILE_SUB_TYPE.NORMAL
            );
          }
        });
      }
    });
  }
}
