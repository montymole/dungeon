/*
 * FMOD
 */

import { merge } from "ramda";
import { observable, action, runInAction } from "mobx";
import { default as FModController } from "../audio/FModController";

export class FMODState {
  fmod: FModController;
  @observable fetching;
  @observable mounted: boolean = false;
  @observable events: any = {};
  @observable instances: any = {};
  @action("FMOD init") init = async () => {
    this.fetching = true;
    return new Promise((resolve, reject) => {
      try {
        if (this.mounted) {
          throw new Error("FMOD already mounted!");
        }
        const preloadFiles = ["/fmod/music/Master.bank", "/fmod/music/Master.strings.bank"];
        this.fmod = new FModController({
          preloadFiles,
          initApp: () => {
            const { fmod } = this;
            fmod.loadBank('Master.bank');
            fmod.loadBank('Master.strings.bank');
            // mark as ready
            this.mounted = true;
            this.fetching = false;
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };
  @action("FMOD create event instance") createEventInstance = (
    name: string,
    event: any
  ) => {
    this.instances[name] = this.fmod.createEventInstance(event);
    return this.instances[name];
  };
  @action("FMOD start background music") startBgMusic = () => {
    // ready music if not playing
    if (!this.instances.bgMusic) {
      this.events.bgMusic = this.fmod.getEventInstance('event:/Master/music');
      this.createEventInstance("bgMusic", this.events.bgMusic);
      this.instances.bgMusic.setParameterValue('progression', 1.0);
      this.instances.bgMusic.start();
    }
  };
}
