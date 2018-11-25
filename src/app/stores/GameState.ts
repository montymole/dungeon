import { observable, action, runInAction } from "mobx";
import { TILE_TYPE, TILE_SUB_TYPE } from "../../dungeon/constants";

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

  keyDownListener: any;
  keyUpListener: any;

  onKeyDown(event: KeyboardEvent) {
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
    }
    this.keyStateMap[event.code] = true;
  }
  onKeyUp(event: KeyboardEvent) {
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
  };

  @action("unbind keyboardevents") unbindKeyboardEvents = () => {
    window.removeEventListener("keydown", this.keyDownListener);
    window.removeEventListener("keyup", this.keyUpListener);
  };

  saveWorld(world) {
    this.world = world;
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
    const firstRoom = dungeonMap.rooms[0];
    this.playerPosition = {
      x: Math.round(firstRoom.x + firstRoom.w / 2),
      y: 0,
      z: Math.round(firstRoom.y + firstRoom.w / 2)
    };
    this.tiles = Object.keys(dungeonMap.tiles).map(k => dungeonMap.tiles[k]);
  };

  @action("load all materials") loadMaterials = async () => {
    this.fetching = true;
    const materials = await (await fetch("/materials")).json();
    runInAction("update materilas state", () => {
      this.materials = materials;
      this.fetching = false;
    });
  };

  @action("load object") loadObject = async (id: number) => {
    this.fetching = true;
    const obj = await (await fetch(`/object/${id}`)).json();
    runInAction("update objects state", () => {
      this.objects3d.push(obj);
      this.fetching = false;
    });
  };
}
