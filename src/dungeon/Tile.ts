import { SYMBOLS, } from "./constants";

export default class Tile {
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
  setType (type) {
    this.type = type;
    this.symbol = SYMBOLS[type][this.subtype];
  }
}