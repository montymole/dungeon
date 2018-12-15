const MIN_ROOM_WIDTH = 6;
const MIN_ROOM_HEIGHT = 6;
const MAX_ROOM_WIDTH = 30;
const MAX_ROOM_HEIGHT = 20;
const MIN_NUM_ROOMS = 1;
const MAX_NUM_ROOMS = 12;

import { TILE_TYPE, SYMBOLS, } from "./constants";
import NameGenerator from "./NameGenerator";
import Tile from "./Tile";
import Room from "./Room";
import Maze from "./Maze";
import Corridor from "./Corridor";
import Procedural from "./Procedural";
import { scan } from "./utils";

export class Dungeon extends Procedural {
  tilemap: any = {};
  rooms: Room[] = [];
  corridors: any = [];
  nameGenerator: any = new NameGenerator(this.seed);

  tileAt (x: number, y: number) {
    const { tilemap } = this;
    return tilemap[`x${x}y${y}`] || new Tile(x, y, TILE_TYPE.EMPTY);
  }

  checkOverlap (r, m = 0) {
    let overlaps = false;
    scan({
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

  testMaze (x, y, w, h) {
    new Maze({ x, y, w, h, id: 1, seed: this.seed, dungeon: this, name: 'maze' });
  }


  createArea (x: number, y: number, maxNumRooms: number = MAX_NUM_ROOMS, precalculatedFOV: boolean = false) {
    const { rooms, corridors } = this;
    const numRooms = MIN_NUM_ROOMS + this.randomInt(maxNumRooms);
    const numCorridors = numRooms;
    while (rooms.length < numRooms) {
      rooms.push(
        new Room({
          x,
          y,
          w: MIN_ROOM_WIDTH + this.randomInt(MAX_ROOM_WIDTH),
          h: MIN_ROOM_HEIGHT + this.randomInt(MAX_ROOM_HEIGHT),
          id: rooms.length,
          seed: this.seed + rooms.length,
          dungeon: this,
          name: this.nameGenerator.roomName
        })
      );
    }
    while (corridors.length < numCorridors) {
      const room1 = rooms[this.randomInt(rooms.length)];
      const room2 = rooms[this.randomInt(rooms.length)];
      const [sx, sy] = room1.center;
      const [ex, ey] = room2.center;
      corridors.push(new Corridor({
        sx, sy, ex, ey,
        seed: this.seed + corridors.length,
        dungeon: this
      }));
    }
    // add walls to corridors
    corridors.forEach(c => c.addWalls());

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

    // add items to rooms
    rooms.forEach(r => r.addItems());
  }

  getArea (x: number, y: number, w: number, h: number) {
    const { seed, rooms, corridors, tilemap } = this;
    const tiles = {};
    scan({
      x, y, w, h,
      onTile: k => {
        const tile = tilemap[k];
        tiles[k] = tile;
      }
    });
    return { seed, rooms, tiles };
  }

  tiledAreaDimensions (tiles) {
    const area = { x1: tiles[0].x, y1: tiles[0].y, x2: tiles[0].x, y2: tiles[0].y };
    tiles.forEach(t => {
      if (t.x < area.x1) area.x1 = t.x;
      if (t.y < area.y1) area.y1 = t.y;
      if (t.x > area.x2) area.x2 = t.x;
      if (t.y > area.y2) area.y2 = t.y;
    });
    return area;
  }

  toString (x: number, y: number, w: number, h: number) {
    const { tilemap, rooms } = this;
    let r = "";
    scan({
      x, y, w, h,
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
        const items = room && room.itemsAt(tile.x, tile.y);
        if (items && items.length) {
          r += items[0].symbol;
        } else {
          r += tile.symbol;
        }
      },
      onNextRow: () => {
        console.log(r);
        r = "";
      }
    });
  }
}
