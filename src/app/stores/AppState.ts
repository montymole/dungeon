import { observable, action, runInAction } from 'mobx';
import { throws } from 'assert';

export default class AppState {
  @observable fetching;
  @observable world;

  @observable dungeonMap;
  @observable tiles;
  @observable materials: any[] = [];
  @observable objects3d: any[] = [];

  @observable keyStateMap: any = {};
  @observable cameraPosition: any = { x: 50, y: 50, z: 20 };

  keyDownListener: any;
  keyUpListener: any;

  onKeyDown (event: KeyboardEvent) {
    this.keyStateMap[event.code] = true;
  }
  onKeyUp (event: KeyboardEvent) {
    this.keyStateMap[event.code] = false;
  }

  @action('bind keyboardevents') bindKeyboardEvents = () => {
    this.keyDownListener = window.addEventListener('keydown', this.onKeyDown.bind(this));
    this.keyUpListener = window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  @action('unbind keyboardevents') unbindKeyboardEvents = () => {
    window.removeEventListener('keydown', this.keyDownListener);
    window.removeEventListener('keyup', this.keyUpListener);
  }

  saveWorld (world) {
    this.world = world;
  }

  @action('create dungeon area') createDungeonArea = async () => {
    this.fetching = true;
    const dungeonMap = await (await fetch('/dungeon', {
      method: 'post',
      body: JSON.stringify({
        x: -20, y: -20, w: 40, h: 40
      }),
      headers: { 'Content-Type': 'application/json' }
    })).json();
    this.dungeonMap = dungeonMap;
    this.tiles = Object.keys(dungeonMap).map(k => dungeonMap[k]);
  }



  @action('load all materials') loadMaterials = async () => {
    this.fetching = true;
    const materials = await (await fetch('/materials')).json();
    runInAction('update materilas state', () => {
      this.materials = materials;
      this.fetching = false;
    });
  }

  @action('load object') loadObject = async (id: number) => {
    this.fetching = true;
    const obj = await (await fetch(`/object/${id}`)).json();
    runInAction('update objects state', () => {
      this.objects3d.push(obj);
      this.fetching = false;
    });
  }

}
