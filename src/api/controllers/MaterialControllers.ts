import { Material } from '../models';
import { BaseController } from './classes';

export class CreateOrUpdateMaterial extends BaseController {
  static routes = ['POST /material', 'PUT /material', 'PUT /material/:id'];
  async response() {
    const { id, name, shader, props } = this.params;
    return await Material.createOrUpdate({ id, name, shader, props });
  }
}

export class GetMaterial extends BaseController {
  static routes = ['GET /material/:id'];
  async response() {
    const { id } = this.params;
    return await Material.query().findById(id);
  }
}

export class ListMaterials extends BaseController {
  static routes = ['GET /materials', 'GET /materiallist'];
  async response() {
    return await Material.query();
  }
}
