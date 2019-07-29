import { action, observable, runInAction } from 'mobx';
import { flatten } from 'ramda';
import { PLAYER_ACTIONS, TILE_TYPE, VIEW_RADIUS } from '../../dungeon/constants';
import { FOV } from '../../dungeon/FovMap';

export class GameState {
  @observable world;

  @observable dungeons: any[] = [];
  @observable dungeonMap;
  @observable materials: any[] = [];
  @observable objects3d: any[] = [];

  @observable keyStateMap: any = {};
  @observable cameraPosition: any = { x: 0, y: 0, z: 0 };
  @observable playerPosition: any = { x: 0, y: 0, z: 0 };
  @observable playerAction: number = PLAYER_ACTIONS.IDLE;

  @observable FOV: any;
  @observable playerFov: any;
  @observable visibleTiles: any;

  @observable visibleItems: any;

  items: any;
  keyDownListener: any;
  keyUpListener: any;

  onKeyDown(event: KeyboardEvent) {
    this.keyStateMap[event.code] = true;
    let x = this.playerPosition.x;
    let y = this.playerPosition.z;
    switch (event.code) {
      case 'KeyA':
      case 'ArrowLeft':
        x--;
        this.playerAction = PLAYER_ACTIONS.MOVE;
        break;
      case 'KeyD':
      case 'ArrowRight':
        x++;
        this.playerAction = PLAYER_ACTIONS.MOVE;
        break;
      case 'KeyW':
      case 'ArrowUp':
        y--;
        this.playerAction = PLAYER_ACTIONS.MOVE;
        break;
      case 'KeyS':
      case 'ArrowDown':
        y++;
        this.playerAction = PLAYER_ACTIONS.MOVE;
        break;
      case 'Space':
        this.playerAction = PLAYER_ACTIONS.SHOOT;
        break;
      default:
        console.log('keydown', event.code);
    }
    // TODO change player position inside player class, pass whole gamestate to player object
    if (this.playerAction == PLAYER_ACTIONS.MOVE) {
      const tile = this.dungeonMap && this.dungeonMap.tiles[`x${x}y${y}`];
      if (tile.type !== TILE_TYPE.WALL && tile.type !== TILE_TYPE.CORRIDOR_WALL) {
        this.playerPosition.x = x;
        this.playerPosition.z = y; // screen z is map y
        this.updateFieldOfView();
      }
      switch (tile.type) {
        case TILE_TYPE.STAIRS_DOWN:
          this.stairsDown();
          break;
        case TILE_TYPE.STAIRS_DOWN:
          this.stairsUp();
          break;
      }
    }
  }

  onKeyUp(event: KeyboardEvent) {
    this.keyStateMap[event.code] = false;
  }

  onMouseDown(event: MouseEvent) {
    console.log('mouse', event);
  }

  movePlayer(path) {
    while (path.length) {
      this.playerPosition.x += path.shift();
      this.playerPosition.y += path.shift();
      this.updateFieldOfView();
    }
  }

  @action('bind hid')
  bindEvents = () => {
    this.keyDownListener = window.addEventListener('keydown', this.onKeyDown.bind(this));
    this.keyUpListener = window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  @action('unbind hid')
  unbindEvents = () => {
    window.removeEventListener('keydown', this.keyDownListener);
    window.removeEventListener('keyup', this.keyUpListener);
  }

  saveWorld(world) {
    this.world = world;
  }

  updateFieldOfView() {
    const { playerPosition, FOV, dungeonMap } = this;
    this.playerFov = FOV.fovPos(playerPosition.x, playerPosition.z, VIEW_RADIUS);
    this.visibleTiles = this.playerFov.map((k) => dungeonMap && dungeonMap.tiles[k]).filter((t) => t);
    // visible items TODO
    this.visibleItems = this.items;
  }

  currentDungeonIdx = () => {
    let cidx;
    this.dungeons.some((d, idx) => {
      if (this.dungeonMap.seed === d.seed) {
        cidx = idx;
        return true;
      }
      return false;
    });
    return cidx;
  }

  stairsUp = async () => {
    await this.listSavedDungeons();
    const nextDungeon = this.dungeons[this.currentDungeonIdx() - 1] || this.dungeons[0];
    await this.getDungeon(nextDungeon.seed);
  }

  stairsDown = async () => {
    await this.listSavedDungeons();
    const nextDungeon = this.dungeons[this.currentDungeonIdx() + 1] || this.dungeons[0];
    await this.getDungeon(nextDungeon.seed);
  }

  @action('create dungeon area')
  getDungeon = async (seed, save = false) => {
    // nullify old data
    this.items = null;
    this.dungeonMap = null;
    const dungeonMap = await (await fetch('/dungeon', {
      method: 'post',
      body: JSON.stringify({ seed, save, x: -50, y: -50, w: 250, h: 250 }),
      headers: { 'Content-Type': 'application/json' }
    })).json();
    this.dungeonMap = dungeonMap;
    this.items = flatten(dungeonMap.rooms.map((r) => r.items));
    this.FOV = new FOV(dungeonMap.tiles);
    const firstRoom = dungeonMap.rooms[0];
    this.playerPosition = { x: firstRoom.x + 2, z: firstRoom.y + 2, y: 0 };
    this.updateFieldOfView();
  }

  @action('list saved dungeons')
  listSavedDungeons = async () => {
    this.dungeons = await (await fetch('/dungeons', { method: 'get' })).json();
  }

  @action('path finder')
  pathFinder = async (start, end) => {
    const { seed } = this.dungeonMap;
    const path = await (await fetch('/dungeon/path', {
      method: 'post',
      body: JSON.stringify({ seed, start, end }),
      headers: { 'Content-Type': 'application/json' }
    })).json();
    console.log('result', path);
    return path;
  }

  @action('load all materials')
  loadMaterials = async () => {
    const materials = await (await fetch('/materials')).json();
    runInAction('update materilas state', () => {
      this.materials = materials;
    });
  }

  @action('load object')
  loadObject = async (id: number) => {
    const obj = await (await fetch(`/object/${id}`)).json();
    runInAction('update objects state', () => {
      this.objects3d.push(obj);
    });
  }
}
