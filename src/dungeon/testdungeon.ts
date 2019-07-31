import { Dungeon } from './DungeonGenerator';

const myDungeon = new Dungeon('ROGUELIKE2');
myDungeon.createArea(0, 0, 2);
// myDungeon.testMaze(0, 0, 40, 40);
myDungeon.toString(-2, -2, 44, 44);

console.log(
  myDungeon.rooms.map((r) => `${r.name} items:${r.items.map((i) => i.name)}`)
);
