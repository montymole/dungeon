import { BaseController } from "./classes";
import { Dungeon } from "../../dungeon/DungeonGenerator";
import { DungeonSave } from "../models/DungeonSave";
import { PathFinder } from "../../dungeon/PathFinder";
import { start } from "repl";

const dungeons = {};

function getDungeon(seed = "ROGUE") {
  if (!dungeons[seed]) {
    dungeons[seed] = new Dungeon(seed);
    dungeons[seed].createArea(1, 10, 7);
  }
  return dungeons[seed];
}

export class RevealArea extends BaseController {
  static routes = ["POST /dungeon"];
  async response() {
    const { x, y, w, h, seed, save, name } = this.params;
    const dungeon = getDungeon(seed);
    if (save) {
      try {
        await DungeonSave.createOrUpdate({ seed, name: name || seed });
      } catch (error) {
        console.error("no db?");
      }
    }
    return dungeon.getArea(x, y, w, h);
  }
}

export class SavedDungeons extends BaseController {
  static routes = ["GET /dungeons"];
  async response() {
    try {
      return await DungeonSave.query();
    } catch (error) {
      console.error("no db?");
      return Object.keys(dungeons).map((k, i) => ({ id: i, seed: k, name: k }));
    }
  }
}

export class FindPath extends BaseController {
  static routes = ["POST /dungeon/path"];
  async response() {
    const { seed, start, end } = this.params;
    const dungeon = getDungeon(seed);
    const pf = new PathFinder(dungeon.tilemap);
    const path = await pf.findPath(start.x, start.y, end.x, end.y);
    console.log("path:", path);
    return { path };
  }
}
