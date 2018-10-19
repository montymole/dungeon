
import BaseModel from './BaseModel';
import { TABLES } from '../../constants';

export default class Material extends BaseModel {
  readonly id: number;
  name: string;
  shader: string;
  props: object;
  static tableName = TABLES.MATERIALS;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      shader: { type: 'string' },
      props: { type: 'object' }
    },
  };
}
