import * as Knex from 'knex';
import { TABLES } from '../constants';


exports.up = async function (knex: Knex) {
  await knex.schema.createTable(TABLES.MATERIALS, (table) => {
    table.increments('id').primary();
    table.string('name');
    table.string('color');
    table.string('shader');
    table.json('props');
  });
};

exports.down = async function (knex: Knex) {
  await knex.schema.dropTable(TABLES.MATERIALS);
};
