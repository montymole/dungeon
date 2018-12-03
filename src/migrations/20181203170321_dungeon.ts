import * as Knex from 'knex';
import { TABLES } from '../constants';

exports.up = async function (knex: Knex) {
  await knex.schema.createTable(TABLES.DUNGEONS, (table) => {
    table.increments('id').unsigned().primary();
    table.string('seed').unique();
    table.string('name');
    table.integer('ranking').unsigned().defaultTo(0);
  });
};

exports.down = async function (knex: Knex) {
  await knex.schema.dropTable(TABLES.DUNGEONS);
};
