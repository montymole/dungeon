import { BaseController } from './classes';

// html page template
function html(opts: any): any {
  return (`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${opts.title} ${opts.version}</title>
    <link rel="stylesheet" type="text/css" href="${opts.cssSrc}"/>
    <script>
      window.app = "${opts.app}";
    </script>
  </head>
  <body>
    <div id="root"><!--APP--></div>
    <script src="${opts.appSrc}"></script>
  </body> 
</html>
`);
}

export class IndexController extends BaseController {
  sendRes(result) {
    this.res.status(200);
    this.res.send(result);
  }
  // all these are bind to same react app with client side routing
  static routes = ['/:app'];
  static paramSchema = {
    type: 'object',
    properties: {
      app: { type: 'string' }
    }
  };
  async response() {
    const opts = {
      title: process.env.npm_package_name,
      version: process.env.npm_package_version,
      app: this.params.app || 'xenocide',
      appSrc: '/app/client.js',
      cssSrc: '/app/client.css'
    };
    return html(opts);
  }
}
