import BaseModel from "./BaseModel";
import { TABLES } from "../../constants";
import { default as s } from "./addSchema";

export class DungeonSave extends BaseModel {
  @s readonly id: number;
  @s name: string;
  @s seed: string;
  @s ranking: number;
  static tableName = TABLES.DUNGEONS;
}
