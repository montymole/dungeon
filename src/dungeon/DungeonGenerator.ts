import * as randomSeed from "random-seed";
import {
  TILE_TYPE,
  TILE_SUB_TYPE,
  DIRECTION,
  ROLL,
  SYMBOLS,
  RANDOM_SEED,
  ADJACENT
} from "./constants";
import { throws } from "assert";

const MIN_ROOM_WIDTH = 6;
const MIN_ROOM_HEIGHT = 6;
const MAX_ROOM_WIDTH = 30;
const MAX_ROOM_HEIGHT = 20;

export class Tile {
  key: string;
  roomId?: number;
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
  setType(type) {
    this.type = type;
    this.symbol = SYMBOLS[type][this.subtype];
  }
}

export class Room {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  stairsUp: Tile;
  stairsDown: Tile;
  constructor(o) {
    const { id, x, y, w, h } = o;
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  get center() {
    return [this.centerX, this.centerY];
  }
  get centerX() {
    return Math.round(this.x + this.w / 2);
  }
  get centerY() {
    return Math.round(this.y + this.h / 2);
  }
}

export class Dungeon {
  seed: string;
  tilemap: any = {};
  rooms: Room[] = [];
  tunnels: any = [];
  random: any;

  constructor(seed = RANDOM_SEED) {
    this.seed = seed;
    this.random = new randomSeed(this.seed);
  }

  rollChance(c: number) {
    return this.random(100) <= c;
  }

  randomInt(n) {
    return Math.round(this.random(n));
  }

  scan(o) {
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

  tileAt(x: number, y: number) {
    const { tilemap } = this;
    return tilemap[`x${x}y${y}`] || new Tile(x, y, TILE_TYPE.EMPTY);
  }

  checkOverlap(r, m = 0) {
    let overlaps = false;
    this.scan({
      x: r.x - m,
      y: r.y - m,
      w: r.w + m * 2,
      h: r.h + m * 2,
      onTile: (k, x, y) => {
        const at = this.tileAt(x, y);
        if (at.type !== TILE_TYPE.EMPTY) {
          overlaps = at;
        }
      }
    });
    return overlaps;
  }

  tunnel1(o) {
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
          tunnel.tiles.push(tilemap[pos.key]);
          break;
        case TILE_TYPE.WALL:
          // make door
          pos.setType(TILE_TYPE.DOOR);
          break;
      }
      if (this.rollChance(50)) {
        // move x
        const d = x < ex ? 1 : -1;
        x += d;
      } else {
        // move y
        const d = y < ey ? 1 : -1;
        y += d;
      }
    }
    this.tunnelWalls(tunnel);
    return tunnel;
  }

