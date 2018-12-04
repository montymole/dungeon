// Update with your config settings.
const config = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: 'root',
      password: '',
      database: process.env.DATABASE || 'dungeon',
    },
    migrations: {
      directory: './migrations',
      extensions: ['.ts'],
      stub: './migrationStub.ts',
    },
    dbManager: {
      collate: ['fi_FI.UTF-8', 'utf8_swedish_ci'],
      superUser: 'root',
      superPassword: '',
    },
  },
  /**
   * @todo Assign a non-root user with a proper password before deploying!
   */
  production: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST || 'mariadb',
      user: 'root',
      password: '',
      database: process.env.DATABASE || 'dungeon',
    },
    migrations: {
      directory: './migrations',
      extensions: ['.ts'],
      stub: './migrationStub.ts',
    },
    dbManager: {
      collate: ['fi_FI.UTF-8', 'utf8_swedish_ci'],
      superUser: 'root',
      superPassword: '',
    },
  },
};
module.exports = config;
export default config;
