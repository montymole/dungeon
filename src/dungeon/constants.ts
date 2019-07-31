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
export function tileTypeKey(n: number) {
  return Object.keys(TILE_TYPE).find((k) => TILE_TYPE[k] == n);
}
// fov see thru (set here if doesnt block 100%)
export const SEETHRU = [
  TILE_TYPE.EMPTY,
  TILE_TYPE.FLOOR,
  TILE_TYPE.DOOR,
  TILE_TYPE.CORRIDOR,
  TILE_TYPE.STAIRS_UP,
  TILE_TYPE.STAIRS_DOWN
];

export const VIEW_RADIUS = 20;

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

export function subtypeKey(n: number) {
  return Object.keys(TILE_SUB_TYPE).find((k) => TILE_SUB_TYPE[k] == n);
}

export const ADJACENT = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1]
];
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

export const ITEMS = {
  COPPER_COIN: {
    value: 0.1,
    mass: 0.1,
    symbol: '¢'
  },
  SILVER_COIN: {
    value: 0.25,
    mass: 0.1,
    symbol: '£'
  },
  GOLD_COIN: {
    value: 1,
    mass: 0.1,
    symbol: '$'
  },
  SWORD: {
    value: 10,
    mass: 5,
    unique: 'sword',
    symbol: 'W'
  }
};

export const PLAYER_ACTIONS = {
  IDLE: 0,
  MOVE: 1,
  SHOOT: 2,
  DIE: 3
};