  tunnel(o) {
    const { sx, sy, ex, ey } = o;
    const { tilemap, tunnels } = this;
    const id = tunnels.length;
    const tunnel = { id, sx, sy, ex, ey, tiles: [] };
    tunnels.push(tunnel);
    let x = sx;
    let y = sy;
    let steps = 0;
    let maxsteps = this.randomInt(5);
    let maze = 1;
    let direction = this.rollChance(50) ? "Y" : "X";
    let px;
    let py;
    while (x !== ex || y !== ey) {
      const pos = this.tileAt(x, y);
      switch (pos.type) {
        case TILE_TYPE.EMPTY:
          // make corridor
          tilemap[pos.key] = new Tile(x, y, TILE_TYPE.CORRIDOR);
          tunnel.tiles.push(tilemap[pos.key]);
          break;
        case TILE_TYPE.WALL:
          switch (pos.subtype) {
            case TILE_SUB_TYPE.HORIZONTAL:
              const left = this.tileAt(x - 1, y);
              const right = this.tileAt(x + 1, y);
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
              const top = this.tileAt(x, y - 1);
              const bottom = this.tileAt(x, y + 1);
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
        direction = this.rollChance(50) ? "Y" : "X";
        maze = this.rollChance(20) ? -1 : 1;
        maxsteps = maze === 1 ? this.randomInt(6) : this.randomInt(3);
      }
      px = x;
      py = y;
      if (direction === "X") {
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
    return tunnel;
  }

  tunnelWalls(tunnel) {
    const { tilemap } = this;
    tunnel.tiles.forEach(tile => {
      if (tile && tile.type === TILE_TYPE.CORRIDOR) {
        ADJACENT.forEach(a => {
          const t = this.tileAt(tile.x + a[0], tile.y + a[1]);
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

  addRoom(o) {
    const { x, y, w, h } = o;
    const MARGIN = 1;
    const id = this.rooms.length;
    const room = new Room({ id, x, y, w, h });
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
          if (
            above.type === TILE_TYPE.EMPTY ||
            left.type === TILE_TYPE.EMPTY ||
            x === eastWall ||
            y === southWall
          ) {
            type = TILE_TYPE.WALL;
            if (left.type === TILE_TYPE.WALL) {
              subtype = TILE_SUB_TYPE.HORIZONTAL;
            }
            if (x === room.x && y === room.y) {
              subtype = TILE_SUB_TYPE.TOP_LEFT_CORNER;
            }
            if (
              x === room.x &&
              above.type === TILE_TYPE.WALL &&
              left.type === TILE_TYPE.EMPTY
            ) {
              subtype = TILE_SUB_TYPE.VERTICAL;
            }
            if (x === eastWall && y === room.y) {
              subtype = TILE_SUB_TYPE.TOP_RIGHT_CORNER;
            }
            if (x === room.x && y === southWall) {
              subtype = TILE_SUB_TYPE.BOTTOM_LEFT_CORNER;
            }
            if (x === eastWall && left.type === TILE_TYPE.FLOOR) {
              subtype = TILE_SUB_TYPE.VERTICAL;
            }
            if (x === eastWall && y === southWall) {
              subtype = TILE_SUB_TYPE.BOTTOM_RIGHT_CORNER;
            }
            if (
              right.type === TILE_TYPE.WALL ||
              below.type === TILE_TYPE.WALL
            ) {
              type = TILE_TYPE.FLOOR;
              subtype = 0;
            }
          }
          const tile = new Tile(x, y, type, subtype, room.id);
          tilemap[k] = tile;
        }
      }
    });
    return room;
  }

  createArea(x: number, y: number, maxNumRooms: number = 10) {
    const { rooms, tunnels } = this;
    const numRooms = 1 + this.random(maxNumRooms);
    const numTunnels = numRooms;
    while (rooms.length < numRooms) {
      this.addRoom({
        x,
        y,
        w: MIN_ROOM_WIDTH + this.randomInt(MAX_ROOM_WIDTH),
        h: MIN_ROOM_HEIGHT + this.randomInt(MAX_ROOM_HEIGHT)
      });
    }
    while (tunnels.length < numTunnels) {
      const room1 = rooms[this.randomInt(rooms.length)];
      const room2 = rooms[this.randomInt(rooms.length)];
      const [sx, sy] = room1.center;
      const [ex, ey] = room2.center;
      this.tunnel({ sx, sy, ex, ey });
    }
    // add walls to tunnels
    tunnels.forEach(tunnel => this.tunnelWalls(tunnel));

    // add exits
    const firstRoom = rooms[0];
    firstRoom.stairsUp = this.tileAt(
      Math.round(firstRoom.x + firstRoom.w / 2),
      Math.round(firstRoom.y + firstRoom.h / 2)
    );
    firstRoom.stairsUp.setType(TILE_TYPE.STAIRS_UP);

    const lastRoom = rooms[rooms.length - 1];
    lastRoom.stairsDown = this.tileAt(
      Math.round(lastRoom.x + lastRoom.w / 2),
      Math.round(lastRoom.y + lastRoom.h / 2)
    );
    lastRoom.stairsDown.setType(TILE_TYPE.STAIRS_DOWN);
  }

  getArea(x: number, y: number, w: number, h: number) {
    const { seed, rooms, tunnels, tilemap } = this;
    const tiles = {};
    this.scan({
      x,
      y,
      w,
      h,
      onTile: k => {
        const tile = tilemap[k];
        tiles[k] = tile;
      }
    });
    return { seed, rooms, tunnels, tiles };
  }

  toString(x: number, y: number, w: number, h: number) {
    const { tilemap, rooms } = this;
    let r = "";
    this.scan({
      x,
      y,
      w,
      h,
      onTile: k => {
        const tile = tilemap[k];
        if (!tile) {
          r += SYMBOLS[TILE_TYPE.EMPTY];
          return;
        }
        const room = rooms[tile.roomId];
        if (room && tile.y === room.y + 2) {
          const idString = tile.roomId.toString();
          if (tile.x === room.centerX - idString.length) {
            r += idString;
            return;
          } else if (
            tile.x > room.centerX - idString.length &&
            tile.x < room.centerX
          ) {
            return;
          }
        }
        r += tile.symbol;
      },
      onNextRow: () => {
        console.log(r);
        r = "";
      }
    });
  }
}
