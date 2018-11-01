/*
 * FMOD
 */

import { observable, action, runInAction } from 'mobx';
import { default as FModController } from '../audio/FModController';

export default class SndState {
  fmod: FModController;
  @observable mounted: boolean = false;
  @observable events: any = {};
  @observable instances: any = {};
  @action('FMOD init') init = () => {
    return new Promise((resolve, reject) => {
      try {
        if (this.mounted) {
          throw new Error('FMOD already mounted!');
        }
        this.fmod = new FModController({
          preloadFiles: [
            '/fmod/Master_Bank.bank',
            '/fmod/Master_Bank.strings.bank',
            '/fmod/Music.bank',
            '/fmod/SFX.bank'
          ],
          initApp: () => {
            const { fmod } = this;
            fmod.loadBank('Master_Bank.bank');
            fmod.loadBank('Master_Bank.strings.bank');
            fmod.loadBank('Music.bank');
            fmod.loadBank('SFX.bank');
            // list bank contents
            this.events = fmod.getAllBankEvents('SFX');
            // mark as ready
            this.mounted = true;
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  @action('FMOD create event instance') createEventInstance = (name: string, path: string) => {
    this.instances[name] = this.fmod.getEventInstance(path);
    return this.instances[name];
  }
  @action('FMOD start background music') startBgMusic = () => {
    // ready music if not playing
    if (!this.instances.bgMusic) {
      this.createEventInstance('bgMusic', 'event:/Music/Level 01');
      this.instances.bgMusic.setParameterValue('Progression', 1.0);
      this.instances.bgMusic.setParameterValue('Stinger', 1.0);
      this.instances.bgMusic.start();
    }
  }
}
