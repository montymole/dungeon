import { Dungeon } from './DungeonGenerator';



const myDungeon = new Dungeon('my2');


myDungeon.createArea(0, 0, 20, 20, 20);

myDungeon.toString(-20, -20, 200, 100);
