// maintypes
export const TILE_TYPE = {
  EMPTY: 0,
  FLOOR: 1,
  WALL: 2,
  DOOR: 3,
  CORRIDOR: 4,
  CORRIDOR_WALL: 5,
  STAIRS_UP: 6,
  STAIRS_DOWN: 7
};
// subtypes
export const TILE_SUB_TYPE = {
  NORMAL: 0,
  HORIZONTAL: 1,
  VERTICAL: 2,
  TOP_LEFT_CORNER: 3,
  TOP_RIGHT_CORNER: 4,
  BOTTOM_LEFT_CORNER: 5,
  BOTTOM_RIGHT_CORNER: 6
};
export const ADJACENT = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
// directions
export const DIRECTION = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3
};
// character symbols
export const SYMBOLS = {
  [TILE_TYPE.EMPTY]: [' '],
  [TILE_TYPE.WALL]: ['#', '#', '#', 'F', '7', 'L', 'J'],
  [TILE_TYPE.FLOOR]: ['.'],
  [TILE_TYPE.CORRIDOR]: [':'],
  [TILE_TYPE.CORRIDOR_WALL]: ['#'],
  [TILE_TYPE.DOOR]: ['D', '-', '|', '\\', '/', '\\', '/'],
  [TILE_TYPE.STAIRS_UP]: ['<'],
  [TILE_TYPE.STAIRS_DOWN]: ['>']
};
// roll of 100
export const ROLL = {
  DOOR_CHANCE: 5
};

export const RANDOM_SEED = 'DUNGEON';
