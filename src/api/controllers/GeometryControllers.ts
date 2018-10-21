import { BaseController } from './classes';
import { Vector3D, Object3D } from '../models';

export class CreateOrUpdateVector extends BaseController {
  static routes = ['POST /vector', 'PUT /vector', 'PUT /vector/:id'];
  async response () {
    const { id, name, x, y, z } = this.params;
    return await Vector3D.createOrUpdate({ id, name, x, y, z });
  }
}

export class GetVector extends BaseController {
  static routes = ['GET /vector/:id'];
  async response () {
    const { id } = this.params;
    return await Vector3D.query().findById(id);
  }
}

export class CreateOrUpdateObject extends BaseController {
  static routes = ['POST /object', 'PUT /object', 'PUT /object/:id'];
  async response () {
    const { id, name, shape, materialId, material, scaleVecId, scale, } = this.params;
    if (!scale.name) { scale.name = `object ${name} scale`; }
    return await Object3D.createOrUpdateGraph({ id, name, shape, materialId, scaleVecId, material, scale });
  }
}

export class GetObject extends BaseController {
  static routes = ['GET /object/:id'];
  async response () {
    const { id } = this.params;
    return await Object3D.findById(id);
  }
}
