import { pick } from 'ramda';
import { TILE_SUB_TYPE, TILE_TYPE } from './constants';
import Item from './Item';
import Procedural from './Procedural';
import Tile from './Tile';
import { scan } from './utils';

export default class Room extends Procedural {
  static PUBLIC = [
    'id',
    'x',
    'y',
    'w',
    'h',
    'name',
    'stairsUp',
    'stairsDown',
    'items',
    'tiles'
  ];
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  name: string;
  stairsUp: Tile;
  stairsDown: Tile;
  tiles: Tile[] = [];
  items: Item[] = [];
  dungeon: any;
  toJSON() {
    return pick(Room.PUBLIC, this);
  }
  constructor(o) {
    super(o.seed); // get seed from parent
    const { id, x, y, w, h, name, dungeon } = o;
    this.dungeon = dungeon;
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;
    this.create();
  }
  get floorTiles() {
    return this.tiles.filter((t) => t.type === TILE_TYPE.FLOOR);
  }
  itemsAt(x: number, y: number) {
    return this.items.filter((i) => i.x === x && i.y === y);
  }
  checkAndFixOverlap() {
    const MARGIN = 1;
    const { dungeon } = this;
    // check area overlap
    let overlap;
    do {
      overlap = dungeon.checkOverlap(this, MARGIN);
      if (overlap) {
        // TODO how it overlaps?
        // TODO adjust and try again
        this.x = this.random(this.w + overlap.x);
        this.y = this.random(this.h + overlap.y);
      }
    } while (overlap);
  }
  create() {
    const { dungeon } = this;
    this.checkAndFixOverlap();
    const eastWall = this.x + this.w - 1;
    const southWall = this.y + this.h - 1;
    const { tilemap } = dungeon;
    // carve room
    scan({
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      onTile: (k, x, y) => {
        const at = dungeon.tileAt(x, y);
        const above = dungeon.tileAt(x, y - 1);
        const left = dungeon.tileAt(x - 1, y);
        const right = dungeon.tileAt(x + 1, y);
        const below = dungeon.tileAt(x, y + 1);
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
            if (x === this.x && y === this.y) {
              subtype = TILE_SUB_TYPE.TOP_LEFT_CORNER;
            }
            if (
              x === this.x &&
              above.type === TILE_TYPE.WALL &&
              left.type === TILE_TYPE.EMPTY
            ) {
              subtype = TILE_SUB_TYPE.VERTICAL;
            }
            if (x === eastWall && y === this.y) {
              subtype = TILE_SUB_TYPE.TOP_RIGHT_CORNER;
            }
            if (x === this.x && y === southWall) {
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
          const tile = new Tile(x, y, type, subtype, this.id);
          this.tiles.push(tile);
          tilemap[k] = tile;
        }
      }
    });
  }
  addItems(MAX_NUM_ITEMS: number = 10) {
    const numItemsToAdd = this.randomInt(MAX_NUM_ITEMS);
    let addedItems = 0;
    while (addedItems < numItemsToAdd) {
      const floor = this.floorTiles[this.randomInt(this.floorTiles.length)];
      if (floor) {
        this.items.push(
          new Item({
            seed: this.seed + this.items.length,
            id: this.id * 1000 + this.items.length,
            x: floor.x,
            y: floor.y
          })
        );
      }
      addedItems++;
    }
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
