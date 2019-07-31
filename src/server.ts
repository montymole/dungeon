'use strict';

import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as http from 'http';
import * as Knex from 'knex';
import api from './api/api';
import { BINARY_SAVE_PATH, DOWNLOAD_PATH } from './constants';
import * as knexfile from './knexfile';

const environment = process.env.ENVIRONMENT || 'development';

const app = express();
const server = http.createServer(app);

// create knex connection
const knex = Knex(knexfile[environment]);

console.log('--------------------------------------------');
console.log(environment, knexfile[environment]);
console.log('--------------------------------------------');

// add crossdomain headers
app.use(cors({ exposedHeaders: ['Link'] }));

// POST body parasing
app.use(bodyParser.json({ limit: '100kb' }));

// compress all responses
app.use(compression());

// secure with helmet https://helmetjs.github.io/
app.use(helmet());

// add api to paths
app.use('/', api({ knex }));

// serve static files
app.use('/app', express.static('./dist/app'));
app.use('/', express.static('./static'));
app.use(DOWNLOAD_PATH, express.static(BINARY_SAVE_PATH));

console.log('Running in :', environment);
server.listen(process.env.PORT || 8080, () => {
  const addressInfo: any = server.address();
  console.log(`Started on port ${addressInfo.port} time : ${new Date()}`);
});

export { server };

export default app;
