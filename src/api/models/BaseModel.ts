import { Model } from 'objection';

export default class BaseModel extends Model {
  static async createOrUpdate (opts) {
    if (opts.id) {
      const { id } = opts;
      delete opts.id;
      return this.query().updateAndFetchById(id, opts);
    }
    return this.query().insertAndFetch(opts);
  }
  static async createOrUpdateGraph (opts) {
    if (opts.id) {
      return await this.query().upsertGraph(opts);
    }
    return await this.query().insertGraph(opts);
  }
}
