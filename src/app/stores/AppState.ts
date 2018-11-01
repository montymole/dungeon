import { observable, action, runInAction } from 'mobx';

export default class AppState {
  @observable fetching;
  @observable world;

  @observable materials: any[] = [];
  @observable objects3d: any[] = [];

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
