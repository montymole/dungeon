import * as randomSeed from 'random-seed';
import { TILE_TYPE, TILE_SUB_TYPE, DIRECTION, ROLL, SYMBOLS, RANDOM_SEED } from './constants';
import { throws } from 'assert';


const MIN_ROOM_WIDTH = 6;
const MIN_ROOM_HEIGHT = 6;
const MAX_ROOM_WIDTH = 30;
const MAX_ROOM_HEIGHT = 20;

export class Tile {
  key: string;
  roomId: number;
  type: number;
  subtype: number;
  symbol: string;
  x: number;
  y: number;
  constructor(x, y, type, subtype = 0, roomId = null) {
    this.key = `x${x}y${y}`;
    this.roomId = roomId;
    this.x = x;
    this.y = y;
    this.type = type;
    this.subtype = subtype;
    this.symbol = SYMBOLS[type][subtype];
  }
  setType (type) {
    this.type = type;
    this.symbol = SYMBOLS[type][this.subtype];
  }
}

export class Dungeon {
  seed: string = RANDOM_SEED;
  tilemap: any = {};
  rooms: any = [];
  tunnels: any = [];
  random: any;

  constructor(seed = RANDOM_SEED) {
    this.random = new randomSeed(seed);
  }

  rollChance (c: number) {
    return this.random(100) <= c;
  }

  scan (o) {
    const sx = o.x;
    const sy = o.y;
    const { w, h, onTile, onNextRow } = o;
    const ex = sx + w;
    const ey = sy + h;
    for (let y = sy; y < ey; y++) {
      for (let x = sx; x < ex; x++) {
        onTile(`x${x}y${y}`, x, y);
      }
      if (onNextRow) onNextRow(y);
    }
  }

  tileAt (x: number, y: number) {
    const { tilemap } = this;
    return tilemap[`x${x}y${y}`] || new Tile(x, y, TILE_TYPE.EMPTY);
  }

  checkOverlap (r, m = 0) {
    let overlaps = false;
    this.scan({
      x: r.x - m, y: r.y - m, w: r.w + m * 2, h: r.h + m * 2,
      onTile: (k, x, y) => {
        const at = this.tileAt(x, y);
        if (at.type !== TILE_TYPE.EMPTY) {
          overlaps = at;
        }
      }
    });
    return overlaps;
  }

  tunnel (o) {
    const { sx, sy, ex, ey } = o;
    const { tilemap, tunnels } = this;
    const id = tunnels.length;
    const tunnel = { id, sx, sy, ex, ey, tiles: [] };
    tunnels.push(tunnel);
    let x = sx;
    let y = sy;
    while (x !== ex || y !== ey) {
      const pos = this.tileAt(x, y);
      switch (pos.type) {
        case TILE_TYPE.EMPTY:
          // make corridor
          tilemap[pos.key] = new Tile(x, y, TILE_TYPE.CORRIDOR);
          tunnel.tiles.push(tilemap[pos.k]);
          break;
        case TILE_TYPE.WALL:
          // make door
          pos.setType(TILE_TYPE.DOOR);
          break;
      }
      if (this.rollChance(50)) {
        // move x
        const d = (x < ex) ? 1 : -1;
        x += d;
      } else {
        // move y
        const d = (y < ey) ? 1 : -1;
        y += d;
      }
    }
  }

