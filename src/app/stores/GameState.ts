import { flatten } from "ramda";
import { observable, action, runInAction } from "mobx";
import { FOV } from "../../dungeon/FovMap";
import { TILE_TYPE, VIEW_RADIUS } from "../../dungeon/constants";

export class GameState {
  @observable fetching;
  @observable world;

  @observable dungeonMap;
  @observable tiles;
  @observable materials: any[] = [];
  @observable objects3d: any[] = [];

  @observable keyStateMap: any = {};
  @observable cameraPosition: any = { x: 0, y: 0, z: 0 };
  @observable playerPosition: any = { x: 0, y: 0, z: 0 };

  @observable FOV: any;
  @observable playerFov: any;
  @observable visibleTiles: any;

  @observable visibleItems: any;

  items: any;
  keyDownListener: any;
  keyUpListener: any;

  onKeyDown (event: KeyboardEvent) {
    let x = this.playerPosition.x;
    let y = this.playerPosition.z;
    switch (event.code) {
      case "KeyA":
        x--;
        break;
      case "KeyD":
        x++;
        break;
      case "KeyW":
        y--;
        break;
      case "KeyS":
        y++;
        break;
      default:
        console.log("keydown", event.code);
    }
    const tile = this.dungeonMap && this.dungeonMap.tiles[`x${x}y${y}`];
    if (tile.type !== TILE_TYPE.WALL && tile.type !== TILE_TYPE.CORRIDOR_WALL) {
      this.playerPosition.x = x;
      this.playerPosition.z = y; // screen z is map y
      this.updateFieldOfView();
    }
    this.keyStateMap[event.code] = true;
  }
  onKeyUp (event: KeyboardEvent) {
    this.keyStateMap[event.code] = false;
  }

  @action("bind keyboardevents") bindKeyboardEvents = () => {
    this.keyDownListener = window.addEventListener(
      "keydown",
      this.onKeyDown.bind(this)
    );
    this.keyUpListener = window.addEventListener(
      "keyup",
      this.onKeyUp.bind(this)
    );
  }

  @action("unbind keyboardevents") unbindKeyboardEvents = () => {
    window.removeEventListener("keydown", this.keyDownListener);
    window.removeEventListener("keyup", this.keyUpListener);
  }

  saveWorld (world) {
    this.world = world;
  }

  updateFieldOfView () {
    const { playerPosition, FOV, dungeonMap } = this;
    this.playerFov = FOV.fovPos(playerPosition.x, playerPosition.z, VIEW_RADIUS);
    this.visibleTiles = this.playerFov
      .map(k => dungeonMap && dungeonMap.tiles[k])
      .filter(t => t);
    // visible items TODO
    this.visibleItems = this.items;
  }

  @action("create dungeon area") createDungeonArea = async seed => {
    this.fetching = true;
    const dungeonMap = await (await fetch("/dungeon", {
      method: "post",
      body: JSON.stringify({
        seed,
        x: -50,
        y: -50,
        w: 250,
        h: 250
      }),
      headers: { "Content-Type": "application/json" }
    })).json();
    this.dungeonMap = dungeonMap;
    this.items = flatten(dungeonMap.rooms.map(r => r.items));
    this.FOV = new FOV(dungeonMap.tiles);
    const firstRoom = dungeonMap.rooms[0];
    this.playerPosition = {
      x: firstRoom.x + 2,
      z: firstRoom.y + 2,
      y: 0
    };
    this.updateFieldOfView();
    this.tiles = Object.keys(dungeonMap.tiles).map(k => dungeonMap.tiles[k]);
  }

  @action("load all materials") loadMaterials = async () => {
    this.fetching = true;
    const materials = await (await fetch("/materials")).json();
    runInAction("update materilas state", () => {
      this.materials = materials;
      this.fetching = false;
    });
  }

  @action("load object") loadObject = async (id: number) => {
    this.fetching = true;
    const obj = await (await fetch(`/object/${id}`)).json();
    runInAction("update objects state", () => {
      this.objects3d.push(obj);
      this.fetching = false;
    });
  }
}
