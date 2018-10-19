import { observable, action, runInAction } from 'mobx'

export default class AppState {
  @observable timer = 0;
  @observable fetching;
  @observable world;

  @observable materials;

  constructor() { setInterval(() => { this.timer += 1; }, 5000); }
  resetTimer () {
    this.timer = 0;
  }
  saveWorld (world) {
    this.world = world;
  }

  @action('load all materials')
  loadMaterials = async () => {
    this.fetching = true;
    const materials = await (await fetch('/materials')).json();
    runInAction('update materilas state', () => {
      this.materials = materials;
      this.fetching = false;
    });

  }

}
