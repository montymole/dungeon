
import BaseModel from './BaseModel';
import { TABLES } from '../../constants';

export default class Instance3D extends BaseModel {
  readonly id: number;
  name: string;

  static tableName = TABLES.INSTANCES;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' }
    }
  };
}
