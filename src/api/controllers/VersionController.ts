import { BaseController } from './classes';

export default class VersionController extends BaseController {
  static routes = ['/version'];
  async response() {
    return {
      node: process.version,
      app: process.env.npm_package_version
    };
  }
}
