import { BaseController } from './classes';

// html page template
function html (opts: any): any {
  return (`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${opts.title} ${opts.version}</title>
    <link rel="stylesheet" type="text/css" href="${opts.cssSrc}"/>
  </head>
  <body>
    <div id="root"><h1>...</h1></div>
    <script src="/fmodstudio.js"></script>
    <script src="${opts.appSrc}"></script>
  </body>
</html>
`);
}

export class IndexController extends BaseController {
  // all these are bind to same react app with client side routing
  static routes = ['/'];
  async response () {
    const opts = {
      title: process.env.npm_package_name,
      version: process.env.npm_package_version,
      appSrc: '/app/client.js',
      cssSrc: '/app/client.css'
    };
    return { html: html(opts) };
  }
}
