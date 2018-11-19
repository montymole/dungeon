import { Dungeon } from './DungeonGenerator';

const myDungeon = new Dungeon('ROGUE');
myDungeon.createArea(0, 0, 10);
myDungeon.toString(-20, -20, 200, 100);
