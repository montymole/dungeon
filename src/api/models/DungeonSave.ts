import BaseModel from './BaseModel';
import { TABLES } from '../../constants';

export class DungeonSave extends BaseModel {
  readonly id: number;
  name: string;
  seed: string;
  ranking: number;
  static tableName = TABLES.DUNGEONS;
  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      seed: { type: 'string' },
      ranking: { type: 'integer' }
    }
  };
}
