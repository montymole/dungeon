import { observable, action, runInAction } from 'mobx'
import { ObjectFlags } from 'typescript';
import { Object3D } from 'three';

export default class AppState {
  @observable timer = 0;
  @observable fetching;
  @observable world;

  @observable materials;
  @observable objects3d;

  constructor() {
    this.objects3d = [];
    setInterval(() => { this.timer += 1; }, 5000);

  }
  resetTimer () {
    this.timer = 0;
  }
  saveWorld (world) {
    this.world = world;
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
