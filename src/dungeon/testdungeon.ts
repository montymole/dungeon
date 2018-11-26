import { Dungeon } from "./DungeonGenerator";

const myDungeon = new Dungeon("ROGUELIKE2");
myDungeon.createArea(0, 0, 10);
myDungeon.toString(-20, -20, 200, 100);
console.log(myDungeon.rooms.map(r => r.name));
