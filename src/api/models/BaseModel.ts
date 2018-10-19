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
}
