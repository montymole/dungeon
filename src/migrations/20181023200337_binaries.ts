import * as Knex from 'knex';
import { TABLES } from '../constants';

exports.up = async function (knex: Knex) {
  await knex.schema.createTable(TABLES.BINARIES, (table) => {
    table.increments('id').unsigned().primary();
    table.string('name');
    table.string('contentType');
    table.integer('size').unsigned();
    table.string('filepath');             // saved to filesystem
  });
};

exports.down = async function (knex: Knex) {
  await knex.schema.dropTable(TABLES.BINARIES);
};
