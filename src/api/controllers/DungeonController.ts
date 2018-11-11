
import { BaseController } from './classes';
import { Dungeon, Tile } from '../../dungeon/DungeonGenerator';
export class RevealArea extends BaseController {
    static routes = ['POST /dungeon'];
    async response() {
        const { x, y, w, h } = this.params;
        const d = new Dungeon();
        d.createArea(x,y,w,h,10);
        return  d.getArea(x,y,w,h);
    }
}