import { observable } from 'mobx';
export default class AppState {
  @observable timer = 0;
  @observable world;
  constructor() { setInterval(() => { this.timer += 1; }, 1000); }
  resetTimer () {
    this.timer = 0;
  }
  saveWorld (world) {
    this.world = world;
  }
}
