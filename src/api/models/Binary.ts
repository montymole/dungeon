import BaseModel from './BaseModel';
import { TABLES, DOWNLOAD_PATH } from '../../constants';

export default class Binary extends BaseModel {
  readonly id: number;
  contentType: string;
  name: string;
  size: number;
  filepath: string;
  static tableName = TABLES.BINARIES;
  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      contentType: { type: 'string' },
      name: { type: 'string' },
      size: { type: 'number' },
      filepath: { type: 'string' }
    }
  };
  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.filepath;
    json.downloadpath = `${DOWNLOAD_PATH}/${json.name}`
    return json;
  }
}
