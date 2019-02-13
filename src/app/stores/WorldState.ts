import { observable, action, runInAction } from "mobx";

export class WorldState {
  @observable world;
  saveWorld(world) {
    this.world = world;
  }
}