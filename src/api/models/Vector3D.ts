
import BaseModel from './BaseModel';
import { TABLES } from '../../constants';

export default class Vector3D extends BaseModel {
  readonly id: number;
  name: string;
  x: number;
  y: number;
  z: number;

  static tableName = TABLES.VECTORS;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      x: { type: 'float' },
      y: { type: 'float' },
      z: { type: 'float' }
    },
  };
}
