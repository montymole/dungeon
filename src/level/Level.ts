// https://github.com/rimeto/ts-optchain
//

// create multi roomed level
//
//

// Tile is 1x1x1 space or object with properties
export class Tile {}

export class Wall extends Tile {}

export class Floor extends Tile {}

export class Ceiling extends Tile {}

// Room  wx,wy,wz  is map of tiles
export class Room {
  tiles: Tile[];
}

// Level is collection of rooms
export class Level {
  rooms: Room[];
}
