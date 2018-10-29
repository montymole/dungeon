import * as Knex from 'knex';
import { TABLES } from '../constants';


exports.up = async function (knex: Knex) {
  await knex.schema.createTable(TABLES.VECTORS, (table) => {
    table.increments('id').primary();
    table.string('name');
    table.float('x');
    table.float('y');
    table.float('z');
  });
  await knex.schema.createTable(TABLES.OBJECTS, (table) => {
    table.increments('id').primary();
    table.string('name').index();
    table.string('shape'); // placeholder primitive shape PLANE, CUBE ...
    table.integer('scaleVecId').unsigned().nullable().references(TABLES.VECTORS + '.id');
    table.integer('materialId').unsigned().nullable().references(TABLES.MATERIALS + '.id');
  });
  await knex.schema.createTable(TABLES.INSTANCES, (table) => {
    table.increments('id').primary();
    table.string('name');
    table.float('x').index();
    table.float('y').index();
    table.float('z').index();
    table.float('mass');
    table.integer('parentInstanceId').unique().nullable(); // parent instance
    table.integer('objectId').unsigned().nullable().references(TABLES.OBJECTS + '.id');         // form object
    table.integer('scaleVecId').unsigned().nullable().references(TABLES.VECTORS + '.id');       // scale vector
    table.integer('velocityVecId').unsigned().nullable().references(TABLES.VECTORS + '.id');    // velocity vector
  });
};

exports.down = async function (knex: Knex) {
  await knex.schema.dropTable(TABLES.INSTANCES);
  await knex.schema.dropTable(TABLES.OBJECTS);
  await knex.schema.dropTable(TABLES.VECTORS);
};
