/*
 * FMOD
 */

import { merge } from 'ramda';
import { observable, action, runInAction } from 'mobx';
import { default as FModController } from '../audio/FModController';

export class FMODState {
  fmod: FModController;
  @observable fetching;
  @observable mounted: boolean = false;
  @observable events: any = {};
  @observable instances: any = {};
  @action('FMOD init') init = async () => {
    this.fetching = true;
    const list = await (await fetch('/binlist?type=FMOD')).json();
    return new Promise((resolve, reject) => {
      try {
        if (this.mounted) {
          throw new Error('FMOD already mounted!');
        }
        const preloadFiles = list.map(b => b.downloadpath);

        this.fmod = new FModController({
          preloadFiles,
          initApp: () => {
            const { fmod } = this;
            let events = {};
            list.forEach((b) => {
              try {
                const bank = fmod.loadBank(b.name);
                if (!bank.events) {
                  throw new Error('invalid bank, no events');
                }
                events = merge(events, bank.events);
              } catch (err) {
                console.log('invalid bank', b);
                console.log(err);
              }
            });
            // save events
            this.events = events;
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
  }
  @action('FMOD create event instance') createEventInstance = (name: string, event: any) => {
    this.instances[name] = this.fmod.createEventInstance(event);
    return this.instances[name];
  }
  @action('FMOD start background music') startBgMusic = () => {
    // ready music if not playing
    console.log('MUZAK', this.instances);
    if (!this.instances.bgMusic && this.events.MusicLevel01) {
      this.createEventInstance('bgMusic', this.events.MusicLevel01);
      //  this.instances.bgMusic.setParameterValue('Progression', 1.0);
      //  this.instances.bgMusic.setParameterValue('Stinger', 1.0);
      this.instances.bgMusic.start();
    }
  }
}