  addRoom (o) {
    const { x, y, w, h } = o;
    const MARGIN = 1;
    const id = this.rooms.length;
    const room = {
      id,
      x, y, w, h,
      doors: []
    };
    this.rooms.push(room);
    // check area overlap
    let overlap;
    do {
      overlap = this.checkOverlap(room, MARGIN);
      if (overlap) {
        // TODO how it overlaps?
        // TODO adjust and try again
        room.x = this.random(room.w + overlap.x);
        room.y = this.random(room.h + overlap.y);
      }
    } while (overlap);
    const eastWall = room.x + room.w - 1;
    const southWall = room.y + room.h - 1;
    const { tilemap } = this;
    // carve room
    this.scan({
      x: room.x,
      y: room.y,
      w: room.w,
      h: room.h,
      onTile: (k, x, y) => {
        const at = this.tileAt(x, y);
        const above = this.tileAt(x, y - 1);
        const left = this.tileAt(x - 1, y);
        const right = this.tileAt(x + 1, y);
        const below = this.tileAt(x, y + 1);
        if (at.type === TILE_TYPE.EMPTY) {
          let type = TILE_TYPE.FLOOR;
          let subtype = 0;
          if (above.type === TILE_TYPE.EMPTY || left.type === TILE_TYPE.EMPTY || x === eastWall || y === southWall) {
            type = TILE_TYPE.WALL;
            if (x === room.x && y === room.y) {
              subtype = TILE_SUB_TYPE.TOP_LEFT_CORNER;
            }
            if (left.type === TILE_TYPE.WALL) {
              subtype = TILE_SUB_TYPE.HORIZONTAL;
            }
            if (x === eastWall && y === southWall) {
              subtype = TILE_SUB_TYPE.TOP_RIGHT_CORNER;
            }
            if (x === room.x && above.type === TILE_TYPE.WALL && left.type === TILE_TYPE.EMPTY) {
              subtype = TILE_SUB_TYPE.VERTICAL;
            }
            if (x === room.x && y === southWall) {
              subtype = TILE_SUB_TYPE.BOTTOM_LEFT_CORNER;
            }
            if (x === eastWall && left.type === TILE_TYPE.FLOOR) {
              subtype = TILE_SUB_TYPE.VERTICAL;
            }
            if (x === southWall && y === eastWall) {
              subtype = TILE_SUB_TYPE.BOTTOM_RIGHT_CORNER;
            }
            if (right.type === TILE_TYPE.WALL || below.type === TILE_TYPE.WALL) {
              type = TILE_TYPE.FLOOR;
              subtype = 0;
            }
          }
          tilemap[k] = new Tile(x, y, type, subtype, room.id);
        }
      }
    });
    return room;
  }

  createArea (x: number, y: number, w: number, h: number, createNumRooms: number = 10) {
    const { rooms, tunnels } = this;
    while (rooms.length < createNumRooms) {
      this.addRoom({
        x: this.random(x),
        y: this.random(y),
        w: MIN_ROOM_WIDTH + this.random(MAX_ROOM_WIDTH),
        h: MIN_ROOM_HEIGHT + this.random(MAX_ROOM_HEIGHT)
      });
    }
    while (tunnels.length < rooms.length) {
      const room1 = rooms[this.random(rooms.length)];
      const room2 = rooms[this.random(rooms.length)];
      const sx = Math.round(room1.x + room1.w / 2);
      const sy = Math.round(room1.y + room1.h / 2);
      const ex = Math.round(room2.x + room2.w / 2);
      const ey = Math.round(room2.y + room2.h / 2);
      this.tunnel({ sx, sy, ex, ey });
    }
  }

  getArea (x: number, y: number, w: number, h: number) {
    const { tilemap } = this;
    const tiles = {};
    this.scan({
      x, y, w, h,
      onTile: (k) => {
        const tile = tilemap[k];
        tiles[k] = tile;
      }
    });
    return tiles;
  }

  toString (x: number, y: number, w: number, h: number) {
    const { tilemap, rooms } = this;
    let r = '';
    this.scan({
      x, y, w, h,
      onTile: (k) => {
        const tile = tilemap[k];
        if (!tile) {
          r += SYMBOLS[TILE_TYPE.EMPTY];
          return;
        }
        const room = rooms[tile.roomId];
        if (room && tile.y === room.y + 2) {
          const idString = tile.roomId.toString();
          const rxc = Math.round(room.x + room.w / 2);
          if (tile.x === rxc - idString.length) {
            r += idString;
            return;
          } else if (tile.x > rxc - idString.length && tile.x < rxc) {
            return;
          }
        }
        r += tile.symbol;
      },
      onNextRow: () => {
        console.log(r);
        r = '';
      }
    });
  }
}

