
import BaseModel from './BaseModel';
import { Vector3D, Material } from './';
import { TABLES } from '../../constants';

export default class Object3D extends BaseModel {
  readonly id: number;
  name: string;
  shape: string;
  scaleVecId: number;
  materialId: number;

  static tableName = TABLES.OBJECTS;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' }
    }
  };

  static relationMappings = {
    material: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Material,
      join: {
        from: Object3D.tableName + '.materialId',
        to: Material.tableName + '.id'
      },
    },
    scale: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Vector3D,
      join: {
        from: Object3D.tableName + '.scaleVecId',
        to: Vector3D.tableName + '.id'
      }
    }
  };

  static async findById (id) {
    return this.query().findById(id).joinEager('[scale,material]');
  }
}


