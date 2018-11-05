import { createWriteStream } from 'fs';
import * as Busboy from 'busboy';
import { BaseController, ControllerError } from './classes';
import { Binary } from '../models';
import { BINARY_SAVE_PATH } from '../../constants';

export class UploadBin extends BaseController {
  static routes = ['POST /bin'];
  async response () {
    return await new Promise((resolve, reject) => {
      const busboy = new Busboy({ headers: this.req.headers });
      let filepath;
      busboy.on('file', (fieldname, fileStream, name, encoding, contentType) => {
        filepath = `${BINARY_SAVE_PATH}/${name}`;
        const fileWriteStream = createWriteStream(filepath);
        fileStream.pipe(fileWriteStream);
        fileStream.on('end', async () => {
          const size = fileWriteStream.bytesWritten;
          fileWriteStream.end();
          // old file (same name)
          const exists = await Binary.query().findOne({ filepath });
          let result;
          if (exists)
            result = await Binary.query().updateAndFetchById(exists.id, { name, filepath, contentType, size });
          else
            result = await Binary.query().insertAndFetch({ name, filepath, contentType, size });
          resolve(result);
        });
      });
      busboy.on('error', error => reject(error));
      this.req.pipe(busboy);
    });
  }
}

export class GetBin extends BaseController {
  static routes = ['GET /bin/:id', 'GET /bin', 'GET /binlist', 'GET /bins'];
  async response () {
    const { id, type } = this.params;
    const query = Binary.query();
    if (id) {
      return await query.findById(id);
    }
    if (type) {
      query.where({type});
    }
    return await query;
  }
}

export class DelBin extends BaseController {
  static routes = ['DELETE /bin/:id'];
  async response () {
    const { id } = this.params;
    return await Binary.query().findById(id).del();
  }
}
