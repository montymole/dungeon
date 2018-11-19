
import { BaseController } from './classes';
import { Dungeon, Tile } from '../../dungeon/DungeonGenerator';

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
    const { x, y, w, h, seed } = this.params;
    const dungeon = getDungeon(seed);
    return dungeon.getArea(x, y, w, h);
  }
}
