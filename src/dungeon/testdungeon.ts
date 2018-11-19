import { Dungeon } from './DungeonGenerator';

const myDungeon = new Dungeon();
myDungeon.createArea(20, 20, 0);
myDungeon.toString(-20, -20, 200, 100);
