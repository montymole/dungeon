
import { BaseController } from './classes';
import { Dungeon } from '../../dungeon/DungeonGenerator';
import { DungeonSave } from '../models/DungeonSave';

const dungeons = {};

function getDungeon (seed = 'ROGUE') {
  if (!dungeons[seed]) {
    dungeons[seed] = new Dungeon(seed);
    dungeons[seed].createArea(1, 10, 7);
  }
  return dungeons[seed];
}

export class RevealArea extends BaseController {
  static routes = ['POST /dungeon'];
  async response () {
    const { x, y, w, h, seed, save, name } = this.params;
    const dungeon = getDungeon(seed);
    if (save) {
      await DungeonSave.createOrUpdate({ seed, name: name || seed });
    }
    return dungeon.getArea(x, y, w, h);
  }
}

export class SavedDungeons extends BaseController {
  static routes = ['GET /dungeons'];
  async response () {
    return await DungeonSave.query();
  }
}
